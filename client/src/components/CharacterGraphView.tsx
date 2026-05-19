import { useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Character {
  id: number;
  name: string;
  role: string;
}

interface Relationship {
  from: number;
  to: number;
  type: string;
}

interface CharacterGraphViewProps {
  characters: Character[];
  relationships: Relationship[];
  title?: string;
  description?: string;
}

export function CharacterGraphView({
  characters,
  relationships,
  title = "Character Relationships",
  description = "Visual map of character connections",
}: CharacterGraphViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || characters.length === 0) return;

    // Generate Mermaid graph syntax
    const mermaidCode = generateMermaidGraph(characters, relationships);

    // Create SVG container
    const container = containerRef.current;
    container.innerHTML = "";

    // For now, display the Mermaid code as a placeholder
    // In production, you would use mermaid.render() to convert to SVG
    const pre = document.createElement("pre");
    pre.style.cssText = `
      background: #f5f5f5;
      padding: 1rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      overflow-x: auto;
      font-family: monospace;
    `;
    pre.textContent = mermaidCode;
    container.appendChild(pre);

    // Add note about Mermaid rendering
    const note = document.createElement("p");
    note.style.cssText = `
      margin-top: 1rem;
      font-size: 0.875rem;
      color: #666;
    `;
    note.textContent = "Note: Mermaid graph will render here in production";
    container.appendChild(note);
  }, [characters, relationships]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          ref={containerRef}
          className="w-full min-h-[400px] bg-muted rounded-lg p-4 flex items-center justify-center"
        />
      </CardContent>
    </Card>
  );
}

function generateMermaidGraph(
  characters: Character[],
  relationships: Relationship[]
): string {
  let graph = "graph TD\n";

  // Add character nodes
  characters.forEach(char => {
    const roleColor = getRoleColor(char.role);
    graph += `  ${char.id}["${char.name}<br/><small>${char.role}</small>"]:::${roleColor}\n`;
  });

  // Add relationship edges
  relationships.forEach(rel => {
    graph += `  ${rel.from} -->|${rel.type}| ${rel.to}\n`;
  });

  // Add styling
  graph += `
  classDef protagonist fill:#6b8e99,stroke:#333,stroke-width:2px,color:#fff
  classDef antagonist fill:#d4a574,stroke:#333,stroke-width:2px,color:#fff
  classDef mentor fill:#c9b8a8,stroke:#333,stroke-width:2px,color:#333
  classDef supporting fill:#a8a8a8,stroke:#333,stroke-width:2px,color:#fff
  classDef minor fill:#d3d3d3,stroke:#333,stroke-width:1px,color:#333
`;

  return graph;
}

function getRoleColor(role: string): string {
  const roleColorMap: Record<string, string> = {
    protagonist: "protagonist",
    antagonist: "antagonist",
    mentor: "mentor",
    supporting: "supporting",
    minor: "minor",
  };
  return roleColorMap[role] || "supporting";
}
