import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phoneNumber?: number;
  priority?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
    },
    priority: {
      type: Number,
      enum: [0, 1, 2],
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model<IUser>("User", userSchema);

export default UserModel;
