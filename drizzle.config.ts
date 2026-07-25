import { defineConfig } from "drizzle-kit";

const connectionString = process.env.DATABASE_URL || "ibl1nk.db";

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: connectionString,
  },
});
