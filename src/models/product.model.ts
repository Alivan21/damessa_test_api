import { Model, Optional } from "sequelize";

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

// Intentionally no runtime initialization here. The table is managed via migrations.
