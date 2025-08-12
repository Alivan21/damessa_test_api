import jwt, { JwtPayload } from "jsonwebtoken";

import { ENV } from "@/config/env";

export const generateToken = (payload: object): string =>
  jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: "7d" });

export const verifyToken = (token: string): JwtPayload | string =>
  jwt.verify(token, ENV.JWT_SECRET);
