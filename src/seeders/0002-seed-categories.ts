import { randomUUID } from "node:crypto";
import path from "node:path";
import { CreationAttributes, QueryInterface } from "sequelize";

import { readJSON } from "@/helpers/read-json.helper";
import { Category } from "@/models/category.model";

export const up = async ({ context: queryInterface }: { context: QueryInterface }) => {
  const file = path.resolve(process.cwd(), "src/seeders/data/categories.json");
  const categories = await readJSON<CreationAttributes<Category>[]>(file);

  const now = new Date();
  const rows = categories.map((c) => ({
    id: c.id ?? randomUUID(),
    name: c.name,
    created_by: c.created_by ?? null,
    modified_by: c.modified_by ?? null,
    deleted_by: c.deleted_by ?? null,
    created_at: now,
    modified_at: now,
    deleted_at: null,
  }));

  await queryInterface.bulkInsert("categories", rows);
};

export const down = async ({ context: queryInterface }: { context: QueryInterface }) => {
  await queryInterface.bulkDelete("categories", {});
};
