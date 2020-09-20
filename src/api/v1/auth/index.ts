import { Router } from "express";
import register from "./auth.ctrl/register";

const router = Router();

router.post("/register", register);

export default router;
