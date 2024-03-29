import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user";
import { calculatePriority } from "../utils";

export interface ITask extends Document {
  userId: mongoose.Types.ObjectId | IUser;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  dueDate: Date;
  priority: number;
  updatedAt?: Date;
  deletedAt?: Date;
}

const taskSchema: Schema<ITask> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["TODO", "IN_PROGRESS", "DONE"],
      required: true,
      default: "TODO",
    },
    dueDate: {
      type: Date,
      required: true,
    },
    priority: {
      type: Number,
      enum: [0, 1, 2, 3],
      default: function () {
        return calculatePriority((this.dueDate as Date).toISOString());
      },
    },
    updatedAt: {
      type: Date,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const TaskModel = mongoose.model<ITask>("Task", taskSchema);

export default TaskModel;
