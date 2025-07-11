import { GoogleGenerativeAI } from '@google/generative-ai';

// Types for ast-grep AI functionality
// Update the AstGrepRule interface to a union type for better handling of simple and complex rules
export type SimpleRule = {
  pattern: string;
  languages?: string[];
  kind?: string;
};

export type ComplexRule = {
  rule: Record<string, any>;
  languages?: string[];
};

export type AstGrepRule = SimpleRule | ComplexRule;

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

  // If it contains ast-grep syntax, it's not natural language
  if (astGrepPatterns.some((pattern) => pattern.test(prompt))) {
    return false;
  }

  // Check if it's a vague query without code-specific terms
  const codeSpecificTerms = [
    'function',
    'class',
    'method',
    'variable',
    'import',
    'export',
    'async',
    'await',
    'promise',
    'callback',
    'component',
    'hook',
    'test',
    'spec',
    'describe',
    'it',
    'expect',
    'mock',
    'interface',
    'type',
    'enum',
    'const',
    'let',
    'var',
    'return',
    'if',
    'else',
    'for',
    'while',
    'switch',
    'try',
    'catch',
    'throw',
    'error',
    'api',
    'route',
    'file',
    'folder',
    'directory',
    'module',
    'package',
  ];

  const lowerPrompt = prompt.toLowerCase();
  const hasCodeTerms = codeSpecificTerms.some((term) => lowerPrompt.includes(term));

  // If it's too vague (no code terms), it might need special handling
  return hasCodeTerms || prompt.length > 20;
}

// Check if query is too vague for AI transformation
export function isVagueQuery(prompt: string): boolean {
  const lowerPrompt = prompt.toLowerCase();

  // List of vague phrases that often cause issues
  const vaguePatterns = [
    /^i want to\s/,
    /^i need to\s/,
    /^how to\s/,
    /^show me\s/,
    /^can you\s/,
    /^find\s+/,
    /^search for\s+/,
    /^where\s+/,
    /^locate\s+/,
  ];

  // Check if it starts with a vague pattern but lacks specific code context
  const startsVague = vaguePatterns.some((pattern) => pattern.test(lowerPrompt));

  const codeSpecificTerms = [
    'function',
    'class',
    'test',
    'component',
    'file',
    'folder',
    'async',
    'api',
    'route',
    'import',
    'export',
    'variable',
  ];

  const hasSpecificTerms = codeSpecificTerms.some((term) => lowerPrompt.includes(term));

  return startsVague && !hasSpecificTerms;
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

// Add validation function for Gemini API key format after setGeminiApiKey
// Validates if the provided key matches the expected Gemini API key format
export function isValidGeminiApiKey(key: string): boolean {
  return /^AIza[0-9A-Za-z_-]{35}$/.test(key);
}

// Validate ast-grep rule for common issues
export function validateAstGrepRule(rule: AstGrepRule): { valid: boolean; error?: string } {
  if ('rule' in rule) {
    // Complex rules from templates are assumed valid
    return { valid: true };
  }

  // Check for simple rules
  if (!('pattern' in rule) && !('kind' in rule)) {
    return { valid: false, error: 'Rule must have either a pattern or kind field' };
  }

  // Check for newlines in pattern (common cause of MultipleNode errors)
  if (rule.pattern && rule.pattern.includes('\n')) {
    return {
      valid: false,
      error: 'Pattern contains newlines. Use single-line patterns with metavariables instead.',
    };
  }

  // Check for unbalanced braces/parentheses
  if (rule.pattern) {
    const openBraces = (rule.pattern.match(/\{/g) || []).length;
    const closeBraces = (rule.pattern.match(/\}/g) || []).length;
    const openParens = (rule.pattern.match(/\(/g) || []).length;
    const closeParens = (rule.pattern.match(/\)/g) || []).length;

    if (openBraces !== closeBraces) {
      return { valid: false, error: 'Unbalanced braces in pattern' };
    }
    if (openParens !== closeParens) {
      return { valid: false, error: 'Unbalanced parentheses in pattern' };
    }
  }

  // Check for valid metavariables
  if (rule.pattern) {
    const metavarPattern = /\$[A-Z_]+|\$\$\$/g;
    const metavars = rule.pattern.match(metavarPattern) || [];

    // Check for incomplete metavariables
    const incompleteMetavar = /\$[^A-Z_$]/;
    if (incompleteMetavar.test(rule.pattern)) {
      return { valid: false, error: 'Invalid metavariable syntax' };
    }
  }

  return { valid: true };
}

// Create a fallback rule for common queries
export function createFallbackRule(prompt: string): AstGrepRule {
  const lowerPrompt = prompt.toLowerCase();

  // Directory/file-based searches
  if (lowerPrompt.includes('test') || lowerPrompt.includes('spec')) {
    return {
      pattern: 'test($$$)',
      languages: ['javascript', 'typescript'],
    };
  }

  if (lowerPrompt.includes('component')) {
    return {
      pattern: 'function $COMPONENT($$$) { $$$BODY }',
      languages: ['javascript', 'typescript', 'jsx', 'tsx'],
    };
  }

  if (lowerPrompt.includes('async') || lowerPrompt.includes('await')) {
    return {
      pattern: 'async function $FUNC($$$) { $$$BODY }',
      languages: ['javascript', 'typescript'],
    };
  }

  // Default: search for the most relevant keyword
  const keywords = prompt.split(' ').filter((word) => word.length > 3);
  const keyword = keywords[0] || 'function';

  return {
    pattern: keyword,
    languages: ['javascript', 'typescript'],
  };
}

// Directory-focused rule templates for common queries
interface RuleTemplate {
  keywords: string[];
  rule: any; // Using any since ast-grep rules can have various structures
}

export const RULE_TEMPLATES: Record<string, RuleTemplate> = {
  tests: {
    keywords: ['test', 'tests', 'testing', 'spec', 'specs', 'jest', 'vitest', 'mocha'],
    rule: {
      rule: {
        any: [
          { path: { regex: '.*(test|spec|__test__).*' } },
          { kind: 'call_expression', pattern: 'test($$$)' },
          { kind: 'call_expression', pattern: 'describe($$$)' },
          { kind: 'call_expression', pattern: 'it($$$)' },
        ],
      },
      languages: ['javascript', 'typescript'],
    },
  },
  components: {
    keywords: ['component', 'components', 'ui', 'widget'],
    rule: {
      rule: {
        any: [
          { path: { regex: '.*/components?/.*' } },
          { pattern: 'function $COMPONENT($$$) { return $$$JSX }' },
          { pattern: 'const $COMPONENT = ($$$) => { return $$$JSX }' },
        ],
      },
      languages: ['javascript', 'typescript', 'jsx', 'tsx'],
    },
  },
  api: {
    keywords: ['api', 'endpoint', 'route', 'routes', 'controller'],
    rule: {
      rule: {
        any: [
          { path: { regex: '.*/api/.*' } },
          { path: { regex: '.*/routes?/.*' } },
          { pattern: 'app.$METHOD($$$)' },
          { pattern: 'router.$METHOD($$$)' },
        ],
      },
      languages: ['javascript', 'typescript'],
    },
  },
  hooks: {
    keywords: ['hook', 'hooks', 'use'],
    rule: {
      rule: {
        any: [
          { path: { regex: '.*/hooks?/.*' } },
          { pattern: 'function use$HOOK($$$) { $$$BODY }' },
          { pattern: 'const use$HOOK = ($$$) => { $$$BODY }' },
        ],
      },
      languages: ['javascript', 'typescript', 'jsx', 'tsx'],
    },
  },
  services: {
    keywords: ['service', 'services', 'helper', 'util', 'utils'],
    rule: {
      rule: {
        any: [
          { path: { regex: '.*/services?/.*' } },
          { path: { regex: '.*/utils?/.*' } },
          { path: { regex: '.*/helpers?/.*' } },
        ],
      },
      languages: ['javascript', 'typescript'],
    },
  },
  layouts: {
    keywords: ['layout', 'layouts', 'template', 'templates'],
    rule: {
      rule: {
        any: [
          { path: { regex: '.*/layouts?/.*' } },
          { pattern: 'function Layout($$$) { $$$BODY }' },
          { pattern: 'const Layout = ($$$) => { return $$$JSX }' },
        ],
      },
      languages: ['javascript', 'typescript', 'jsx', 'tsx'],
    },
  },
  pages: {
    keywords: ['page', 'pages', 'screen', 'view'],
    rule: {
      rule: {
        any: [
          { path: { regex: '.*/pages?/.*' } },
          { pattern: 'function $PAGE($$$) { return $$$JSX }' },
          { pattern: 'const $PAGE = ($$$) => { return $$$JSX }' },
        ],
      },
      languages: ['javascript', 'typescript', 'jsx', 'tsx'],
    },
  },
  models: {
    keywords: ['model', 'models', 'schema', 'db', 'database', 'table'],
    rule: {
      rule: {
        any: [{ path: { regex: '.*/models?/.*' } }, { path: { regex: '.*/schema/.*' } }],
      },
      languages: ['javascript', 'typescript'],
    },
  },
};

// Check if query matches a template
export function findMatchingTemplate(prompt: string): RuleTemplate | null {
  const lowerPrompt = prompt.toLowerCase();

  for (const [key, template] of Object.entries(RULE_TEMPLATES)) {
    if (template.keywords.some((keyword) => lowerPrompt.includes(keyword))) {
      return template;
    }
  }

  return null;
}

// Transforms a natural language prompt into an ast-grep rule using templates or Gemini AI, with added validation and fallback for AI-generated rules
export async function transformPromptToAstGrepRule(
  prompt: string,
  fileTreeContext?: string
): Promise<AiTransformResult> {
  // First check if we have a matching template
  const template = findMatchingTemplate(prompt);
  if (template) {
    console.log('Using template for query:', prompt);
    return {
      rule: template.rule,
      intent: classifyPromptIntent(prompt),
    };
  }

  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('Gemini API key not found. Please add your API key in settings.');
  }
  if (!isValidGeminiApiKey(apiKey)) {
    throw new Error('Invalid Gemini API key format. Please check your API key.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const intent = classifyPromptIntent(prompt);

  const systemPrompt = `You are an expert at converting natural language queries into ast-grep patterns.
Generate ast-grep rules in YAML format that can search for relevant code structures.

CRITICAL RULES:
1. NEVER include newlines (\\n) in patterns - use single-line patterns only
2. For multi-line patterns, use metavariables like $$$BODY to match blocks
3. Ensure all patterns are valid and parsable
4. For searching directories/files, use path-based rules instead of code patterns
5. Test your output for proper YAML syntax

${fileTreeContext ? `Current file tree context:\n${fileTreeContext}\n` : ''}

Examples:
Query: "find all async functions"
Output:
\`\`\`yaml
pattern: async function $FUNC($$$ARGS) { $$$BODY }
languages: [javascript, typescript]
\`\`\`

Query: "find test functions" or "i want to run tests"
Output:
\`\`\`yaml
rule:
  kind: call_expression
  pattern: test($$$)
languages: [javascript, typescript]
\`\`\`

Query: "find test folders" or "where are the tests"
Output:
\`\`\`yaml
rule:
  path:
    regex: ".*(test|spec|__test__).*"
languages: [javascript, typescript]
\`\`\`

Query: "add a new contact page"
Output:
\`\`\`yaml
pattern: function ContactPage($$$ARGS) { $$$BODY }
languages: [javascript, typescript]
suggestedPaths:
  - src/pages/contact.tsx
  - src/routes/contact.tsx
\`\`\`

IMPORTANT: Patterns must be on a single line. Use metavariables for complex matches.
BAD: pattern: |
  test($$$ARGS) {
    $$$BODY
  }
GOOD: pattern: test($$$ARGS) { $$$BODY }

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

    // Validate the generated rule
    const validation = validateAstGrepRule(rule);
    if (!validation.valid) {
      console.warn(`AI-generated rule invalid: ${validation.error}. Using fallback.`);
      return {
        rule: createFallbackRule(prompt),
        intent,
      };
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
