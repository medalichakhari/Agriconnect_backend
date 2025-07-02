import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import { createUserSchema } from "../validators/user";

const router = Router();

router.post("/register", validate(createUserSchema), register);
router.post("/login", login);

export default router;
