import { GoogleGenerativeAI } from '@google/generative-ai';

// Types for ast-grep AI functionality
export interface AstGrepRule {
  pattern: string;
  languages?: string[];
  kind?: string;
}

export interface AiTransformResult {
  rule: AstGrepRule;
  suggestedPaths?: string[];
  intent: 'refactor' | 'debug' | 'add' | 'find' | 'other';
}

// Detect if prompt is natural language or ast-grep syntax
export function isNaturalLanguagePrompt(prompt: string): boolean {
  // Simple heuristics: length > 10 and no ast-grep syntax patterns
  if (prompt.length <= 10) return false;

  // Check for ast-grep syntax indicators
  const astGrepPatterns = [
    /\$[A-Z_]+/, // $VAR, $FUNC, etc.
    /\$\$\$/, // $$$ wildcard
    /kind:\s*\w+/, // kind: function_definition
    /pattern:\s*[|>]/, // YAML pattern syntax
    /rule:/, // rule syntax
  ];

  return !astGrepPatterns.some((pattern) => pattern.test(prompt));
}

// Classify prompt intent using keyword matching
export function classifyPromptIntent(
  prompt: string
): 'refactor' | 'debug' | 'add' | 'find' | 'other' {
  const lowerPrompt = prompt.toLowerCase();

  const intentKeywords = {
    refactor: ['refactor', 'update', 'change', 'modify', 'replace', 'rename'],
    debug: ['bug', 'error', 'fix', 'issue', 'problem', 'debug'],
    add: ['add', 'new', 'create', 'implement', 'insert'],
    find: ['find', 'search', 'locate', 'where', 'show', 'get', 'list'],
  };

  for (const [intent, keywords] of Object.entries(intentKeywords)) {
    if (keywords.some((keyword) => lowerPrompt.includes(keyword))) {
      return intent as any;
    }
  }

  return 'other';
}

// Get Gemini API key from local storage
export function getGeminiApiKey(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('geminiApiKey');
}

// Save Gemini API key to local storage
export function setGeminiApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('geminiApiKey', key);
}

// Transform natural language prompt to ast-grep rule using Gemini
export async function transformPromptToAstGrepRule(
  prompt: string,
  fileTreeContext?: string
): Promise<AiTransformResult> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('Gemini API key not found. Please add your API key in settings.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const intent = classifyPromptIntent(prompt);

  const systemPrompt = `You are an expert at converting natural language queries into ast-grep patterns.
Generate ast-grep rules in YAML format that can search for relevant code structures.

For additions (e.g., new pages), also suggest file paths based on common codebase patterns.

${fileTreeContext ? `Current file tree context:\n${fileTreeContext}\n` : ''}

Examples:
Query: "find all async functions"
Output:
\`\`\`yaml
pattern: |
  async function $FUNC($$$ARGS) { $$$BODY }
languages: [javascript, typescript]
\`\`\`

Query: "add a new contact page"
Output:
\`\`\`yaml
pattern: |
  function ContactPage($$$ARGS) { $$$BODY }
languages: [javascript, typescript]
suggestedPaths:
  - src/pages/contact.tsx
  - src/routes/contact.tsx
\`\`\`

Now convert this query: "${prompt}"
Intent: ${intent}

Respond with ONLY the YAML rule, no additional explanation.`;

  try {
    const result = await model.generateContent(systemPrompt);
    const response = result.response.text();

    // Parse the YAML response
    const yamlMatch = response.match(/```yaml\n([\s\S]*?)```/);
    if (!yamlMatch) {
      throw new Error('Failed to extract YAML from AI response');
    }

    const yamlContent = yamlMatch[1];
    // Simple YAML parsing (in production, use a proper YAML parser)
    const lines = yamlContent.split('\n');
    const rule: AstGrepRule = { pattern: '' };
    const suggestedPaths: string[] = [];

    let currentSection = '';
    let inPattern = false;

    for (const line of lines) {
      if (line.startsWith('pattern:')) {
        inPattern = true;
        currentSection = 'pattern';
        if (line.includes('|')) continue; // Multi-line pattern
        rule.pattern = line.replace('pattern:', '').trim();
        inPattern = false;
      } else if (line.startsWith('languages:')) {
        currentSection = 'languages';
        const langs = line.replace('languages:', '').trim();
        rule.languages = langs
          .replace(/[\[\]]/g, '')
          .split(',')
          .map((l) => l.trim());
      } else if (line.startsWith('suggestedPaths:')) {
        currentSection = 'suggestedPaths';
      } else if (line.startsWith('  -') && currentSection === 'suggestedPaths') {
        suggestedPaths.push(line.replace('  -', '').trim());
      } else if (inPattern && line.startsWith('  ')) {
        rule.pattern += '\n' + line.substring(2); // Remove 2 spaces for indentation
      }
    }

    return {
      rule,
      suggestedPaths: suggestedPaths.length > 0 ? suggestedPaths : undefined,
      intent,
    };
  } catch (error) {
    console.error('Failed to transform prompt with AI:', error);
    throw error;
  }
}
