"use client";

interface ExplanationRendererProps {
  text: string;
}

type PartType = "text" | "bold" | "italic";

interface Part {
  type: PartType;
  content: string;
}

/**
 * Renders explanation text with support for:
 * - **bold** text (Markdown-style double asterisks)
 * - *italic* text (Markdown-style single asterisks)
 */
export const ExplanationRenderer = ({ text }: ExplanationRendererProps) => {
  const parseExplanation = (input: string): Part[] => {
    const parts: Part[] = [];

    // Combined regex for bold (**text**) and italic (*text*)
    // Order matters: match ** before * to avoid partial matches
    const combinedRegex = /\*\*(.+?)\*\*|\*([^*]+?)\*/g;

    let lastIndex = 0;
    let match;

    while ((match = combinedRegex.exec(input)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push({ type: "text", content: input.slice(lastIndex, match.index) });
      }

      if (match[1] !== undefined) {
        // Bold text match - match[1] contains the text inside **
        parts.push({ type: "bold", content: match[1] });
      } else if (match[2] !== undefined) {
        // Italic text match - match[2] contains the text inside *
        parts.push({ type: "italic", content: match[2] });
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < input.length) {
      parts.push({ type: "text", content: input.slice(lastIndex) });
    }

    return parts.length > 0 ? parts : [{ type: "text", content: input }];
  };

  const parts = parseExplanation(text);

  return (
    <span className="leading-relaxed">
      {parts.map((part, index) => {
        if (part.type === "bold") {
          return (
            <strong key={index} className="font-semibold text-foreground">
              {part.content}
            </strong>
          );
        }

        if (part.type === "italic") {
          return (
            <em key={index} className="italic text-foreground">
              {part.content}
            </em>
          );
        }

        return <span key={index}>{part.content}</span>;
      })}
    </span>
  );
};
