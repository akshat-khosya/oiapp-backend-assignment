import express from "express";
import { deserializeUser, validate } from "../middlewares";
import {
  createSubTaskSchema,
  createTaskSchema,
  deleteTaskSchema,
} from "../schema";
import {
  deleteTaskHandler,
  subTaskCreateHandler,
  taskCreateHandler,
} from "../controllers";

const taskRouter = express.Router();

taskRouter.post(
  "/",
  [validate(createTaskSchema), deserializeUser],
  taskCreateHandler
);

taskRouter.post(
  "/sub-task",
  [validate(createSubTaskSchema), deserializeUser],
  subTaskCreateHandler
);

taskRouter.delete(
  "/",
  [validate(deleteTaskSchema), deserializeUser],
  deleteTaskHandler
);

export default taskRouter;
