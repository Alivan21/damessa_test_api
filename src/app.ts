import express from "express";

import { sequelize } from "./config/database";
import routes from "./routes";

const app = express();

app.use(express.json());
app.use("/api", routes);

sequelize
  .authenticate()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("DB connection error:", err));

export default app;
