import { describe, it, expect } from "vitest";
import { runSystemDiagnostics } from "../_core/diagnostics";
import { appRouter } from "../routers";

describe("DevOps Diagnostics & Security System Suite", () => {
  const caller = appRouter.createCaller({
    user: {
      id: 1,
      openId: "test-user-1",
      name: "DevOps Auditor",
      role: "user" as const,
    },
    req: {} as any,
    res: { clearCookie: () => {}, cookie: () => {} } as any,
  });

  it("should run diagnostics and return comprehensive health status", async () => {
    const report = await runSystemDiagnostics();
    expect(report).toBeDefined();
    expect(report.environment).toBeDefined();
    expect(report.nodeVersion).toBeDefined();
    expect(["healthy", "degraded", "critical"]).toContain(report.status);

    expect(report.components.database).toBeDefined();
    expect(report.components.authentication).toBeDefined();
    expect(report.components.security.headersActive).toBe(true);
    expect(report.components.security.byokKeyIsolation).toBe(true);

    expect(Array.isArray(report.warnings)).toBe(true);
  });

  it("should expose system diagnostics via tRPC endpoint", async () => {
    const diag = await caller.system.diagnostics();
    expect(diag).toBeDefined();
    expect(diag.uptimeSeconds).toBeGreaterThanOrEqual(0);
    expect(diag.memoryUsageMB).toBeGreaterThan(0);
  });
});
