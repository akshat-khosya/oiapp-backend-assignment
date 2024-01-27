import mongoose from "mongoose";
import { SubTaskModel, TaskModel, UserModel } from "../models";
import { calculatePriority, log } from "../utils";

const createTask = async (data: {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  dueDate: Date;
}) => {
  try {
    return await TaskModel.create(data);
  } catch (error) {
    throw (error as Error).message;
  }
};

const getTaskById = async (taskId: mongoose.Types.ObjectId) => {
  try {
    return await TaskModel.findById({ _id: taskId });
  } catch (error) {
    throw (error as Error).message;
  }
};

const createSubTask = async (taskId: mongoose.Types.ObjectId) => {
  try {
    return await SubTaskModel.create({ taskId });
  } catch (error) {
    throw (error as Error).message;
  }
};

const deleteSubTaskById = async (subTaskId: mongoose.Types.ObjectId) => {
  try {
    return await SubTaskModel.updateOne(
      { _id: subTaskId },
      { $set: { deletedAt: new Date() } }
    );
  } catch (error) {
    throw (error as Error).message;
  }
};

const deleteTaskById = async (taskId: mongoose.Types.ObjectId) => {
  try {
    await TaskModel.updateOne(
      { _id: taskId },
      { $set: { deletedAt: new Date() } }
    );
    await SubTaskModel.updateMany(
      { taskId: taskId },
      { $set: { deletedAt: new Date() } }
    );
  } catch (error) {
    throw (error as Error).message;
  }
};

const getSubTaskById = async (subTaskId: mongoose.Types.ObjectId) => {
  try {
    return await SubTaskModel.findById({ _id: subTaskId });
  } catch (error) {
    throw (error as Error).message;
  }
};

const updateSubTaskById = async (
  subTaskId: mongoose.Types.ObjectId,
  status: number
) => {
  try {
    return await SubTaskModel.findOneAndUpdate(
      { _id: subTaskId },
      { $set: { status } }
    );
  } catch (error) {
    throw (error as Error).message;
  }
};

const updateTaskStatus = async (taskId: mongoose.Types.ObjectId) => {
  try {
    const result = await SubTaskModel.aggregate([
      {
        $match: {
          taskId: taskId,
          deletedAt: { $exists: false },
        },
      },
      {
        $facet: {
          incompleteCount: [
            {
              $match: { status: 0 },
            },
            {
              $count: "count",
            },
          ],
          completeCount: [
            {
              $match: { status: 1 },
            },
            {
              $count: "count",
            },
          ],
        },
      },
      {
        $project: {
          incompleteCount: {
            $ifNull: [{ $arrayElemAt: ["$incompleteCount.count", 0] }, 0],
          },
          completeCount: {
            $ifNull: [{ $arrayElemAt: ["$completeCount.count", 0] }, 0],
          },
        },
      },
    ]);

    const counts = {
      incompleteCount: result[0].incompleteCount,
      completeCount: result[0].completeCount,
    };
    if (counts.incompleteCount == 0) {
      await TaskModel.findOneAndUpdate(
        { _id: taskId },
        { $set: { status: "DONE" } }
      );
    } else if (counts.completeCount >= 1 && counts.incompleteCount !== 0) {
      await TaskModel.findOneAndUpdate(
        { _id: taskId },
        { $set: { status: "IN_PROGRESS" } }
      );
    } else if (counts.incompleteCount !== 0 && counts.completeCount === 0) {
      await TaskModel.findOneAndUpdate(
        { _id: taskId },
        { $set: { status: "TODO" } }
      );
    }
  } catch (error) {
    throw (error as Error).message;
  }
};

const updateTaskDueDate = async (
  taskId: mongoose.Types.ObjectId,
  dueDate: Date
) => {
  try {
    return await TaskModel.findOneAndUpdate(
      { _id: taskId },
      {
        $set: {
          dueDate: dueDate,
          priority: calculatePriority(dueDate.toString()),
        },
      }
    );
  } catch (error) {
    throw (error as Error).message;
  }
};

const getUserTask = async (
  match: {
    userId: mongoose.Types.ObjectId;
    priority?: number;
    dueDate?: {
      $lte: Date;
    };
  },
  page: number,
  pageSize: number
) => {
  try {
    const result = await TaskModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 },
          tasks: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 0,
          totalCount: 1,
          tasks: { $slice: ["$tasks", (page - 1) * pageSize, pageSize] },
        },
      },
    ]);

    if (result.length === 0) {
      return { tasks: [], totalCount: 0 };
    }

    const { tasks, totalCount } = result[0];

    return { tasks, totalCount };
  } catch (error) {
    throw (error as Error).message;
  }
};

const getAllTaskByUserId = async (userId: mongoose.Types.ObjectId) => {
  try {
    return await TaskModel.find({ userId, deletedAt: { $exists: false } });
  } catch (error) {
    throw (error as Error).message;
  }
};

const getAllSubTask = async (match: any, page: number, pageSize: number) => {
  try {
    const results = await SubTaskModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 },
          subtasks: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 0,
          totalCount: 1,
          subtasks: { $slice: ["$subtasks", (page - 1) * pageSize, pageSize] },
        },
      },
    ]);

    if (results.length === 0) {
      return { subtasks: [], totalCount: 0 };
    }

    const { subtasks, totalCount } = results[0];

    return { subtasks, totalCount };
  } catch (error) {
    throw (error as Error).message;
  }
};

const updatePriority = async () => {
  try {
    const today = new Date();
    const tasks = await TaskModel.find({ dueDate: { $lte: today } });

    tasks.forEach(async (task) => {
      task.priority = calculatePriority(task.dueDate.toString());
      log.info(task.id);
      await task.save();
    });

    log.info("Task priorities updated successfully.");
  } catch (error) {}
};

const findPhoneNumber = async () => {
  try {
    const users = await UserModel.find().sort({ priority: 1 });

    if (!users.length) return;
    const phoneNumbers: string[] = [];
    for (const user of users) {
      const overdueTasks = await TaskModel.find({
        userId: user._id,
        status: { $in: ["TODO", "IN_PROGRESS"] },
        deletedAt: { $exists: false },
        dueDate: { $lte: new Date() },
      });
      console.log(overdueTasks);
      if (overdueTasks.length > 0) {
        log.info(`Calling ${user.phoneNumber}`);
        phoneNumbers.push(user.phoneNumber);
      }
    }
    return phoneNumbers;
  } catch (error) {
    log.error((error as Error).message);
  }
};
export {
  createTask,
  getTaskById,
  createSubTask,
  deleteSubTaskById,
  deleteTaskById,
  getSubTaskById,
  updateSubTaskById,
  updateTaskStatus,
  updateTaskDueDate,
  getUserTask,
  getAllTaskByUserId,
  getAllSubTask,
  updatePriority,
  findPhoneNumber,
};
