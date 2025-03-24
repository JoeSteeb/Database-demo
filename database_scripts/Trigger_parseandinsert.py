import argparse
from distutils.command import clean
from functools import reduce
from io import TextIOWrapper
import json
import os.path as path
import re
from typing import Callable, Dict, List, Tuple
import time
import calendar

import psycopg2.extensions
from psycopg2.extras import execute_values

def cleanStr4SQL(s):
    return s.replace("'", "`").replace("\n", " ")


def flattenHelper(flattenedItems: List[Tuple[str, any]], item: Tuple[str, any]) -> List[Tuple[str, any]]:
    if(isinstance(item[1], dict)):
        # Does not concatenate names
        # flattenedItems.extend(flatten(item[1]))

        # Does concatenate names
        flattenedItems.extend(map(lambda nestedItem: (
            f"{item[0]}.{nestedItem[0]}", nestedItem[1]), flatten(item[1])))
    else:
        flattenedItems.append(item)
    return flattenedItems


def flatten(attribute: dict):
    if attribute is None:
        return []
    return reduce(flattenHelper, attribute.items(), [])



def parseData(data_directory: str, dataName: str, cursor: psycopg2.extensions.cursor, processLine: Callable[[Dict[str, any], psycopg2.extensions.cursor], None]):
    with open(path.join(data_directory, f"yelp_{dataName}.json"), 'r') as f:
        count_line = 0
        batch_size = 400000  # Adjust based on memory availability
        data = []

        for line in f:
            data.append(json.loads(line))
            count_line += 1

            if len(data) >= batch_size:
                processLine(data, cursor)
                data.clear()  # Free memory after processing

        if data:
            processLine(data, cursor)  # Process remaining data

    print(dataName, count_line)



def writeBusinessData(data: Dict[str, any], cursor: psycopg2.extensions.cursor):
    business_data = []
    category_data = []
    attr_data = []
    hours_data = []
    for item in data:
        # Ensure 'categories' is present and not None
        categories = item.get('categories', '')
        if categories:
            categories = categories.split(', ')
        else:
            categories = []  # default to an empty list if 'categories' is missing or None
        
        business_data.append(
            (
                cleanStr4SQL(item['business_id']), 
                cleanStr4SQL(item["name"]), 
                cleanStr4SQL(item['address']),
                cleanStr4SQL(item['state']),
                cleanStr4SQL(item["city"]),
                cleanStr4SQL(item["postal_code"]), 
                item["latitude"], 
                item["longitude"],
                item["stars"],
                0, 0,
                [False, True][item["is_open"]]
            ) 
        )

        # Process business categories
        for category in categories:
            category_data.append(
                (
                    item['business_id'], 
                    category
                ) 
            )

        # TO-DO : process attributes
        for attr, val in flatten(item["attributes"]):
            attr_data.append(
                (
                    item['business_id'],
                    attr,
                    val
                )
            )
        
        # Handle hours
        if item.get("hours") and isinstance(item["hours"], dict):
            for day, open_close in item["hours"].items():
                open_time, close_time = open_close.split("-")
                hours_data.append(
                    (
                        item['business_id'],
                        day,
                        open_time,
                        close_time
                    )
                )


    # Execute the insert statements
    execute_values(cursor, "INSERT INTO Business (business_id, business_name, business_address, business_state, city, zip, latitude, longitude, stars, numCheckins, tip_count, is_open) VALUES %s", business_data)
    category_data = list(set(category_data))  # Remove duplicates
    execute_values(cursor, "INSERT INTO Category (business_id, category) VALUES %s", category_data)       
    execute_values(cursor, "INSERT INTO Attribute (business_id, attribute, val) VALUES %s", attr_data)
    execute_values(cursor,  "INSERT INTO OperatingHours (business_id, day_of_the_week, open_time, close_time) VALUES %s", hours_data)





def writeUserData(data: Dict[str, any], cursor: psycopg2.extensions.cursor):
    users_insert = "INSERT INTO Users (user_id, user_name, yelping_since, tip_count, fan_count, average_stars, funny, useful, cool, longitude, latitude, likes_count) VALUES %s"
    user_data = []
    for dict in data:
        user_data.append(
            (
                cleanStr4SQL(dict['user_id']) if 'user_id' in dict else None,
                cleanStr4SQL(dict["name"]) if 'name' in dict else None,
                cleanStr4SQL(dict["yelping_since"]) if 'yelping_since' in dict else None,
                dict["tipcount"] if 'tipcount' in dict else None,
                dict["fans"] if 'fans' in dict else None,
                dict["average_stars"] if 'average_stars' in dict else None,
                dict["funny"] if 'funny' in dict else None,
                dict["useful"] if 'useful' in dict else None,
                dict["cool"] if 'cool' in dict else None,
                0, 0, 0  # These will remain as 0
            )
        )

    
    execute_values(cursor, users_insert, user_data)


def writeFriendData(data: Dict[str, any], cursor: psycopg2.extensions.cursor):
    friend_insert = "INSERT INTO FriendedUser (user_id, friended_by_id) VALUES %s ON CONFLICT (user_id, friended_by_id) DO NOTHING"
    friend_data = [] 

    # Check existing user_ids in users table
    cursor.execute("SELECT user_id FROM users")
    existing_user_ids = set([row[0] for row in cursor.fetchall()])

    for dict in data:
        user_id = cleanStr4SQL(dict['user_id'])
        
        # Only process if user_id exists in the users table
        if user_id in existing_user_ids:
            for friend_id in dict["friends"]:
                # Add friended_by_id and user_id if both exist in users table
                if friend_id in existing_user_ids:
                    friend_data.append(
                        (
                            user_id,  # friended_by_id
                            cleanStr4SQL(friend_id)  # user_id
                        )
                    )
    
    # Insert only valid data
    if friend_data:
        execute_values(cursor, friend_insert, friend_data)



def writeCheckinData(data: Dict[str, any], cursor: psycopg2.extensions.cursor):
    checkin_insert = "INSERT INTO CheckIn (business_id, checkin_date) VALUES %s ON CONFLICT (business_id, checkin_date) DO NOTHING"
    checkin_data = []
    for dict in data:
        dates: List[str] = dict["date"].split(",")
        for date in dates:
            checkin_data.append(
                (
                    cleanStr4SQL(dict['business_id']),
                    date
                )
            )
    
    execute_values(cursor, checkin_insert, checkin_data)


def writeTipData(data: Dict[str, any], cursor: psycopg2.extensions.cursor):
    tip_insert = "INSERT INTO Tip (user_id, business_id, date_posted, body, likes) VALUES %s"
    tip_data = []
    for dict in data:
        tip_data.append(
            (
                cleanStr4SQL(dict['user_id']),
                cleanStr4SQL(dict['business_id']),
                dict['date'],
                dict['text'],
                dict.get('likes', 0)
            )
        )
    
    execute_values(cursor, tip_insert, tip_data)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Parses through database outputs to generate SQL INSERT statements.\nPrecondition: Tables must be created OR Trigger_ER_v1_schema.sql present and reset flag set. yelp_data.zip must be unzipped.")
    # parser.add_argument(
    #     '-o', '--output', metavar='OUTPUT_PATH', required=True,
    #     help="required path to output directory (which we intend to read from)")
    parser.add_argument(
        "-r", "--reset", action='store_true',
        help='If set, will delete and recreate the given database with the schema in Trigger_ER_RELATIONS_v3.sql')
    parser.add_argument(
        '-d', '--database', metavar='DATABASE',
        required=True, help='SQL database to INSERT into')
    parser.add_argument(
        '-u', '--username', metavar='USERNAME',
        default='postgres', help='Username for database')
    parser.add_argument(
        '-p', '--password', metavar='PASSWORD',
        required=True, help='Password for database')
    parser.add_argument(
        '-t', '--data-directory', metavar='DATA_DIRECTORY',
        help='yelp-data directory', required=True)
    parser.add_argument(
        '-b', '--base-directory', metavar='BASE_DIRECTORY',
        help='Directory containing DBSchema/ and SQLScripts/', default=".")
    
    args = parser.parse_args()

    cursor: psycopg2.extensions.cursor = None
    conn: psycopg2.extensions.connection = None
    if(args.reset):
        conn = psycopg2.connect(
            f"dbname=postgres user='{args.username}' host='localhost' password='{args.password}'")

        conn.autocommit = True
        cursor = conn.cursor()
        cursor.execute(f"DROP DATABASE IF EXISTS {args.database};")
        cursor.execute(f"CREATE DATABASE {args.database};")
        conn.close()

        conn = psycopg2.connect(
            f"dbname='{args.database}' user='{args.username}' host='localhost' password='{args.password}'")
        conn.autocommit = True
        cursor = conn.cursor()
        with open(path.join(args.base_directory,"database_schema",'Trigger_ER_RELATIONS_v2.sql')) as schema:
            cursor.execute(schema.read())
        with open(path.join(args.base_directory,"database_scripts",'Trigger_UPDATE.sql')) as update:
            cursor.execute(update.read())
        with open(path.join(args.base_directory,"database_scripts",'Trigger_TRIGGER.sql')) as trigger:
            cursor.execute(trigger.read())
        conn.autocommit = False
        print(f"Database {args.database} reset")

    else:
        conn: psycopg2.extensions.connection = psycopg2.connect(
            f"dbname='{args.database}' user='{args.username}' host='localhost' password='{args.password}'")
        cursor = conn.cursor()

    start_time = time.time()
    # parseData(args.data_directory, "business", cursor, writeBusinessData)
    # conn.commit()

    # parseData(args.data_directory, "user", cursor, writeUserData)
    # conn.commit()

    # parseData(args.data_directory, "user", cursor, writeFriendData)
    # conn.commit()

    # parseData(args.data_directory, "checkin", cursor, writeCheckinData)
    # conn.commit()

    parseData(args.data_directory, "tip", cursor, writeTipData)
    conn.commit()

    cursor.close()
    conn.close()
    print("--- execution time ---\n" + str(time.strftime("%Mm%Ss", time.gmtime(time.time()-start_time))))
