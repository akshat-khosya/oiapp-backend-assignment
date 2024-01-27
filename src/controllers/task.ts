import { Request, Response } from "express";
import { log, sign } from "../utils";
import {
  createSubTask,
  createTask,
  createUser,
  deleteSubTaskById,
  deleteTaskById,
  getSubTaskById,
  getTaskById,
  getUserByPhone,
  updateSubTaskById,
  updateTaskStatus,
} from "../services";
import { config } from "../lib";
import mongoose, { Mongoose, Types } from "mongoose";

const taskCreateHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    // save task
    await createTask({
      userId: userId,
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
    });
    // return 201
    return res.status(201).json({ message: "Task created successfully" });
  } catch (error) {
    log.error("Error in creating task:" + (error as Error).message);
    return res.status(500).json({ error: (error as Error).message });
  }
};

const subTaskCreateHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    // check task
    const task = await getTaskById(req.body.taskId);

    if (
      !task ||
      task.userId.toString() !== userId.toString() ||
      task.deletedAt
    ) {
      return res.status(404).json({ error: "Task not found." });
    }
    // create sub
    await createSubTask(task._id);
    updateTaskStatus(task._id);
    // return 201
    return res.status(201).json({ message: "Sub Task created successfully" });
  } catch (error) {
    log.error("Error in creating sub task:" + (error as Error).message);
    return res.status(500).json({ error: (error as Error).message });
  }
};

const deleteTaskHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    // check task
    const task = await getTaskById(req.body.taskId);
    if (!task || task.userId.toString() !== userId.toString()) {
      return res.status(404).json({ error: "Task not found." });
    }
    await deleteTaskById(task._id);
    return res.status(202).json({ message: "Task deleted successfully" });
  } catch (error) {
    log.error("Error in deleting task:" + (error as Error).message);
    return res.status(500).json({ error: (error as Error).message });
  }
};

const updateSubTaskHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const subTask = await getSubTaskById(req.body.subTaskId);
    if (!subTask || subTask?.deletedAt) {
      return res.status(404).json({ error: "Sub Task not found." });
    }
    const task = await getTaskById(subTask.taskId as Types.ObjectId);
    if (!task || task.userId.toString() !== userId.toString()) {
      return res.status(404).json({ error: "Sub task not found." });
    }
    await updateSubTaskById(req.body.subTaskId, req.body.status);
    updateTaskStatus(task._id);
    return res.status(200).json({ message: "Sub Task Updated successfully" });
  } catch (error) {
    log.error("Error in updating a sub task:" + (error as Error).message);
    return res.status(500).json({ error: (error as Error).message });
  }
};

const deleteSubTaskHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    // check for sub task
    const subTask = await getSubTaskById(req.body.subTaskId);

    if (!subTask || subTask.deletedAt) {
      return res.status(404).json({ error: "Sub task not found." });
    }
    const task = await getTaskById(subTask.taskId as Types.ObjectId);
    if (!task || task.userId.toString() !== userId.toString()) {
      return res.status(404).json({ error: "Sub task not found." });
    }
    // mark soft delete
    await deleteSubTaskById(subTask._id);
    // update status of task
    updateTaskStatus(task._id);
    return res.status(200).json({ message: "Sub Task Deleted successfully" });
  } catch (error) {
    log.error("Error in deleting a sub task:" + (error as Error).message);
    return res.status(500).json({ error: (error as Error).message });
  }
};

export {
  taskCreateHandler,
  subTaskCreateHandler,
  deleteTaskHandler,
  updateSubTaskHandler,
  deleteSubTaskHandler,
};
