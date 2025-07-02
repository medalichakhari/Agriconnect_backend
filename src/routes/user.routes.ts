import { Router } from "express";
import { createUser } from "../controllers/user.controller";
import { createUserSchema } from "../validators/user";
import { validate } from "../middleware/validate";

const router = Router();

router.post("/users", validate(createUserSchema), createUser);

export default router;
