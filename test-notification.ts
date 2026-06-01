import { sendTelegramNotification } from "./server/_core/notifications/telegram.js";
import { ENV } from "./server/_core/env.js";

// Manually set for test if not in process.env
// The agent already got these from the user.
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

if (!token || !chatId) {
  console.error("Missing environment variables for test.");
  process.exit(1);
}

console.log("Sending test Telegram notification...");
const success = await sendTelegramNotification(
  "🚀 ibl1nk Notification Test",
  "This is a test notification from the oh-my-gemini configure-notifications skill."
);

if (success) {
  console.log("Test notification sent successfully! ✅");
} else {
  console.error("Failed to send test notification. ❌");
  process.exit(1);
}
