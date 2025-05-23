import { Router, Request, Response } from "express";

const router = Router();

router.post("/user", async (req: Request, res: Response) => {
  try {
    console.log("Fetching user figure ...");
    const response = await fetch("http://localhost:3002/plot");
    const svg = await response.text();
    res.type("image/svg+xml").send(svg);
  } catch (err) {
    console.error("Failed to fetch SVG:", err);
    res.status(500).send("Error fetching SVG");
  }
});

export default router;
