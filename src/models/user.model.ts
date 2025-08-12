import { Model, Optional } from "sequelize";

interface UserAttributes {
  id: string;
  name: string;
  email: string;
  password: string; // encrypted
  token?: string | null;
  created_at?: Date;
  created_by?: string | null;
  modified_at?: Date;
  modified_by?: string | null;
  deleted_at?: Date | null;
  deleted_by?: string | null;
}

type UserCreationAttributes = Optional<
  UserAttributes,
  | "id"
  | "token"
  | "created_at"
  | "created_by"
  | "modified_at"
  | "modified_by"
  | "deleted_at"
  | "deleted_by"
>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: string;
  declare name: string;
  declare email: string;
  declare password: string;
  declare token: string | null;
  declare readonly created_at: Date;
  declare created_by: string | null;
  declare readonly modified_at: Date;
  declare modified_by: string | null;
  declare readonly deleted_at: Date | null;
  declare deleted_by: string | null;
}
