import { Router, Request, Response } from "express";
import sqlLogin from "@/sqlLogin.json";
import postgres from "postgres";
import * as db from "./databaseInterface";
import { get } from "http";
const router = Router();

const sql = postgres({
  host: sqlLogin.host,
  port: sqlLogin.port,
  database: sqlLogin.database,
  username: sqlLogin.username,
  password: sqlLogin.password,
});

const getColumns = async (tableName: string) => {
  const result = await sql`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = ${tableName};
  `;
  return result.map((row: { column_name: string }) => row.column_name);
};

router.post("/columnsInTable", (req: Request, res: Response, next) => {
  (async () => {
    let tableName = req.body.tableName as string; // <-- now coming from body instead of query
    if (!tableName) {
      tableName = "users"; // Default if not provided
    }
    console.log(`Table: ${tableName} columns requested`);
    try {
      const result = await getColumns(tableName);
      res.json(result);
    } catch (error) {
      console.error(error);
      next(error);
    }
  })();
});

router.post("/getUser", async (req: Request, res: Response) => {
  const validColumns = await getColumns("users");
  console.log("validColumns: " + validColumns);
  let orderString = "ORDER BY ";
  const {
    likeFilters = "",
    orderList = ["user_id"],
    offset = 0,
    limit = 20,
  } = req.body as {
    likeFilters?: db.LikeFilter[];
    orderList?: [];
    offset?: number;
    limit?: number;
  };

  if (orderList.length < 1) {
    orderString = "ORDER BY user_id";
  }

  for (let i = 0; i < orderList.length; i++) {
    const orderer = orderList[i];
    if (validColumns.includes(orderer)) {
      orderString += `${orderer}`;
      if (i < orderList.length - 1) {
        orderString += ", ";
      }
    } else {
      orderString = "ORDER BY user_name";
    }
  }

  console.log("orderString: " + orderString);

  const username = Array.isArray(likeFilters)
    ? likeFilters.find((e) => e.columnName === "user_name")?.valueName || ""
    : "";

  try {
    const result = await sql.unsafe(`
      SELECT DISTINCT 
      user_id,
      user_name,
      tip_count,
      yelping_since
      FROM users
      WHERE user_name LIKE ${username}'%'
      ${orderString}
      LIMIT ${limit}
      OFFSET ${offset};
    `);

    const [{ count }] = await sql`
      SELECT COUNT(DISTINCT user_id) AS count
      FROM users
      WHERE user_name LIKE ${username} || '%'
    `;

    res.json({ result, count });
    console.log("user queried");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user." });
  }
});

router.get("/findUserById", (req: Request, res: Response, next) => {
  (async () => {
    const id = req.query.id as string;
    if (!id) {
      return res.status(400).json({ error: "User ID is required." });
    }

    try {
      const result = await sql`
        SELECT user_name, CAST(yelping_since AS VARCHAR), fan_count, tip_count, 
               CAST(average_stars AS VARCHAR), funny, useful, cool, 
               CAST(longitude AS VARCHAR), CAST(latitude AS VARCHAR), likes_count
        FROM users
        WHERE user_id = ${id};
      `;
      res.json(result);
    } catch (error) {
      console.error(error);
      next(error); // <-- this is needed for Express 5 proper error handling
    }
  })();
});

export default router;
