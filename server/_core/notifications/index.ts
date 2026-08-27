// ponytail: notification wrapper ซ้ำทางเดินที่ใช้งานจริง; upgrade: เก็บเมื่อ router เลือกใช้โดยตรง มิฉะนั้นลบ
import { sendTelegramNotification } from "./telegram";

export async function sendNotification(
  title: string,
  content: string
): Promise<boolean> {
  const telegramSuccess = await sendTelegramNotification(title, content);

  // Later we can add Discord/Slack here

  return telegramSuccess;
}
