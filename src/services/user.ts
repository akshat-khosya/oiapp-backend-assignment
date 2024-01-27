import { UserModel } from "../models";

const getUserByPhone = async (phoneNumber: string) => {
  try {
    return await UserModel.findOne({ phoneNumber });
  } catch (error) {
    throw (error as Error).message;
  }
};

const createUser = async (phoneNumber: string, priority: number) => {
  try {
    return await UserModel.create({ phoneNumber, priority });
  } catch (error) {
    throw (error as Error).message;
  }
};

export { getUserByPhone, createUser };
