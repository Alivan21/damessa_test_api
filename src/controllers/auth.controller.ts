import { Request, Response } from "express";

import { errorResponse, successResponse } from "@/helpers/response.helper";
import { loginUser, registerUser } from "@/services/auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const user = await registerUser(name, email, password);
    return successResponse(res, user, "User registered successfully");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return errorResponse(res, 500, message);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);
    return successResponse(res, { user, token }, "Login successful");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return errorResponse(res, 500, message);
  }
};
