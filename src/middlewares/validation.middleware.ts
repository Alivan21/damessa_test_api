import { errorResponse } from "@/helpers/response.helper";
import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

interface ValidationError {
  errors: {
    message: string;
  }[];
}

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err: unknown) {
      const validationError = err as ValidationError;
      return errorResponse(res, 400, validationError.errors[0].message || "Validation error");
    }
  };
