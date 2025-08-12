import { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";

import { verifyToken } from "@/helpers/jwt.helper";
import { errorResponse } from "@/helpers/response.helper";

interface Payload extends JwtPayload {
  id: string;
  email: string;
}

export interface RequestWithUser extends Request {
  user: Payload;
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return errorResponse(res, 401, "No token provided");

  try {
    const decoded = verifyToken(token);
    (req as RequestWithUser).user = decoded as Payload;
    next();
  } catch {
    return errorResponse(res, 401, "Invalid token");
  }
};
