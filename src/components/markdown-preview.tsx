import { cn } from '~/lib/utils';

interface MarkdownPreviewProps {
  content?: string;
  className?: string;
}

export function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
  // Simple markdown to HTML conversion for basic formatting
  const formatMarkdown = (text: string) => {
    // Guard against undefined or null content
    if (!text) {
      return <p className="text-muted-foreground text-xs">No content to display</p>;
    }

    return text.split('\n').map((line, index) => {
      // Headers - same size as regular text, just bold
      if (line.startsWith('# ')) {
        return (
          <div key={index} className="text-xs font-bold">
            {line.substring(2)}
          </div>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <div key={index} className="text-xs font-semibold">
            {line.substring(3)}
          </div>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <div key={index} className="text-xs font-medium">
            {line.substring(4)}
          </div>
        );
      }

      // Code blocks (simple detection)
      if (line.startsWith('```')) {
        return (
          <div key={index} className="text-xs text-muted-foreground">
            {line}
          </div>
        );
      }

      // List items
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <div key={index} className="text-xs pl-4">
            • {line.substring(2)}
          </div>
        );
      }

      // Empty lines
      if (line.trim() === '') {
        return <div key={index} className="h-2" />;
      }

      // Regular paragraphs
      return (
        <div key={index} className="text-xs">
          {line}
        </div>
      );
    });
  };

  return (
    <div
      className={cn(
        'overflow-auto h-full p-4',
        'bg-surface-sunken border border-border-subtle rounded-lg',
        'font-mono text-xs text-foreground/80',
        className
      )}
    >
      <div className="whitespace-pre-wrap leading-relaxed">{formatMarkdown(content || '')}</div>
    </div>
  );
}
