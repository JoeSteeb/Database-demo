import { Router } from "express";
import databaseRoutes from "./database-routes";
import userRoutes from "./user-routes";

const router = Router();


router.use("/api", databaseRoutes);
router.use("/", userRoutes);

export default router;
