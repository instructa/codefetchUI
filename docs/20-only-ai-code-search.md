# Plan for Always Using AI in Code Search

## Background
Currently, the Code Search feature in `src/routes/chat/$url.tsx` handles queries differently:
- Natural language queries are transformed to ast-grep rules using AI (Gemini).
- Direct ast-grep syntax is used without AI.
- Vague queries have special handling, sometimes routing to file search.

The goal is to always involve AI in the search process, even for exact matches or direct syntax, while still using ast-grep (generated/enhanced by AI). Additionally, always use AI to build search context (e.g., file tree summaries, repo insights) to improve the quality of searches.

This change aims to make searches more intelligent and context-aware, potentially improving accuracy and handling edge cases better.

## Benefits
- Consistent AI enhancement for all queries.
- Better handling of complex searches by incorporating AI-generated context.
- Maintains the power of ast-grep but augments it with AI intelligence.
- Improved user experience with more relevant results.

## Potential Challenges
- Increased latency due to always calling AI.
- Higher API costs for Gemini usage.
- Need to handle AI failures gracefully.
- Ensuring direct syntax queries aren't altered unintentionally.

## Implementation Steps

### 1. Modify Query Handling in `handleCodeSearch`
- Remove the distinction between natural language and direct ast-grep syntax.
- Always route the query through AI transformation.
- For direct syntax: Pass the syntax to AI with instructions to use it as-is but enhance with context if possible.
- Update `isNaturalLanguagePrompt` to always return true, or remove the check.

Specific changes in `src/routes/chat/$url.tsx`:
```tsx
// ... existing code ...

// Remove or modify this check
const isNaturalLanguage = true; // Always use AI

// Always transform with AI
const result = await transformPromptToAstGrepRule(codeSearchQuery, fileTreeContext);

// Then search
await searchCode(JSON.stringify(result), url);
```

### 2. Enhance Context Building with AI
- Currently, `fileTreeContext` is statically generated.
- Introduce AI to build richer context:
  - Use Gemini to summarize repo structure, key files, patterns.
  - Generate insights like "main frameworks used", "test structure", etc.
- Create a new function `generateAiContext` that calls Gemini with repo data.

New function in `src/utils/ast-grep-ai.ts`:
```tsx
// ... existing code ...

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
```

- Call this in `handleCodeSearch` before transformation:
```tsx
const aiContext = await generateAiContext(scrapedData);
const result = await transformPromptToAstGrepRule(codeSearchQuery, aiContext);
```

### 3. Update AI Prompt for Transformation
- In `transformPromptToAstGrepRule`, update system prompt to handle direct syntax:
  - If query looks like ast-grep, use it directly but suggest improvements or context-based adjustments.
  - Always incorporate the AI-generated context.

Update system prompt:
```
... existing prompt ...

If the query is direct ast-grep syntax (e.g., contains $VAR or YAML), validate and use it, but enhance with the provided context if it improves relevance.
```

### 4. Handle Vague Queries
- Since we're always using AI, the AI can handle vague queries intelligently.
- Remove special vague query handling, let AI decide.

### 5. Error Handling and Fallbacks
- If AI fails, fallback to direct ast-grep if applicable, or basic file search.
- Add retry logic for AI calls.

### 6. UI Updates
- In `CodeSearchResults` component, add indicators for AI-enhanced searches.
- Show generated context or suggestions if relevant.

### 7. Testing
- Test with natural language: e.g., "find all async functions".
- Test with direct syntax: e.g., "async function $FUNC($$$ARGS) { $$$BODY }".
- Test vague: e.g., "i want to run tests".
- Verify AI context improves results (manual comparison).
- Performance testing for latency.

### 8. Deployment
- Update any related docs.
- Monitor API usage after deployment.

This plan ensures all searches benefit from AI, with ast-grep still at the core.