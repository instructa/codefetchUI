import { GoogleGenerativeAI } from '@google/generative-ai';
import * as yaml from 'js-yaml';
import { validateRule as validateAstGrepRule } from './pattern-guard';

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

// Validate ast-grep rule for common issues (implementation moved to pattern-guard.ts)

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

// Extract meaningful keywords from a query
export function extractKeywords(query: string): string[] {
  const lowerQuery = query.toLowerCase();

  // Remove common stop words and filter short words
  const stopWords = new Set([
    'the',
    'a',
    'an',
    'and',
    'or',
    'but',
    'in',
    'on',
    'at',
    'to',
    'for',
    'of',
    'with',
    'by',
    'from',
    'all',
    'find',
    'show',
    'where',
    'get',
    'list',
    'i',
    'want',
    'need',
    'would',
    'like',
    'please',
    'can',
    'you',
    'me',
    'my',
    'we',
    'our',
    'us',
  ]);

  // Extract words and filter
  const words = lowerQuery
    .replace(/[^a-z0-9\s]/g, ' ') // Remove special characters
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));

  // Prioritize code-specific terms
  const codeTerms = [
    'test',
    'spec',
    'component',
    'controller',
    'service',
    'api',
    'route',
    'model',
    'schema',
    'hook',
    'util',
    'helper',
    'function',
    'class',
    'interface',
    'type',
    'async',
    'await',
    'update',
    'prompt',
    'prompts',
    'cli',
    'command',
    'script',
    'config',
    'setting',
    'option',
  ];

  const prioritizedWords = words.filter((word) => codeTerms.includes(word));
  const otherWords = words.filter((word) => !codeTerms.includes(word));

  return [...prioritizedWords, ...otherWords];
}

// Create path-based fallback rule when AI fails
export function createPathBasedFallback(query: string): AstGrepRule {
  const keywords = extractKeywords(query);

  if (keywords.length === 0) {
    // If no keywords extracted, fall back to simple pattern search
    return createFallbackRule(query);
  }

  // For single keyword, just search for files containing it
  if (keywords.length === 1) {
    return {
      rule: {
        path: { regex: `.*${keywords[0]}.*\\.(ts|tsx|js|jsx)$` },
      },
      languages: ['javascript', 'typescript', 'jsx', 'tsx'],
    };
  }

  // For multiple keywords, create more specific patterns
  // Prioritize finding files that contain ALL keywords in the path
  const allKeywordsPattern = keywords.slice(0, 2).join('.*');

  const pathPatterns = [
    // Files containing all keywords in order
    { path: { regex: `.*${allKeywordsPattern}.*\\.(ts|tsx|js|jsx)$` } },
    // Files in directories matching first keyword
    { path: { regex: `.*/${keywords[0]}/.*\\.(ts|tsx|js|jsx)$` } },
  ];

  // Only add individual keyword patterns if we have very few matches
  if (keywords.length <= 2) {
    keywords.slice(0, 2).forEach((keyword) => {
      pathPatterns.push({ path: { regex: `.*${keyword}.*\\.(ts|tsx|js|jsx)$` } });
    });
  }

  return {
    rule: {
      any: pathPatterns,
    },
    languages: ['javascript', 'typescript', 'jsx', 'tsx'],
  };
}

// Find the best matching template for a query
export function findBestTemplate(query: string): RuleTemplate | null {
  const keywords = extractKeywords(query);
  const lowerQuery = query.toLowerCase();

  let bestMatch: { template: RuleTemplate; score: number } | null = null;

  for (const [key, template] of Object.entries(RULE_TEMPLATES)) {
    let score = 0;

    // Check how many template keywords match
    for (const templateKeyword of template.keywords) {
      if (lowerQuery.includes(templateKeyword)) {
        score += 2; // Exact match in query
      } else if (keywords.includes(templateKeyword)) {
        score += 1; // Keyword match
      }
    }

    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { template, score };
    }
  }

  return bestMatch ? bestMatch.template : null;
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
  prompts: {
    keywords: ['prompt', 'prompts', 'cli', 'command', 'terminal', 'console'],
    rule: {
      rule: {
        any: [
          { path: { regex: '.*(prompt|cli|command).*\\.(ts|tsx|js|jsx)$' } },
          { path: { regex: '.*/cli/.*' } },
          { path: { regex: '.*/prompts?/.*' } },
          { pattern: 'prompt($$$)' },
          { pattern: 'console.log($$$)' },
        ],
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

export async function generateAiContext(scrapedData: any): Promise<string> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) throw new Error('Gemini API key required');

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const rawTree = JSON.stringify(scrapedData.root, null, 2).slice(0, 10000); // Limit size

  const prompt = `Summarize this repo file tree for code search context. Include top directories, common patterns, test locations, main languages, frameworks detected. Be concise.

File tree: ${rawTree}`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

// Check if a rule type is supported in current implementation
export function isRuleTypeSupported(rule: any, supportedTypes: string[]): boolean {
  if (!rule || typeof rule !== 'object') return false;

  const ruleKeys = Object.keys(rule);

  // Check if all keys are in supported types
  for (const key of ruleKeys) {
    if (!supportedTypes.includes(key)) {
      // Special handling for nested rules
      if (key === 'any' || key === 'all') {
        const nestedRules = Array.isArray(rule[key]) ? rule[key] : [rule[key]];
        for (const nestedRule of nestedRules) {
          if (!isRuleTypeSupported(nestedRule, supportedTypes)) {
            return false;
          }
        }
      } else {
        return false;
      }
    }
  }

  return true;
}

// Validate rule complexity to ensure ast-grep can handle it
export function validateRuleComplexity(rule: AstGrepRule): { valid: boolean; error?: string } {
  // Phase 1: Support simple rules and common combinations
  const supportedRuleTypes = ['pattern', 'kind', 'path', 'any', 'all'];

  if ('rule' in rule) {
    // Complex rule - check if it's supported
    if (!isRuleTypeSupported(rule.rule, supportedRuleTypes)) {
      return {
        valid: false,
        error: 'Rule contains unsupported features. Supported: pattern, kind, path, any, all',
      };
    }

    // Check nesting depth (max 2 levels for now)
    const checkDepth = (r: any, depth: number = 0): boolean => {
      if (depth > 2) return false;

      if (r.any || r.all) {
        const rules = Array.isArray(r.any || r.all) ? r.any || r.all : [r.any || r.all];
        for (const nestedRule of rules) {
          if (!checkDepth(nestedRule, depth + 1)) return false;
        }
      }

      return true;
    };

    if (!checkDepth(rule.rule)) {
      return { valid: false, error: 'Rule nesting is too deep (max 2 levels)' };
    }
  }

  return { valid: true };
}

// Transforms a natural language prompt into an ast-grep rule using templates or Gemini AI, with added validation and fallback for AI-generated rules
export async function transformPromptToAstGrepRule(
  prompt: string,
  fileTreeContext?: string
): Promise<AiTransformResult> {
  const intent = classifyPromptIntent(prompt);

  // Progressive fallback strategy:
  // 1. First check if we have a matching template
  const template = findBestTemplate(prompt);
  if (template) {
    console.log('Using template for query:', prompt);
    return {
      rule: template.rule,
      intent,
    };
  }

  // 2. Try AI transformation
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    // If no API key, use path-based fallback
    console.log('No API key, using path-based fallback');
    return {
      rule: createPathBasedFallback(prompt),
      intent,
    };
  }

  if (!isValidGeminiApiKey(apiKey)) {
    throw new Error('Invalid Gemini API key format. Please check your API key.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const systemPrompt = `You are an expert at converting natural language queries into ast-grep patterns.
Generate ast-grep rules in YAML format that can search for relevant code structures.

CRITICAL RULES:
1. NEVER include newlines (\\n) in patterns - use single-line patterns only
2. For multi-line patterns, use metavariables like $$$BODY to match blocks
3. Ensure all patterns are valid and parsable
4. For searching directories/files, use path-based rules instead of code patterns
5. Test your output for proper YAML syntax
6. CRITICAL: All metavariables SHOULD be uppercase, using only letters and underscores (e.g., $MY_VARIABLE, not $myVariable). However, lowercase will be automatically converted to uppercase.
7. KEEP RULES SIMPLE - avoid complex nested structures. Use 'any' or 'all' sparingly.
8. PREFER pattern-based rules over complex rule structures when possible.
9. NEVER use $$$ANY or $$$ alone - they must be part of a valid pattern like function($$$) or [$$$]
10. For vague queries, prefer path-based searches over broad pattern matches

SUPPORTED RULE TYPES (use only these):
- pattern: for matching code patterns
- kind: for matching AST node types
- path: for matching file paths with regex
- any: for combining multiple rules (use sparingly)
- all: for requiring multiple conditions (use sparingly)

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

Query: "find React components"
Output:
\`\`\`yaml
pattern: function $COMPONENT($$$) { return $$$JSX }
languages: [javascript, typescript, jsx, tsx]
\`\`\`

Query: "find API endpoints"
Output:
\`\`\`yaml
pattern: app.$METHOD($$$)
languages: [javascript, typescript]
\`\`\`

Query: "update prompts" or "find prompts in cli"
Output:
\`\`\`yaml
rule:
  path:
    regex: ".*(prompt|cli).*"
languages: [javascript, typescript]
\`\`\`

IMPORTANT: 
- Patterns must be on a single line. Use metavariables for complex matches.
- Avoid using complex nested rules unless absolutely necessary.
- For file/folder searches, use path rules instead of pattern matching.
- When query is vague or unclear, use path-based search with keywords from the query

BAD (too complex):
\`\`\`yaml
rule:
  all:
    - pattern: function $FUNC($$$)
    - inside:
        kind: class_declaration
    - has:
        pattern: async
\`\`\`

BAD (invalid pattern):
\`\`\`yaml
pattern: $$$ANY
\`\`\`

GOOD (simple):
\`\`\`yaml
pattern: async function $FUNC($$$) { $$$BODY }
\`\`\`

GOOD (path-based for vague queries):
\`\`\`yaml
rule:
  path:
    regex: ".*(keyword1|keyword2).*"
\`\`\`

If the query is direct ast-grep syntax (e.g., contains $VAR or YAML), validate and use it, but enhance with the provided context if it improves relevance.

Now convert this query: "${prompt}"
Intent: ${intent}

Respond with ONLY the YAML rule, no additional explanation.`;

  try {
    const result = await model.generateContent(systemPrompt);
    const response = result.response.text();

    // Parse the YAML response
    const yamlMatch = response.match(/```yaml\n([\s\S]*?)```/);
    if (!yamlMatch) {
      console.warn('Failed to extract YAML from AI response, using path-based fallback');
      return {
        rule: createPathBasedFallback(prompt),
        intent,
      };
    }

    const yamlContent = yamlMatch[1];

    // Use proper YAML parser instead of manual parsing
    let parsedYaml: any;
    try {
      parsedYaml = yaml.load(yamlContent) as {
        rule?: any;
        pattern?: string;
        kind?: string;
        languages?: string[];
        suggestedPaths?: string[];
      };
    } catch (yamlError) {
      console.error('Failed to parse YAML:', yamlError);
      // Use path-based fallback for YAML parse errors
      return {
        rule: createPathBasedFallback(prompt),
        intent,
      };
    }

    let rule: AstGrepRule;

    // Ensure languages is always defined with a default
    const languages = parsedYaml.languages || ['javascript', 'typescript'];

    // Handle complex rule structure
    if (parsedYaml.rule) {
      rule = {
        rule: parsedYaml.rule,
        languages,
      };
    }
    // Handle simple pattern rule
    else if (parsedYaml.pattern) {
      rule = {
        pattern: parsedYaml.pattern,
        languages,
      };
      if (parsedYaml.kind) {
        rule.kind = parsedYaml.kind;
      }
    }
    // Handle kind-only rule
    else if (parsedYaml.kind) {
      rule = {
        kind: parsedYaml.kind,
        pattern: '', // Add empty pattern to satisfy SimpleRule type
        languages,
      };
    } else {
      console.warn(
        'Invalid YAML structure: no rule, pattern, or kind field. Using path-based fallback'
      );
      return {
        rule: createPathBasedFallback(prompt),
        intent,
      };
    }

    const suggestedPaths = parsedYaml.suggestedPaths;

    // Validate the generated rule (which also transforms lowercase metavariables)
    const validation = validateAstGrepRule(rule);
    if (!validation.valid) {
      console.warn(`AI-generated rule invalid: ${validation.error}. Trying path-based fallback.`);

      // Try path-based fallback first
      const pathFallback = createPathBasedFallback(prompt);

      // If path fallback looks too generic, try template matching again with relaxed criteria
      const relaxedTemplate = findMatchingTemplate(prompt);
      if (relaxedTemplate) {
        return {
          rule: relaxedTemplate.rule,
          intent,
        };
      }

      return {
        rule: pathFallback,
        intent,
      };
    }

    // Validate rule complexity
    const complexityValidation = validateRuleComplexity(rule);
    if (!complexityValidation.valid) {
      console.warn(
        `AI-generated rule too complex: ${complexityValidation.error}. Using simpler fallback.`
      );

      // Try to find a simpler alternative
      const pathFallback = createPathBasedFallback(prompt);

      return {
        rule: pathFallback,
        intent,
      };
    }

    return {
      rule,
      suggestedPaths: suggestedPaths && suggestedPaths.length > 0 ? suggestedPaths : undefined,
      intent,
    };
  } catch (error) {
    console.error('Failed to transform prompt with AI:', error);

    // Final fallback: path-based search
    return {
      rule: createPathBasedFallback(prompt),
      intent,
    };
  }
}
