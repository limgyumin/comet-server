import { Router } from "express";
import github from "./github";

const router = Router();

router.use("/github", github);

export default router;
