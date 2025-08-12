import { Sequelize } from "sequelize";
import { ENV } from "./env";

export const sequelize = new Sequelize(ENV.DB_NAME, ENV.DB_USER, ENV.DB_PASS, {
  dialect: "mysql",
  host: ENV.DB_HOST,
  logging: false,
  port: ENV.DB_PORT,
});
