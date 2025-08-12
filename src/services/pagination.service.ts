import { Request } from "express";

import { buildUrl, PaginationMeta, PaginationMetaLink } from "@/helpers/pagination.helper";

export interface ParsedPaginationQuery {
  page: number;
  perPage: number;
  search: string;
  sortBy: string;
  order: "asc" | "desc";
  basePath: string;
  query: Record<string, unknown>;
}

export const parsePaginationQuery = (req: Request): ParsedPaginationQuery => {
  const {
    page = "1",
    per_page = "10",
    search = "",
    sort_by = "created_at",
    order = "desc",
  } = req.query as Record<string, string>;

  const basePath = `${req.protocol}://${req.get("host")}${req.baseUrl}${req.path}`;

  return {
    page: Number(page),
    perPage: Number(per_page),
    search,
    sortBy: sort_by,
    order: order?.toLowerCase() === "asc" ? "asc" : "desc",
    basePath,
    query: req.query as Record<string, unknown>,
  };
};

export const sanitizePagination = (page: number, perPage: number) => {
  const sanitizedPage = Math.max(1, Number.isFinite(page) ? page : 1);
  const sanitizedPerPage = Math.max(1, Math.min(100, Number.isFinite(perPage) ? perPage : 10));
  const offset = (sanitizedPage - 1) * sanitizedPerPage;
  return { sanitizedPage, sanitizedPerPage, offset };
};

export const getLimitOffset = (page: number, perPage: number) => {
  const { sanitizedPerPage, offset } = sanitizePagination(page, perPage);
  return { limit: sanitizedPerPage, offset };
};

export const buildPaginationMeta = ({
  basePath,
  query,
  total,
  page,
  perPage,
}: {
  basePath: string;
  query: Record<string, unknown>;
  total: number;
  page: number;
  perPage: number;
}): PaginationMeta => {
  const { sanitizedPage, sanitizedPerPage, offset } = sanitizePagination(page, perPage);

  const lastPage = Math.max(1, Math.ceil(total / sanitizedPerPage));
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
      return {
        url: buildUrl(basePath, p, sanitizedPerPage, query)!,
        active: p === currentPage,
      };
    }),
    { url: next_page_url, active: false },
  ];

  return {
    current_page: currentPage,
    first_page_url,
    from: total === 0 ? 0 : offset + 1,
    last_page: lastPage,
    last_page_url,
    links,
    next_page_url,
    path,
    per_page: sanitizedPerPage,
    prev_page_url,
    to: Math.min(offset + sanitizedPerPage, total),
    total,
  };
};
