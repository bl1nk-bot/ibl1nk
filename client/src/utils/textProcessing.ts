/**
 * Text processing utility functions
 * Extracted from NoteTaskApp.tsx for better maintainability
 */

import { NoteLink } from "../types";

export const plainTextCharCount = (text: string): number => {
  if (!text) return 0;
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = text;
  const plainText = tempDiv.textContent || tempDiv.innerText || "";
  return plainText.length;
};

export const parseNoteLinks = (content: string): NoteLink[] => {
  const links: NoteLink[] = [];
  const regex = /\[\[(.*?)\]\]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const fullMatch = match[1];
    const pipeIndex = fullMatch.indexOf("|");
    const targetTitle =
      pipeIndex !== -1
        ? fullMatch.substring(0, pipeIndex).trim()
        : fullMatch.trim();
    if (targetTitle) {
      links.push({ targetTitle });
    }
  }
  return links;
};

export const parseInputForContext = (text: string): Record<string, any> => {
  const lines = text.split("\n");
  const context: Record<string, any> = {};
  let tempCharacters: string[] = [];

  lines.forEach(line => {
    const titleMatch = line.match(/^#\s+(.*)/);
    if (titleMatch) context.title = titleMatch[1].trim();

    const sectionMatch = line.match(/^##\s+(.*)/);
    if (sectionMatch) {
      if (!context.sections) context.sections = [];
      context.sections.push(sectionMatch[1].trim());
    }

    const charMatch = line.match(/^- (?:Character|ตัวละคร|Char):\s*(.*)/i);
    if (charMatch)
      tempCharacters = tempCharacters.concat(
        charMatch[1]
          .split(",")
          .map(s => s.trim())
          .filter(s => s)
      );

    const mentionMatches = line.matchAll(/@([\w\s-]+)(?=\s|\[\[|$)/g);
    for (const mentionMatch of mentionMatches)
      tempCharacters.push(mentionMatch[1].trim());

    const settingMatch = line.match(/^- (?:Setting|สถานที่|Location):\s*(.*)/i);
    if (settingMatch) context.setting = settingMatch[1].trim();

    const plotMatch = line.match(
      /^- (?:Plot Point|Plot|โครงเรื่องย่อย|โครงฉาก):\s*(.*)/i
    );
    if (plotMatch) {
      if (!context.plotPoints) context.plotPoints = [];
      context.plotPoints.push(plotMatch[1].trim());
    }

    const toneMatch = line.match(/^- (?:Tone|โทน|อารมณ์):\s*(.*)/i);
    if (toneMatch) context.tone = toneMatch[1].trim();

    const objectiveMatch = line.match(
      /^- (?:Objective|เป้าหมาย|จุดประสงค์):\s*(.*)/i
    );
    if (objectiveMatch) context.objective = objectiveMatch[1].trim();
  });

  if (tempCharacters.length > 0)
    context.characters = Array.from(
      new Set(tempCharacters.map(c => c.replace(/_/g, " ")))
    ).filter(c => c.length > 0 && c.trim() !== "");

  return context;
};

export const formatParsedContextForPrompt = (
  parsedContext: Record<string, any>
): string => {
  let contextString =
    "\n\n## ข้อมูลเพิ่มเติมจากคำสั่ง (Parsed Input Context):\n";
  let hasParsedContext = false;

  if (parsedContext.title) {
    contextString += `ชื่อเรื่อง/ฉากที่ระบุ: ${parsedContext.title}\n`;
    hasParsedContext = true;
  }

  if (parsedContext.sections && parsedContext.sections.length > 0) {
    contextString += `ส่วนย่อยที่ระบุ: ${parsedContext.sections.join(", ")}\n`;
    hasParsedContext = true;
  }

  if (parsedContext.characters && parsedContext.characters.length > 0) {
    contextString += `ตัวละครที่เกี่ยวข้อง: ${parsedContext.characters.join(", ")}\n`;
    hasParsedContext = true;
  }

  if (parsedContext.setting) {
    contextString += `สถานที่/ฉากหลัง: ${parsedContext.setting}\n`;
    hasParsedContext = true;
  }

  if (parsedContext.plotPoints && parsedContext.plotPoints.length > 0) {
    contextString += `ประเด็นสำคัญ/โครงเรื่องย่อย:\n${parsedContext.plotPoints
      .map((p: string) => `- ${p}`)
      .join("\n")}\n`;
    hasParsedContext = true;
  }

  if (parsedContext.tone) {
    contextString += `โทน/อารมณ์ที่ต้องการ: ${parsedContext.tone}\n`;
    hasParsedContext = true;
  }

  if (parsedContext.objective) {
    contextString += `เป้าหมาย/จุดประสงค์ของคำสั่งนี้: ${parsedContext.objective}\n`;
    hasParsedContext = true;
  }

  return hasParsedContext ? contextString : "";
};
