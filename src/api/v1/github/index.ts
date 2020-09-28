import { Router } from "express";
import user from "./user";

const router = Router();

router.post("/user", user);

export default router;
