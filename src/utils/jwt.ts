import jwt from "jsonwebtoken";
import { config } from "../lib";

const privateKey = config.get("privateKey") as string;

export function sign(
  object: Object,
  options?: jwt.SignOptions | undefined
): string {
  return jwt.sign(object, privateKey, options);
}

export function decode(token: string): {
  valid: boolean;
  decoded: any | null;
  expired: boolean;
} {
  try {
    const decoded = jwt.verify(token, privateKey);
    return {
      valid: true,
      expired: false,
      decoded: decoded,
    };
  } catch (e) {
    return {
      valid: false,
      expired: (e as Error).name === "TokenExpiredError",
      decoded: null,
    };
  }
}
