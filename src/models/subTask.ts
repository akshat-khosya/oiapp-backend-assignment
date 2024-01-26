import mongoose, { Schema, Document } from "mongoose";
import { ITask } from "./task";

export interface ISubTask extends Document {
  taskId: mongoose.Types.ObjectId | ITask;
  status: 0 | 1;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

const subTaskSchema: Schema<ISubTask> = new Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task", // Reference to the Task model
      required: true,
    },
    status: {
      type: Number,
      enum: [0, 1],
      required: true,
    },
    createdAt: {
      type: Date,
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

const SubTaskModel = mongoose.model<ISubTask>("SubTask", subTaskSchema);

export default SubTaskModel;
