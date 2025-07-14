declare module "@ast-grep/napi" {
  // Extremely small typing surface—expand as needed.
  export function parse(
    language: string,
    source: string,
  ): {
    root(): {
      findAll(pattern: string): Array<{
        text(): string;
        range(): { start: { line: number }; end: { line: number } };
      }>;
    };
  };
}