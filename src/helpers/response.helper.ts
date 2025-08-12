import { Response } from "express";

interface SuccessResponse<T> {
  status: "success";
  message: string;
  data: T;
}

interface ErrorResponse {
  status: "error";
  message: string;
}

export const successResponse = <T>(res: Response, data: T, message = "Success") =>
  res.status(200).json({ status: "success", message, data } as SuccessResponse<T>);

export const errorResponse = (res: Response, code: number, message: string) =>
  res.status(code).json({ status: "error", message } as ErrorResponse);
