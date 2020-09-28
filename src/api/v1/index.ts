import { Router } from "express";
import auth from "./auth";
import github from "./github";

const router = Router();

router.use("/github", github);
router.use("/auth", auth);

export default router;
