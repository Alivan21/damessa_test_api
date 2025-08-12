import { sequelize } from "@/config/database";
import { DataTypes, Model, Optional } from "sequelize";
import { Category } from "./category.model";

export interface ProductAttributes {
  id: string;
  name: string;
  price: number;
  stock?: number;
  category_id: string;
  created_at?: Date;
  created_by?: string | null;
  modified_at?: Date;
  modified_by?: string | null;
  deleted_at?: Date | null;
  deleted_by?: string | null;
}

export type ProductCreationAttributes = Optional<
  ProductAttributes,
  | "id"
  | "stock"
  | "created_at"
  | "created_by"
  | "modified_at"
  | "modified_by"
  | "deleted_at"
  | "deleted_by"
>;

export class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  declare id: string;
  declare name: string;
  declare price: number;
  declare stock: number;
  declare category_id: string;
  declare readonly created_at: Date;
  declare created_by: string | null;
  declare readonly modified_at: Date;
  declare modified_by: string | null;
  declare readonly deleted_at: Date | null;
  declare deleted_by: string | null;
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    category_id: { type: DataTypes.UUID, allowNull: false },
    created_by: { type: DataTypes.UUID, allowNull: true },
    modified_by: { type: DataTypes.UUID, allowNull: true },
    deleted_by: { type: DataTypes.UUID, allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    modified_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    deleted_at: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    tableName: "products",
    modelName: "Product",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "modified_at",
    paranoid: true,
    deletedAt: "deleted_at",
  },
);

// Associations
Product.belongsTo(Category, {
  foreignKey: "category_id",
  as: "category",
});
