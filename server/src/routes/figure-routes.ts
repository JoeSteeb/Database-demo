import { Router, Request, Response } from "express";
import { User } from "./databaseInterface";

const router = Router();

router.post("/user", async (req: Request, res: Response) => {
  try {
    console.log("Fetching user figure ...");
    const user = req.body.user as User;
    const response = await fetch("http://localhost:3002/plot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: user }),
    });
    const svg = await response.text();
    console.log("User data:", user);
    res.type("image/svg+xml").send(svg);
  } catch (err) {
    console.error("Failed to fetch SVG:", err);
    res.status(500).send("Error fetching SVG");
  }
});

export default router;
