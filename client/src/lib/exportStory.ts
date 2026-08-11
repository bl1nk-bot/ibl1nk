export function downloadTextFile(
  filename: string,
  content: string,
  mimeType = "text/markdown"
) {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportStoryToMarkdown(
  outline: any,
  chapters: any[] = [],
  characters: any[] = []
) {
  const sanitize = (name: string) => name.replace(/[/\\?%*:|"<>]/g, "-").trim();
  const title = outline.title || "Untitled Story";

  let md = `# ${title}\n\n`;
  if (outline.description) {
    md += `> **Synopsis**: ${outline.description}\n\n`;
  }
  md += `- **Status**: ${outline.status || "In Progress"}\n`;
  md += `- **Total Chapters**: ${chapters.length}\n`;
  md += `- **Exported At**: ${new Date().toLocaleString()}\n\n`;

  // Characters section
  if (characters.length > 0) {
    md += `## 👥 Dramatis Personae (Characters)\n\n`;
    characters.forEach(char => {
      md += `### ${char.name} (${char.role || "Supporting"})\n`;
      if (char.description) md += `${char.description}\n\n`;
      if (char.traits) {
        const traits = Array.isArray(char.traits)
          ? char.traits.join(", ")
          : char.traits;
        md += `* **Traits**: \`${traits}\`\n\n`;
      }
    });
    md += `---\n\n`;
  }

  // Chapters & Scenes section
  md += `## 📖 Story Chapters\n\n`;
  if (chapters.length === 0) {
    md += `*No chapters added yet.*\n`;
  } else {
    chapters.forEach((ch, idx) => {
      const num = ch.chapterNumber ?? idx + 1;
      md += `### Chapter ${num}: ${ch.title}\n\n`;
      if (ch.description) {
        md += `*${ch.description}*\n\n`;
      }
      md += `*(Status: ${ch.status || "planning"} | Word count: ${ch.wordCount || 0})*\n\n`;
      md += `---\n\n`;
    });
  }

  downloadTextFile(`${sanitize(title)}.md`, md);
}

export function exportStoryObsidianMarkdown(
  outline: any,
  chapters: any[] = [],
  characters: any[] = []
) {
  const sanitize = (name: string) => name.replace(/[/\\?%*:|"<>]/g, "-").trim();
  const title = outline.title || "Untitled Story";

  let vaultContent = `---
title: "${title}"
status: "${outline.status || "draft"}"
total_chapters: ${chapters.length}
created_at: "${new Date().toISOString()}"
tags:
  - story-vault
  - novel-project
---

# ${title}

${outline.description || ""}

## [[Chapters/Index|Chapter Breakdown]]
${chapters.map((ch, i) => `- [[Chapter-${ch.chapterNumber || i + 1}|Chapter ${ch.chapterNumber || i + 1}: ${ch.title}]]`).join("\n")}

## [[Characters/Index|Cast of Characters]]
${characters.map(c => `- [[${c.name}|${c.name}]] (${c.role})`).join("\n")}
`;

  downloadTextFile(`${sanitize(title)}-Obsidian-Index.md`, vaultContent);
}
