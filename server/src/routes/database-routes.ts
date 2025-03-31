import { Router, Request, Response } from "express";
import sqlLogin from "@/sqlLogin.json";
import postgres from "postgres";
const router = Router();

const sql = postgres({
  host: sqlLogin.host,
  port: sqlLogin.port,
  database: sqlLogin.database,
  username: sqlLogin.username,
  password: sqlLogin.password,
});

router.get("/allStates", async (req: Request, res: Response) => {
    try {
      const result = await sql`
        SELECT DISTINCT business_state FROM business;
      `;
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch states." });
    }
});
  
router.get("/citiesInState", async (req: Request, res: Response) => {
    const { state } = req.query;
    if (!state) {
      return res.status(400).json({ error: "State is required." });
    }
    
    try {
      const result = await sql`
        SELECT DISTINCT city FROM business WHERE business_state = ${state};
      `;
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch cities." });
    }
  });
  
  router.get("/zipsInCity", async (req: Request, res: Response) => {
    const { state, city } = req.query;
    if (!state || !city) {
      return res.status(400).json({ error: "State and city are required." });
    }
  
    try {
      const result = await sql`
        SELECT DISTINCT CAST(zip AS VARCHAR) FROM business WHERE business_state = ${state} AND city = ${city};
      `;
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch zips." });
    }
  });
  
  router.get("/categoriesInZip", async (req: Request, res: Response) => {
    const { zip } = req.query;
    if (!zip) {
      return res.status(400).json({ error: "Zip is required." });
    }
  
    try {
      const result = await sql`
        SELECT DISTINCT category FROM Category WHERE business_id IN (
          SELECT business_id FROM Business WHERE zip = ${zip}
        );
      `;
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch categories." });
    }
  });
  
  router.get("/businessesInZip", async (req: Request, res: Response) => {
    const { zip, categories } = req.query;
  
    if (!zip) {
      return res.status(400).json({ error: "Zip is required." });
    }
  
    try {
      let query = sql`
        SELECT business_id, business_name, business_address, 
               CAST(longitude AS VARCHAR), CAST(latitude AS VARCHAR), 
               CAST(stars AS VARCHAR), CAST(is_open AS VARCHAR), 
               CAST(tip_count AS VARCHAR), CAST(numCheckins AS VARCHAR)
        FROM business WHERE zip = ${zip};
      `;
  
      if (categories && Array.isArray(categories)) {
        query = sql`
          SELECT business.business_id, business_name, business_address, 
                 CAST(longitude AS VARCHAR), CAST(latitude AS VARCHAR), 
                 CAST(stars AS VARCHAR), CAST(is_open AS VARCHAR), 
                 CAST(tip_count AS VARCHAR), CAST(numCheckins AS VARCHAR)
          FROM business
          JOIN category ON business.business_id = category.business_id
          WHERE business.zip = ${zip} AND category.category = ANY(${categories});
        `;
      }
  
      const result = await query;
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch businesses." });
    }
  });
  
  router.get("/tipsInBusiness", async (req: Request, res: Response) => {
    const { business_id } = req.query;
    if (!business_id) {
      return res.status(400).json({ error: "Business ID is required." });
    }
  
    try {
      const result = await sql`
        SELECT user_id, CAST(date_posted AS VARCHAR), body, CAST(likes AS VARCHAR)
        FROM tip WHERE business_id = ${business_id};
      `;
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch tips." });
    }
  });
  
  router.get("/getUser", async (req: Request, res: Response) => {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ error: "Username is required." });
    }
  
    try {
      const result = await sql`
        SELECT DISTINCT user_id FROM users WHERE user_name LIKE ${username} || '%';
      `;
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch user." });
    }
  });
  
  router.get("/findUserById", async (req: Request, res: Response) => {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: "User ID is required." });
    }
  
    try {
      const result = await sql`
        SELECT user_name, CAST(yelping_since AS VARCHAR), fan_count, tip_count, 
               CAST(average_stars AS VARCHAR), funny, useful, cool, 
               CAST(longitude AS VARCHAR), CAST(latitude AS VARCHAR), likes_count
        FROM users WHERE user_id = ${id};
      `;
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch user details." });
    }
  });
  
  router.get("/recentTips", async (req: Request, res: Response) => {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: "User ID is required." });
    }
  
    try {
      const result = await sql`
        SELECT user_name, business_name, city, body, date_posted
        FROM tip NATURAL JOIN business
        NATURAL JOIN (
          SELECT user_id, user_name FROM users
          INNER JOIN (
            SELECT friended_by_id FROM FriendedUser WHERE user_id = ${id}
          ) AS J ON friended_by_id = user_id
        ) AS O
        ORDER BY date_posted DESC;
      `;
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch recent tips." });
    }
  });

  export default router;
