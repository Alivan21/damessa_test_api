import { randomUUID } from "node:crypto";
import path from "node:path";
import { CreationAttributes, QueryInterface } from "sequelize";

import { hashPassword } from "@/helpers/bcrypt.helper";
import { readJSON } from "@/helpers/read-json.helper";
import { User } from "@/models/user.model";

export const up = async ({ context: queryInterface }: { context: QueryInterface }) => {
  const file = path.resolve(process.cwd(), "src/seeders/data/users.json");
  const users = await readJSON<CreationAttributes<User>[]>(file);

  const now = new Date();
  const rows = await Promise.all(
    users.map(async (u) => ({
      id: u.id ?? randomUUID(),
      name: u.name,
      email: u.email,
      password: await hashPassword(u.password),
      token: u.token ?? null,
      created_by: u.created_by ?? null,
      modified_by: u.modified_by ?? null,
      deleted_by: u.deleted_by ?? null,
      created_at: now,
      modified_at: now,
      deleted_at: null,
    })),
  );

  await queryInterface.bulkInsert("users", rows);
};

export const down = async ({ context: queryInterface }: { context: QueryInterface }) => {
  await queryInterface.bulkDelete("users", {});
};
