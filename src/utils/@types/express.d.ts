/* eslint-disable no-unused-vars */
import { Express, Request } from 'express';
import mongoose from 'mongoose';
declare global {
  namespace Express {
    interface Request {
      userId?: mongoose.Types.ObjectId;
    }
  }
}
