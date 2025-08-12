import { Op } from "sequelize";

import { SortDirection } from "@/helpers/pagination.helper";
import { Category } from "@/models/category.model";
import { Product } from "@/models/product.model";
import { buildPaginationMeta, sanitizePagination } from "@/services/pagination.service";

export interface ProductsQueryParams {
  page: number;
  perPage: number;
  search?: string;
  sortBy?: string;
  order?: SortDirection;
  basePath: string;
  query: Record<string, unknown>;
}

const ALLOWED_SORT_FIELDS = new Set(["name", "price", "stock", "created_at", "modified_at"]);

export const getProducts = async ({
  page,
  perPage,
  search = "",
  sortBy = "created_at",
  order = "desc",
  basePath,
  query,
}: ProductsQueryParams) => {
  const { sanitizedPage, sanitizedPerPage, offset } = sanitizePagination(page, perPage);

  const safeSortBy = ALLOWED_SORT_FIELDS.has(sortBy) ? sortBy : "created_at";
  const direction = order.toLowerCase() === "asc" ? "ASC" : "DESC";
  const { count, rows } = await Product.findAndCountAll({
    where: search
      ? ({
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { "$category.name$": { [Op.like]: `%${search}%` } },
          ],
        } as const)
      : ({} as const),
    include: [
      {
        model: Category,
        as: "category",
        attributes: ["id", "name"],
        required: true,
      },
    ],
    paranoid: true,
    distinct: true,
    attributes: [
      "id",
      "name",
      "price",
      "stock",
      "category_id",
      "created_at",
      "created_by",
      "modified_at",
      "modified_by",
      "deleted_at",
      "deleted_by",
    ],
    order: [[safeSortBy as string, direction as "ASC" | "DESC"]],
    limit: sanitizedPerPage,
    offset,
  });

  const meta = buildPaginationMeta({
    basePath,
    query,
    total: count as number,
    page: sanitizedPage,
    perPage: sanitizedPerPage,
  });

  const items = rows.map((row) => {
    const plain = row.get({ plain: true }) as any;
    return {
      ...plain,
      category_name: plain.category?.name ?? null,
    };
  });
  return { items, meta };
};

export const getProductById = async (id: string) => {
  const row = await Product.findOne({
    where: { id },
    include: [{ model: Category, as: "category", attributes: ["id", "name"], required: true }],
    paranoid: true,
    attributes: [
      "id",
      "name",
      "price",
      "stock",
      "category_id",
      "created_at",
      "created_by",
      "modified_at",
      "modified_by",
      "deleted_at",
      "deleted_by",
    ],
  });
  if (!row) return null;
  const plain = row.get({ plain: true }) as any;
  return { ...plain, category_name: plain.category?.name ?? null } as Record<string, unknown>;
};

export const createProduct = async ({
  name,
  price,
  stock = 0,
  category_id,
  userId,
}: {
  name: string;
  price: number;
  stock?: number;
  category_id: string;
  userId?: string;
}) => {
  const product = await Product.create({
    name,
    price,
    stock,
    category_id,
    created_by: userId ?? null,
    modified_by: userId ?? null,
  });
  return getProductById(product.id);
};

export const updateProduct = async (
  id: string,
  {
    name,
    price,
    stock,
    category_id,
    userId,
  }: { name: string; price: number; stock: number; category_id: string; userId?: string },
) => {
  const [affectedRows] = await Product.update(
    { name, price, stock, category_id, modified_by: userId ?? null, modified_at: new Date() },
    { where: { id, deleted_at: null } },
  );
  if (!affectedRows) return null;
  return getProductById(id);
};

export const deleteProduct = async (id: string, { userId }: { userId?: string }) => {
  const [affectedRows] = await Product.update(
    { deleted_at: new Date(), deleted_by: userId ?? null },
    { where: { id, deleted_at: null } },
  );
  return Boolean(affectedRows);
};
