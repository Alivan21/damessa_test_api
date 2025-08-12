import fs from "node:fs/promises";

export const readJSON = async <T>(filePath: string): Promise<T> => {
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data) as T;
};
