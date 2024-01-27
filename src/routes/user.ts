import express from "express";
import { validate } from "../middlewares";
import { createUserHandler, userLoginHandler } from "../controllers";
import { createUserSchema, userLoginSchema } from "../schema";

const authRouter = express.Router();

authRouter.post("/create", validate(createUserSchema), createUserHandler);

authRouter.post("/login", validate(userLoginSchema), userLoginHandler);

export default authRouter;
