import { sequelize } from "@/config/database";
import { DataTypes, Model, Optional } from "sequelize";

export interface CategoryAttributes {
  id: string;
  name: string;
  created_at?: Date;
  created_by?: string | null;
  modified_at?: Date;
  modified_by?: string | null;
  deleted_at?: Date | null;
  deleted_by?: string | null;
}

export type CategoryCreationAttributes = Optional<
  CategoryAttributes,
  "id" | "created_at" | "created_by" | "modified_at" | "modified_by" | "deleted_at" | "deleted_by"
>;

export class Category
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  declare id: string;
  declare name: string;
  declare readonly created_at: Date;
  declare created_by: string | null;
  declare readonly modified_at: Date;
  declare modified_by: string | null;
  declare readonly deleted_at: Date | null;
  declare deleted_by: string | null;
}

Category.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    created_by: { type: DataTypes.UUID, allowNull: true },
    modified_by: { type: DataTypes.UUID, allowNull: true },
    deleted_by: { type: DataTypes.UUID, allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    modified_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    deleted_at: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    tableName: "categories",
    modelName: "Category",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "modified_at",
    paranoid: true,
    deletedAt: "deleted_at",
  },
);
