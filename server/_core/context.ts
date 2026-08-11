import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import { ENV } from "./env";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

const DEV_MOCK_USER: User = {
  id: 1,
  openId: "local-dev-writer",
  name: "Local Writer",
  email: "writer@local.dev",
  loginMethod: "local",
  role: "user",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }

  // Only use the mock identity outside production. Production must fail closed
  // when authentication is missing or misconfigured.
  if (!user && !ENV.isProduction) {
    user = DEV_MOCK_USER;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
