import { Router, Request, Response } from "express";
import sqlLogin from "@/sqlLogin.json";
import postgres from "postgres";
import * as db from "./databaseInterface";
const router = Router();

const sql = postgres({
  host: sqlLogin.host,
  port: sqlLogin.port,
  database: sqlLogin.database,
  username: sqlLogin.username,
  password: sqlLogin.password,
});

router.post("/columnsInTable", (req: Request, res: Response, next) => {
  (async () => {
    let tableName = req.body.tableName as string; // <-- now coming from body instead of query
    if (!tableName) {
      tableName = "users"; // Default if not provided
    }
    console.log(`Table: ${tableName} columns requested`);
    try {
      const result = await sql`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = ${tableName};
      `;
      res.json(result.map((row: { column_name: string }) => row.column_name));
    } catch (error) {
      console.error(error);
      next(error);
    }
  })();
});

router.post("/getUser", async (req: Request, res: Response) => {
  const {
    likeFilters = "",
    offset = 0,
    limit = 20,
  } = req.body as {
    likeFilters?: db.LikeFilter[];
    offset?: number;
    limit?: number;
  };

  const username = Array.isArray(likeFilters)
    ? likeFilters.find((e) => e.columnName === "user_name")?.valueName || ""
    : "";

  try {
    const result = await sql`
      SELECT DISTINCT 
      user_id,
      user_name,
      tip_count,
      yelping_since
      FROM users
      WHERE user_name LIKE ${username} || '%'
      ORDER BY user_id
      LIMIT ${limit}
      OFFSET ${offset};
    `;

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
