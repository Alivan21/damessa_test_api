import { DataTypes, Model, Optional } from "sequelize";

import { sequelize } from "@/config/database";

interface UserAttributes {
  email: string;
  id: number;
  name: string;
  password: string;
}

type UserCreationAttributes = Optional<UserAttributes, "id">;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public email!: string;
  public id!: number;
  public name!: string;
  public password!: string;
}

User.init(
  {
    email: { allowNull: false, type: DataTypes.STRING, unique: true },
    id: { autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER.UNSIGNED },
    name: { allowNull: false, type: DataTypes.STRING },
    password: { allowNull: false, type: DataTypes.STRING },
  },
  { sequelize, tableName: "users" },
);
