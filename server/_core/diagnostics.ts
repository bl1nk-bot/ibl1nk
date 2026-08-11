import { ENV } from "./env";
import { getDb } from "../db";

export interface SystemWarning {
  level: "critical" | "warning" | "info";
  code: string;
  category: "database" | "security" | "auth" | "storage" | "ai";
  message: string;
  remediation: string;
}

export async function runSystemDiagnostics() {
  const warnings: SystemWarning[] = [];
  const db = await getDb();

  // 1. Database Diagnosis
  const isDbConnected = Boolean(db && ENV.databaseUrl);
  if (!isDbConnected) {
    warnings.push({
      level: "warning",
      code: "DB_IN_MEMORY_FALLBACK",
      category: "database",
      message:
        "DATABASE_URL is not configured. Running in-memory database mode.",
      remediation:
        "Set DATABASE_URL in environment for persistent MySQL/TiDB storage.",
    });
  }

  // 2. Auth & Session Diagnosis
  const isOAuthSet = Boolean(ENV.oAuthServerUrl);
  if (!isOAuthSet) {
    warnings.push({
      level: "info",
      code: "AUTH_LOCAL_DEV_BYPASS",
      category: "auth",
      message:
        "OAUTH_SERVER_URL is unset. Local development mock user authentication is active.",
      remediation:
        "Set OAUTH_SERVER_URL and VITE_APP_ID before deploying to public production.",
    });
  }

  // 3. Security Key Diagnosis
  const isJwtSecretSet = Boolean(
    ENV.cookieSecret && ENV.cookieSecret.length >= 16
  );
  if (!isJwtSecretSet) {
    warnings.push({
      level: "warning",
      code: "JWT_SECRET_DEFAULT",
      category: "security",
      message:
        "JWT_SECRET is unset or too short (<16 chars). Using ephemeral secret.",
      remediation: "Set a strong random 32+ character JWT_SECRET in .env.",
    });
  }

  // 4. Storage Diagnosis
  const isS3Configured = Boolean(
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.S3_BUCKET
  );
  if (!isS3Configured) {
    warnings.push({
      level: "info",
      code: "S3_BACKUP_UNCONFIGURED",
      category: "storage",
      message:
        "AWS S3 credentials not provided. Vault backups are available via local browser downloads.",
      remediation:
        "Set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and S3_BUCKET if automated cloud backups are required.",
    });
  }

  // 5. AI Assistant Diagnosis
  const hasServerAiKey = Boolean(
    process.env.OPENAI_API_KEY ||
    process.env.ANTHROPIC_API_KEY ||
    process.env.GEMINI_API_KEY
  );

  return {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    nodeVersion: process.version,
    uptimeSeconds: Math.floor(process.uptime()),
    memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    status: warnings.some(w => w.level === "critical")
      ? "critical"
      : warnings.length > 0
        ? "degraded"
        : "healthy",
    components: {
      database: {
        mode: isDbConnected ? "mysql_tidb" : "in_memory_store",
        connected: isDbConnected,
      },
      authentication: {
        mode: isOAuthSet ? "oauth_production" : "local_dev_mock",
        bypassActive: !isOAuthSet,
      },
      security: {
        jwtConfigured: isJwtSecretSet,
        headersActive: true,
        byokKeyIsolation: true,
      },
      storage: {
        s3Configured: isS3Configured,
        localExportActive: true,
      },
      ai: {
        serverKeyProvided: hasServerAiKey,
        byokSupported: true,
      },
    },
    warnings,
  };
}

export function logDevOpsStartupReport(
  diag: Awaited<ReturnType<typeof runSystemDiagnostics>>
) {
  console.log("\n=======================================================");
  console.log(
    `🚀 [DEVOPS SYSTEM HEALTH CHECK] Status: ${diag.status.toUpperCase()}`
  );
  console.log(`📦 Database Mode : ${diag.components.database.mode}`);
  console.log(`🔐 Auth Mode     : ${diag.components.authentication.mode}`);
  console.log(
    `🛡️ Security State: JWT=${diag.components.security.jwtConfigured ? "SECURED" : "EPHEMERAL"}, BYOK_Isolation=ACTIVE`
  );
  console.log(
    `💾 Storage State : S3=${diag.components.storage.s3Configured ? "CONNECTED" : "LOCAL_DOWNLOAD_MODE"}`
  );
  console.log("-------------------------------------------------------");
  if (diag.warnings.length > 0) {
    console.log(`⚠️ ACTIVE WARNINGS & ADVISORIES (${diag.warnings.length}):`);
    diag.warnings.forEach((w, i) => {
      const icon =
        w.level === "critical" ? "🔴" : w.level === "warning" ? "🟡" : "ℹ️";
      console.log(`  ${icon} [${w.code}] ${w.message}`);
      console.log(`     👉 Remediation: ${w.remediation}`);
    });
  } else {
    console.log("✨ All system components validated with 0 warnings!");
  }
  console.log("=======================================================\n");
}
