import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function authContext(): TrpcContext {
  return {
    user: {
      id: 7,
      openId: "owner-7",
      name: "Owner",
      email: "owner@example.com",
      loginMethod: "test",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("resource ownership authorization", () => {
  it("does not return an outline without an owned row", async () => {
    const caller = appRouter.createCaller(authContext());
    await expect(caller.outlines.get({ id: 999999 })).rejects.toThrow(
      "Outline not found"
    );
  });

  it("does not update a character without an owned row", async () => {
    const caller = appRouter.createCaller(authContext());
    await expect(
      caller.characters.update({ id: 999999, name: "attacker" })
    ).rejects.toThrow("Character not found");
  });

  it("does not list chapters from an unowned outline", async () => {
    const caller = appRouter.createCaller(authContext());
    await expect(
      caller.outlines.chapters({ outlineId: 999999 })
    ).rejects.toThrow("Outline not found");
  });
});
