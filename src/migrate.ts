import { SequelizeStorage, Umzug } from "umzug";

import { sequelize } from "./config/database";

const umzug = new Umzug({
  migrations: { glob: "src/migrations/*.ts" },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

const main = async () => {
  await sequelize.authenticate();
  const command = process.argv[2] ?? "up";

  if (command === "up") {
    const executed = await umzug.up();
    executed.forEach((m) => console.log(`Executed: ${m.name}`));
  } else if (command === "down") {
    const reverted = await umzug.down({ to: 0 });
    reverted.forEach((m) => console.log(`Reverted: ${m.name}`));
  } else if (command === "status") {
    const [executed, pending] = await Promise.all([umzug.executed(), umzug.pending()]);
    console.log(
      "Executed:",
      executed.map((m) => m.name),
    );
    console.log(
      "Pending:",
      pending.map((m) => m.name),
    );
  } else if (command === "pending") {
    const pending = await umzug.pending();
    console.log(
      "Pending:",
      pending.map((m) => m.name),
    );
  } else {
    console.error(`Unknown command: ${command}`);
    process.exitCode = 1;
  }

  await sequelize.close();
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
