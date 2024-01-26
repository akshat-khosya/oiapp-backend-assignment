import express from "express";
import { validate } from "../middlewares";

const authRouter = express.Router();

authRouter.post("/create");

authRouter.post("/login");

export default authRouter;
