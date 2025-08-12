import { Request, Response } from "express";

import { errorResponse, successResponse } from "@/helpers/response.helper";
import { RequestWithUser } from "@/middlewares/auth.middleware";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "@/services/product.service";

export const list = async (req: Request, res: Response) => {
  try {
    const {
      page = "1",
      per_page = "10",
      search = "",
      sort_by = "created_at",
      sort_dir = "desc",
    } = req.query as Record<string, string>;

    const basePath = `${req.protocol}://${req.get("host")}${req.baseUrl}${req.path}`;

    const result = await getProducts({
      page: Number(page),
      perPage: Number(per_page),
      search,
      sortBy: sort_by,
      sortDir: sort_dir.toLowerCase() === "asc" ? "asc" : "desc",
      basePath,
      query: req.query,
    });

    return successResponse(res, result, "Products fetched successfully");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return errorResponse(res, 400, message);
  }
};

export const detail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await getProductById(id);
    if (!product) return errorResponse(res, 404, "Product not found");
    return successResponse(res, product, "Product fetched successfully");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return errorResponse(res, 400, message);
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const userId = (req as RequestWithUser).user?.id;
    const {
      name,
      price,
      stock = 0,
      category_id,
    } = req.body as {
      name: string;
      price: number;
      stock?: number;
      category_id: string;
    };
    const product = await createProduct({ name, price, stock, category_id, userId });
    return successResponse(res, product, "Product created successfully");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return errorResponse(res, 400, message);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const userId = (req as RequestWithUser).user?.id;
    const { id } = req.params;
    const { name, price, stock, category_id } = req.body as {
      name: string;
      price: number;
      stock: number;
      category_id: string;
    };
    const updated = await updateProduct(id, { name, price, stock, category_id, userId });
    if (!updated) return errorResponse(res, 404, "Product not found");
    return successResponse(res, updated, "Product updated successfully");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return errorResponse(res, 400, message);
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const userId = (req as RequestWithUser).user?.id;
    const { id } = req.params;
    const deleted = await deleteProduct(id, { userId });
    if (!deleted) return errorResponse(res, 404, "Product not found");
    return successResponse(res, { id }, "Product deleted successfully");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return errorResponse(res, 400, message);
  }
};
