import { Op } from "sequelize";

import { SortDirection } from "@/helpers/pagination.helper";
import { Category } from "@/models/category.model";
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
  const where = search
    ? ({
        name: { [Op.like]: `%${search}%` },
      } as const)
    : ({} as const);

  const { count, rows } = await Category.findAndCountAll({
    where,
    paranoid: true,
    attributes: [
      "id",
      "name",
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

  return { items: rows.map((r) => r.get({ plain: true })), meta };
};

export const getCategoryById = async (id: string) => {
  const row = await Category.findOne({
    where: { id },
    paranoid: true,
    attributes: [
      "id",
      "name",
      "created_at",
      "created_by",
      "modified_at",
      "modified_by",
      "deleted_at",
      "deleted_by",
    ],
  });
  return row ? (row.get({ plain: true }) as unknown as Record<string, unknown>) : null;
};

export const createCategory = async ({ name, userId }: { name: string; userId?: string }) => {
  const category = await Category.create({
    name,
    created_by: userId ?? null,
    modified_by: userId ?? null,
  });
  return getCategoryById(category.id);
};

export const updateCategory = async (
  id: string,
  { name, userId }: { name: string; userId?: string },
) => {
  const [affectedRows] = await Category.update(
    { name, modified_by: userId ?? null, modified_at: new Date() },
    { where: { id, deleted_at: null } },
  );
  if (!affectedRows) return null;
  return getCategoryById(id);
};

export const deleteCategory = async (id: string, { userId }: { userId?: string }) => {
  const [affectedRows] = await Category.update(
    { deleted_at: new Date(), deleted_by: userId ?? null },
    { where: { id, deleted_at: null } },
  );
  return Boolean(affectedRows);
};
