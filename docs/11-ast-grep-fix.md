# Plan: Align `ast-grep` Usage with Documentation

## 1. Issue Identification

A review of `src/routes/api/context.ts` and `scripts/generate-code-context.ts` reveals a significant discrepancy between the `ast-grep` implementation and the official API documentation in `docs/ast-grep.md`.

-   **Code Usage**: The implementation uses the `AstGrep` class and the `scan` method from `@ast-grep/napi` to perform a project-wide scan for code patterns based on rules in `.ast-grep/rules`.

-   **Documentation**: The `docs/ast-grep.md` file, which is the source of truth, **does not** document the `AstGrep` class or the `scan` method. It exclusively covers a low-level API for parsing and searching within a single source string (`parse`, `SgRoot`, `SgNode`, `findAll`).

**Conclusion**: The code is using an outdated and unsupported API. It must be refactored to align with the official documentation to ensure future compatibility and correctness.

## 2. Proposed Solution

The goal is to replace the unsupported project-level scanning with an implementation that uses only the documented single-file APIs. This requires manually traversing the file system, reading and parsing each file, and then applying the `ast-grep` rules. The refactoring will primarily affect `src/routes/api/context.ts`, with similar changes needed for `scripts/generate-code-context.ts`.

## 3. Refactoring and Improvement Plan

### Step 3.1: Add Necessary Dependencies

To manually traverse files and parse YAML rules, we will need to add new dependencies.

-   **Action**: Add `fast-glob` for efficient file system traversal and `js-yaml` for parsing rule files.
-   **Command**: `pnpm add fast-glob js-yaml && pnpm add -D @types/js-yaml`

### Step 3.2: Refactor `api/context.ts` for Correctness

The core of the work is to replace the body of the `GET` handler.

-   **Action**: Remove all usage of `new AstGrep()` and `sg.scan()`.
-   **Action**: Implement a new file-processing pipeline:
    1.  **Load Rules**: Read all `.yml` files from `.ast-grep/rules` and parse them using `js-yaml`. Store them in a list.
    2.  **Find Files**: Use `fast-glob` to get a list of all relevant source files in the project (e.g., `**/*.{ts,tsx,js,jsx}`). This should be configured to ignore `node_modules` and other non-source directories.
    3.  **Process Files in Stream**: For each file path in the list:
        -   Read its content.
        -   Determine the `Lang` from the file extension.
        -   Parse the content into an AST root: `const root = parse(lang, content).root()`.
        -   Iterate through the loaded rules and run `root.findAll(rule)` for each.
        -   For every match found, calculate its score and transform it into the `ContextItem` structure.
        -   `JSON.stringify` the item and push it into the response stream.
-   **Action**: Ensure error handling is robust and that the streaming response remains intact.

### Step 3.3: Refactor `scripts/generate-code-context.ts`

This script uses the same outdated logic and must be updated.

-   **Action**: Apply the same refactoring approach from `api/context.ts` to the `main` function in the script. The file traversal and rule-loading logic can be shared or duplicated.

### Step 3.4: Add Explanatory Comments

-   **Action**: Add comments to the new implementation in `api/context.ts` explaining the multi-step process: loading rules, finding files, and processing each one. A comment should also be preserved to explain the `+ 1` conversion for 0-indexed line numbers.

## 4. Summary of Tasks

1.  **Documentation**: Overwrite `docs/11-ast-grep-fix.md` with this plan.
2.  **Dependencies**: Add `fast-glob` and `js-yaml`.
3.  **Code Refactoring**:
    -   Rewrite the core logic in `src/routes/api/context.ts`.
    -   Rewrite the core logic in `scripts/generate-code-context.ts`.
4.  **Verification**: Test the `chat/$url` page to ensure the context generation still works as expected. 