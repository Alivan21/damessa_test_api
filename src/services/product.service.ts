import { randomUUID } from "node:crypto";
import { QueryTypes } from "sequelize";

import { sequelize } from "@/config/database";
import { SortDirection } from "@/helpers/pagination.helper";
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

  const whereClauses: string[] = ["p.deleted_at IS NULL", "c.deleted_at IS NULL"];
  const replacements: Record<string, unknown> = {};
  if (search) {
    whereClauses.push("(p.name LIKE :search OR c.name LIKE :search)");
    replacements.search = `%${search}%`;
  }
  const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";

  const countRows = (await sequelize.query<{ count: number }>(
    `SELECT COUNT(*) as count
     FROM products p
     JOIN categories c ON c.id = p.category_id
     ${whereSql}`,
    { type: QueryTypes.SELECT, replacements },
  )) as { count: number }[];
  const count = Number(countRows[0]?.count ?? 0);

  const rows = await sequelize.query(
    `SELECT p.id, p.name, p.price, p.stock, p.category_id, c.name as category_name,
            p.created_at, p.created_by, p.modified_at, p.modified_by, p.deleted_at, p.deleted_by
     FROM products p
     JOIN categories c ON c.id = p.category_id
     ${whereSql}
     ORDER BY p.${safeSortBy} ${direction}
     LIMIT :limit OFFSET :offset`,
    {
      type: QueryTypes.SELECT,
      replacements: { ...replacements, limit: sanitizedPerPage, offset },
    },
  );

  const meta = buildPaginationMeta({
    basePath,
    query,
    total: count,
    page: sanitizedPage,
    perPage: sanitizedPerPage,
  });

  return { items: rows, meta };
};

export const getProductById = async (id: string) => {
  const rows = await sequelize.query(
    `SELECT p.id, p.name, p.price, p.stock, p.category_id, c.name as category_name,
            p.created_at, p.created_by, p.modified_at, p.modified_by, p.deleted_at, p.deleted_by
     FROM products p
     JOIN categories c ON c.id = p.category_id
     WHERE p.id = :id AND p.deleted_at IS NULL AND c.deleted_at IS NULL
     LIMIT 1`,
    { type: QueryTypes.SELECT, replacements: { id } },
  );
  return (rows as unknown as Record<string, unknown>[])[0] ?? null;
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
  const now = new Date();
  const id = randomUUID();
  await sequelize.query(
    `INSERT INTO products (id, name, price, stock, category_id, created_by, modified_by, created_at, modified_at, deleted_at, deleted_by)
     VALUES (:id, :name, :price, :stock, :category_id, :created_by, :modified_by, :created_at, :modified_at, NULL, NULL)`,
    {
      type: QueryTypes.INSERT,
      replacements: {
        id,
        name,
        price,
        stock,
        category_id,
        created_by: userId ?? null,
        modified_by: userId ?? null,
        created_at: now,
        modified_at: now,
      },
    },
  );
  return getProductById(id);
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
  const [, affectedRows] = await sequelize.query(
    `UPDATE products SET name = :name, price = :price, stock = :stock, category_id = :category_id,
                         modified_by = :modified_by, modified_at = :modified_at
     WHERE id = :id AND deleted_at IS NULL`,
    {
      type: QueryTypes.UPDATE,
      replacements: {
        id,
        name,
        price,
        stock,
        category_id,
        modified_by: userId ?? null,
        modified_at: new Date(),
      },
    },
  );
  if (!affectedRows) return null;
  return getProductById(id);
};

export const deleteProduct = async (id: string, { userId }: { userId?: string }) => {
  const [, affectedRows] = await sequelize.query(
    `UPDATE products SET deleted_at = :deleted_at, deleted_by = :deleted_by
     WHERE id = :id AND deleted_at IS NULL`,
    {
      type: QueryTypes.UPDATE,
      replacements: { id, deleted_at: new Date(), deleted_by: userId ?? null },
    },
  );
  return Boolean(affectedRows);
};
