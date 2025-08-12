import { randomUUID } from "node:crypto";
import path from "node:path";
import { CreationAttributes, QueryInterface } from "sequelize";

import { readJSON } from "@/helpers/read-json.helper";
import { Product } from "@/models/product.model";

export const up = async ({ context: queryInterface }: { context: QueryInterface }) => {
  const file = path.resolve(process.cwd(), "src/seeders/data/products.json");
  const products = await readJSON<CreationAttributes<Product>[]>(file);

  const now = new Date();
  const rows = products.map((p) => ({
    id: p.id ?? randomUUID(),
    name: p.name,
    price: p.price,
    stock: p.stock ?? 0,
    category_id: p.category_id,
    created_by: p.created_by ?? null,
    modified_by: p.modified_by ?? null,
    deleted_by: p.deleted_by ?? null,
    created_at: now,
    modified_at: now,
    deleted_at: null,
  }));

  await queryInterface.bulkInsert("products", rows);
};

export const down = async ({ context: queryInterface }: { context: QueryInterface }) => {
  await queryInterface.bulkDelete("products", {});
};
