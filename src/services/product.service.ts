import { randomUUID } from "node:crypto";
import { QueryTypes } from "sequelize";

import { sequelize } from "@/config/database";
import {
  buildUrl,
  PaginationMeta,
  PaginationMetaLink,
  SortDirection,
} from "@/helpers/pagination.helper";

export interface ProductsQueryParams {
  page: number;
  perPage: number;
  search?: string;
  sortBy?: string;
  sortDir?: SortDirection;
  basePath: string;
  query: Record<string, unknown>;
}

const ALLOWED_SORT_FIELDS = new Set(["name", "price", "stock", "created_at", "modified_at"]);

export const getProducts = async ({
  page,
  perPage,
  search = "",
  sortBy = "created_at",
  sortDir = "desc",
  basePath,
  query,
}: ProductsQueryParams) => {
  const sanitizedPage = Math.max(1, Number.isFinite(page) ? page : 1);
  const sanitizedPerPage = Math.max(1, Math.min(100, Number.isFinite(perPage) ? perPage : 10));
  const offset = (sanitizedPage - 1) * sanitizedPerPage;

  const safeSortBy = ALLOWED_SORT_FIELDS.has(sortBy ?? "") ? (sortBy as string) : "created_at";
  const direction = (sortDir ?? "desc").toLowerCase() === "asc" ? "ASC" : "DESC";

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

  const lastPage = Math.max(1, Math.ceil(count / sanitizedPerPage));
  const currentPage = Math.min(sanitizedPage, lastPage);

  const path = new URL(basePath).origin + new URL(basePath).pathname;
  const first_page_url = buildUrl(basePath, 1, sanitizedPerPage, query)!;
  const last_page_url = buildUrl(basePath, lastPage, sanitizedPerPage, query)!;
  const next_page_url =
    currentPage < lastPage ? buildUrl(basePath, currentPage + 1, sanitizedPerPage, query) : null;
  const prev_page_url =
    currentPage > 1 ? buildUrl(basePath, currentPage - 1, sanitizedPerPage, query) : null;

  const links: PaginationMetaLink[] = [
    { url: prev_page_url, active: false },
    ...Array.from({ length: lastPage }).map((_, i) => {
      const p = i + 1;
      return { url: buildUrl(basePath, p, sanitizedPerPage, query)!, active: p === currentPage };
    }),
    { url: next_page_url, active: false },
  ];

  const meta: PaginationMeta = {
    current_page: currentPage,
    first_page_url,
    from: count === 0 ? 0 : offset + 1,
    last_page: lastPage,
    last_page_url,
    links,
    next_page_url,
    path,
    per_page: sanitizedPerPage,
    prev_page_url,
    to: Math.min(offset + sanitizedPerPage, count),
    total: count,
  };

  return { data: rows, meta };
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
  const [result] = await sequelize.query(
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
  const affected = Array.isArray(result) ? 0 : (result as unknown as number);
  if (!affected) return null;
  return getProductById(id);
};

export const deleteProduct = async (id: string, { userId }: { userId?: string }) => {
  const [result] = await sequelize.query(
    `UPDATE products SET deleted_at = :deleted_at, deleted_by = :deleted_by
     WHERE id = :id AND deleted_at IS NULL`,
    {
      type: QueryTypes.UPDATE,
      replacements: { id, deleted_at: new Date(), deleted_by: userId ?? null },
    },
  );
  const affected = Array.isArray(result) ? 0 : (result as unknown as number);
  return Boolean(affected);
};
