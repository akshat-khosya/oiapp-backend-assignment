import { Request, Response } from "express";
import { log, sign } from "../utils";
import {
  createSubTask,
  createTask,
  createUser,
  deleteSubTaskById,
  deleteTaskById,
  getAllSubTask,
  getAllTaskByUserId,
  getSubTaskById,
  getTaskById,
  getUserByPhone,
  getUserTask,
  updateSubTaskById,
  updateTaskDueDate,
  updateTaskStatus,
} from "../services";

import { Mongoose, Types } from "mongoose";
import mongoose from "mongoose";

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

const updateTaskHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const task = await getTaskById(req.body.taskId);
    if (!task || task.userId.toString() !== userId.toString()) {
      return res.status(404).json({ error: "Sub task not found." });
    }
    await updateTaskDueDate(task._id, new Date(req.body.dueDate));
    return res.status(200).json({ message: "Task Updated successfully" });
  } catch (error) {
    log.error("Error in updating a task:" + (error as Error).message);
    return res.status(500).json({ error: (error as Error).message });
  }
};

const getTaskHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const match: {
      userId: mongoose.Types.ObjectId;
      priority?: number;
      dueDate?: {
        $lte: Date;
      };
      deletedAt: any;
    } = { userId, deletedAt: { $exists: false } };
    if (req.query.priority)
      match.priority = parseInt(req.query.priority as string);
    if (req.query.dueDate)
      match.dueDate = { $lte: new Date(req.query.dueDate as string) };

    const validatedPage = parseInt(req.query.page as string) || 1;
    const validatedPageSize = parseInt(req.query.pageSize as string) || 10;
    const { tasks, totalCount } = await getUserTask(
      match,
      validatedPage,
      validatedPageSize
    );
    return res.status(200).json({ tasks, totalCount });
  } catch (error) {
    log.error("Error in get all task:" + (error as Error).message);
    return res.status(500).json({ error: (error as Error).message });
  }
};

const getSubTaskHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const validatedPage = parseInt(req.query.page as string) || 1;
    const validatedPageSize = parseInt(req.query.pageSize as string) || 10;
    const match: any = {
      deletedAt: { $exists: false },
    };
    if (req.query.taskId) {
      const task = await getTaskById(
        new mongoose.Types.ObjectId(req.query.taskId as string)
      );
      if (task && task.userId.toString() === userId.toString()) {
        match.taskId = {
          $in: [new mongoose.Types.ObjectId(req.query.taskId as string)],
        };
        const { subtasks, totalCount } = await getAllSubTask(
          match,
          validatedPage,
          validatedPageSize
        );
        return res.status(200).json({ subtasks, totalCount });
      }
    }
    // get all task id using user id
    const tasks = await getAllTaskByUserId(userId);
    if (tasks.length === 0) {
      return res.status(404).json({ message: "Sub task not found" });
    }
    match.taskId = { $in: tasks.map((task) => task._id) };
    const { subtasks, totalCount } = await getAllSubTask(
      match,
      validatedPage,
      validatedPageSize
    );
    return res.status(200).json({ subtasks, totalCount });
  } catch (error) {
    log.error("Error in get all sub task:" + (error as Error).message);
    return res.status(500).json({ error: (error as Error).message });
  }
};

export {
  taskCreateHandler,
  subTaskCreateHandler,
  deleteTaskHandler,
  updateSubTaskHandler,
  deleteSubTaskHandler,
  updateTaskHandler,
  getTaskHandler,
  getSubTaskHandler,
};
