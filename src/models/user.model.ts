import { sequelize } from "@/config/database";
import { DataTypes, Model, Optional } from "sequelize";

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

User.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    token: { type: DataTypes.STRING, allowNull: true },
    created_by: { type: DataTypes.UUID, allowNull: true },
    modified_by: { type: DataTypes.UUID, allowNull: true },
    deleted_by: { type: DataTypes.UUID, allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    modified_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    deleted_at: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    tableName: "users",
    modelName: "User",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "modified_at",
    paranoid: true,
    deletedAt: "deleted_at",
  },
);
