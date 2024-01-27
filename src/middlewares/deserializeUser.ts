import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { decode, log } from "../utils";

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res.sendStatus(403);
    }

    const [type, token] = authorizationHeader.split(" ");

    if (type !== "Bearer" || !token) {
      return res.sendStatus(403);
    }

    const { decoded, expired } = decode(token);

    if (expired) {
      return res.sendStatus(403);
    }

    if (decoded) {
      const userId = decoded.userId as mongoose.Types.ObjectId;

      req.userId = new mongoose.Types.ObjectId(userId);
      return next();
    }

    return res.sendStatus(403);
  } catch (error) {
    log.error(JSON.stringify({ path: "Deserialize User", error: error }));
    return res.sendStatus(403);
  }
};

export default deserializeUser;
