import { sendTelegramNotification } from "./telegram";

export async function sendNotification(title: string, content: string): Promise<boolean> {
  const telegramSuccess = await sendTelegramNotification(title, content);
  
  // Later we can add Discord/Slack here
  
  return telegramSuccess;
}
