import { ENV } from "@/config/env.js";
import { JwtPayload, sign, verify } from "jsonwebtoken";

export const generateToken = (payload: object): string =>
  sign(payload, ENV.JWT_SECRET, { expiresIn: "7d" });

export const verifyToken = (token: string): JwtPayload | string => verify(token, ENV.JWT_SECRET);
