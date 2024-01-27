import mongoose from "mongoose";
import { SubTaskModel, TaskModel } from "../models";

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

export {
  createTask,
  getTaskById,
  createSubTask,
  deleteSubTaskById,
  deleteTaskById,
  getSubTaskById,
  updateSubTaskById,
  updateTaskStatus,
};
