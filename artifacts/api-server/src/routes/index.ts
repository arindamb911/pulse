import { Router, type IRouter } from "express";
import healthRouter from "./health";
import hospitalsRouter from "./hospitals";
import emergencyRouter from "./emergency";

const router: IRouter = Router();

router.use(healthRouter);
router.use(hospitalsRouter);
router.use(emergencyRouter);

export default router;
