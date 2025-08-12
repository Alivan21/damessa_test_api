import { Response } from "express";

export const successResponse = (res: Response, data: any, message = "Success") =>
  res.status(200).json({ status: "success", message, data });

export const errorResponse = (res: Response, code: number, message: any) =>
  res.status(code).json({ status: "error", message });
