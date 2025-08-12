import { DataTypes, QueryInterface } from "sequelize";

export const up = async ({ context: queryInterface }: { context: QueryInterface }) => {
  await queryInterface.createTable("categories", {
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
  });
};

export const down = async ({ context: queryInterface }: { context: QueryInterface }) => {
  await queryInterface.dropTable("categories");
};
