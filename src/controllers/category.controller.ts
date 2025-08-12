import { RequestWithUser } from "@/middlewares/auth.middleware";
import { Request, Response } from "express";

import { errorResponse, successResponse } from "@/helpers/response.helper";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "@/services/category.service";
import { parsePaginationQuery } from "@/services/pagination.service";

export const list = async (req: Request, res: Response) => {
  try {
    const params = parsePaginationQuery(req);
    const result = await getCategories(params);

    return successResponse(res, result, "Categories fetched successfully");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return errorResponse(res, 500, message);
  }
};

export const detail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await getCategoryById(id);
    if (!category) return errorResponse(res, 404, "Category not found");
    return successResponse(res, category, "Category fetched successfully");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return errorResponse(res, 500, message);
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const userId = (req as RequestWithUser).user?.id;
    const { name } = req.body as { name: string };
    const category = await createCategory({ name, userId });
    return successResponse(res, category, "Category created successfully");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return errorResponse(res, 500, message);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const userId = (req as RequestWithUser).user?.id;
    const { id } = req.params;
    const { name } = req.body as { name: string };
    const updated = await updateCategory(id, { name, userId });
    if (!updated) return errorResponse(res, 404, "Category not found");
    return successResponse(res, updated, "Category updated successfully");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return errorResponse(res, 500, message);
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const userId = (req as RequestWithUser).user?.id;
    const { id } = req.params;
    const deleted = await deleteCategory(id, { userId });
    if (!deleted) return errorResponse(res, 404, "Category not found");
    return successResponse(res, { id }, "Category deleted successfully");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return errorResponse(res, 500, message);
  }
};
