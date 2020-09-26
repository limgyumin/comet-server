import { Router } from "express";
import github from "./github";

const router = Router();

router.post("/github", github);

export default router;
