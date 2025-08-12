import { randomUUID } from "node:crypto";
import { QueryTypes } from "sequelize";

import { sequelize } from "@/config/database";
import { SortDirection } from "@/helpers/pagination.helper";
import { buildPaginationMeta, sanitizePagination } from "@/services/pagination.service";

export interface CategoriesQueryParams {
  page: number;
  perPage: number;
  search?: string;
  sortBy?: string;
  order?: SortDirection;
  basePath: string;
  query: Record<string, unknown>;
}

const ALLOWED_SORT_FIELDS = new Set(["name", "created_at", "modified_at"]);

export const getCategories = async ({
  page,
  perPage,
  search = "",
  sortBy = "created_at",
  order = "desc",
  basePath,
  query,
}: CategoriesQueryParams) => {
  const { sanitizedPage, sanitizedPerPage, offset } = sanitizePagination(page, perPage);

  const safeSortBy = ALLOWED_SORT_FIELDS.has(sortBy) ? sortBy : "created_at";
  const direction = order.toLowerCase() === "asc" ? "ASC" : "DESC";

  const whereClauses: string[] = ["deleted_at IS NULL"];
  const replacements: Record<string, unknown> = {};
  if (search) {
    whereClauses.push("name LIKE :search");
    replacements.search = `%${search}%`;
  }
  const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";

  const countRows = (await sequelize.query<{ count: number }>(
    `SELECT COUNT(*) as count FROM categories ${whereSql}`,
    { type: QueryTypes.SELECT, replacements },
  )) as { count: number }[];
  const count = Number(countRows[0]?.count ?? 0);

  const rows = await sequelize.query(
    `SELECT id, name, created_at, created_by, modified_at, modified_by, deleted_at, deleted_by
     FROM categories
     ${whereSql}
     ORDER BY ${safeSortBy} ${direction}
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

export const getCategoryById = async (id: string) => {
  const rows = await sequelize.query(
    `SELECT id, name, created_at, created_by, modified_at, modified_by, deleted_at, deleted_by
     FROM categories WHERE id = :id AND deleted_at IS NULL LIMIT 1`,
    { type: QueryTypes.SELECT, replacements: { id } },
  );
  return (rows as unknown as Record<string, unknown>[])[0] ?? null;
};

export const createCategory = async ({ name, userId }: { name: string; userId?: string }) => {
  const now = new Date();
  const id = randomUUID();
  await sequelize.query(
    `INSERT INTO categories (id, name, created_by, modified_by, created_at, modified_at, deleted_at, deleted_by)
     VALUES (:id, :name, :created_by, :modified_by, :created_at, :modified_at, NULL, NULL)`,
    {
      type: QueryTypes.INSERT,
      replacements: {
        id,
        name,
        created_by: userId ?? null,
        modified_by: userId ?? null,
        created_at: now,
        modified_at: now,
      },
    },
  );
  return getCategoryById(id);
};

export const updateCategory = async (
  id: string,
  { name, userId }: { name: string; userId?: string },
) => {
  const [result] = await sequelize.query(
    `UPDATE categories SET name = :name, modified_by = :modified_by, modified_at = :modified_at
     WHERE id = :id AND deleted_at IS NULL`,
    {
      type: QueryTypes.UPDATE,
      replacements: { id, name, modified_by: userId ?? null, modified_at: new Date() },
    },
  );
  const affected = Array.isArray(result) ? 0 : (result as unknown as number);
  if (!affected) return null;
  return getCategoryById(id);
};

export const deleteCategory = async (id: string, { userId }: { userId?: string }) => {
  const [result] = await sequelize.query(
    `UPDATE categories SET deleted_at = :deleted_at, deleted_by = :deleted_by
     WHERE id = :id AND deleted_at IS NULL`,
    {
      type: QueryTypes.UPDATE,
      replacements: { id, deleted_at: new Date(), deleted_by: userId ?? null },
    },
  );
  const affected = Array.isArray(result) ? 0 : (result as unknown as number);
  return Boolean(affected);
};
