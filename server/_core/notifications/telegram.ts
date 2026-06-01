import { ENV } from "../env";

export async function sendTelegramNotification(title: string, content: string): Promise<boolean> {
  const token = ENV.telegramBotToken;
  const chatId = ENV.telegramChatId;

  if (!token || !chatId) {
    console.warn("[Telegram] Token or Chat ID not configured.");
    return false;
  }

  const message = `*${title}*\n\n${content}`;
  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.warn(`[Telegram] Failed to send notification: ${response.status} ${response.statusText} - ${detail}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[Telegram] Error sending notification:", error);
    return false;
  }
}
