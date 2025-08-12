export type SortDirection = "asc" | "desc";

export interface PaginationMetaLink {
  url: string | null;
  active: boolean;
}

export interface PaginationMeta {
  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationMetaLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export const buildUrl = (
  basePath: string,
  page: number | null,
  perPage: number,
  query: Record<string, unknown>,
) => {
  if (page === null) return null;
  const url = new URL(basePath);
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue;
    if (key === "page" || key === "per_page") continue;
    params.set(key, String(value));
  }
  params.set("page", String(page));
  params.set("per_page", String(perPage));
  url.search = params.toString();
  return url.toString();
};
