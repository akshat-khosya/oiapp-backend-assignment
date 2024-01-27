import express from "express";
import { deserializeUser, validate } from "../middlewares";
import {
  createSubTaskSchema,
  createTaskSchema,
  deleteSubTaskSchema,
  deleteTaskSchema,
  updateSubTaskSchema,
  updateTaskSchema,
} from "../schema";
import {
  deleteTaskHandler,
  subTaskCreateHandler,
  taskCreateHandler,
  updateSubTaskHandler,
  deleteSubTaskHandler,
  updateTaskHandler,
  getTaskHandler,
  getSubTaskHandler,
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

taskRouter.put(
  "/sub-task",
  [validate(updateSubTaskSchema), deserializeUser],
  updateSubTaskHandler
);

taskRouter.delete(
  "/",
  [validate(deleteTaskSchema), deserializeUser],
  deleteTaskHandler
);

taskRouter.delete(
  "/sub-task",
  [validate(deleteSubTaskSchema), deserializeUser],
  deleteSubTaskHandler
);

taskRouter.put(
  "/",
  [validate(updateTaskSchema), deserializeUser],
  updateTaskHandler
);

taskRouter.get("/", deserializeUser, getTaskHandler);

taskRouter.get("/sub-task", deserializeUser, getSubTaskHandler);

export default taskRouter;
