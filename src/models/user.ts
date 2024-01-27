import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  phoneNumber: string;
  priority: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema: Schema<IUser> = new Schema(
  {
    phoneNumber: {
      type: String,
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
