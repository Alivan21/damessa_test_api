import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";

import { errorResponse } from "@/helpers/response.helper";

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        const firstIssue = err.issues?.[0];
        const message = firstIssue?.message || "Validation error";
        return errorResponse(res, 400, message);
      }
      return errorResponse(res, 400, "Validation error");
    }
  };
