import { cn } from '~/lib/utils';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
  // Simple markdown to HTML conversion for basic formatting
  const formatMarkdown = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        // Headers
        if (line.startsWith('# ')) {
          return (
            <h1 key={index} className="text-2xl font-bold mb-4 mt-6 first:mt-0 text-foreground">
              {line.substring(2)}
            </h1>
          );
        }
        if (line.startsWith('## ')) {
          return (
            <h2 key={index} className="text-xl font-semibold mb-3 mt-5 text-foreground">
              {line.substring(3)}
            </h2>
          );
        }
        if (line.startsWith('### ')) {
          return (
            <h3 key={index} className="text-lg font-semibold mb-2 mt-4 text-foreground">
              {line.substring(4)}
            </h3>
          );
        }

        // Code blocks (simple detection)
        if (line.startsWith('```')) {
          return (
            <div key={index} className="my-2">
              <code className="text-xs text-muted-foreground">{line}</code>
            </div>
          );
        }

        // List items
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <li key={index} className="ml-4 list-disc">
              {line.substring(2)}
            </li>
          );
        }

        // Empty lines
        if (line.trim() === '') {
          return <br key={index} />;
        }

        // Regular paragraphs
        return (
          <p key={index} className="mb-2">
            {line}
          </p>
        );
      });
  };

  return (
    <div className={cn('prose prose-sm max-w-none dark:prose-invert overflow-auto h-full p-4', className)}>
      <div className="space-y-1">{formatMarkdown(content)}</div>
    </div>
  );
}