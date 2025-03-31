import { Router, Request, Response } from "express";
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";
import express from "express";

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


router.use("/", express.static(path.join(__dirname, "../../public-app/dist")));

export default router;