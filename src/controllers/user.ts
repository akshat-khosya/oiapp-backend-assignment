import { Request, Response } from "express";
import { log, sign } from "../utils";
import { createUser, getUserByPhone } from "../services";
import { config } from "../lib";

const createUserHandler = async (req: Request, res: Response) => {
  try {
    // check user phone number
    const checkUserPhone = await getUserByPhone(req.body.phoneNumber);

    if (checkUserPhone) {
      return res
        .status(409)
        .json({ error: "Phone Number is already registered." });
    }
    await createUser(req.body.phoneNumber, req.body.priority);
    // return 201
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    log.error("Error creating user:" + (error as Error).message);
    return res.status(500).json({ error: (error as Error).message });
  }
};

const userLoginHandler = async (req: Request, res: Response) => {
  try {
    const checkUserPhone = await getUserByPhone(req.body.phoneNumber);
    if (!checkUserPhone) {
      return res.status(404).json({ error: "Phone Number is Not found." });
    }
    const accessToken = sign(
      { userId: checkUserPhone.id },
      { expiresIn: config.get("accessTokenTtl") as string }
    );
    return res.status(200).json({ accessToken });
  } catch (error) {
    log.error("Error in login user:" + (error as Error).message);
    return res.status(500).json({ error: (error as Error).message });
  }
};


export { createUserHandler, userLoginHandler };
