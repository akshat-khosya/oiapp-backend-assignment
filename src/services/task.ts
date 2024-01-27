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
export {
  createTask,
  getTaskById,
  createSubTask,
  deleteSubTaskById,
  deleteTaskById,
  getSubTaskById,
  updateSubTaskById,
};
