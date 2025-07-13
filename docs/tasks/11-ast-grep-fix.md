# Plan: Evolving `ast-grep` for Interactive Code Search

## 1. Vision

This plan outlines a two-phase approach to evolve our use of `ast-grep`.
1.  **Phase 1: Foundational Refactoring.** Correct the existing implementation to align with `ast-grep`'s documented API, ensuring stability and correctness.
2.  **Phase 2: Interactive Feature Implementation.** Build a new feature that allows users to perform code searches using natural language prompts, which will be translated into `ast-grep` rules on the fly.

## 2. Phase 1: Foundational Refactoring

### 2.1. Issue Identification

The current usage of `ast-grep` in `src/routes/api/context.ts` and `scripts/generate-code-context.ts` relies on an undocumented and outdated `scan` method. This must be replaced with the official single-file processing API to ensure future compatibility.

### 2.2. Refactoring Plan

-   **Step 2.2.1: Add Dependencies**:
    -   **Action**: Add `fast-glob` for file system traversal and `js-yaml` for parsing rule files.
    -   **Command**: `pnpm add fast-glob js-yaml && pnpm add -D @types/js-yaml`

-   **Step 2.2.2: Refactor `api/context.ts` and `scripts/generate-code-context.ts`**:
    -   **Action**: Remove all usage of `new AstGrep()` and `sg.scan()`.
    -   **Action**: Implement a new file-processing pipeline:
        1.  **Load Rules**: Read all `.yml` files from `.ast-grep/rules` using `fs` and parse them with `js-yaml`.
        2.  **Find Files**: Use `fast-glob` to get a list of source files, ignoring `node_modules`.
        3.  **Process Files**: For each file, read its content, parse it with `ast-grep`, and run all loaded rules against it.
        4.  **Stream Results**: Stream found matches as `ContextItem` objects.

## 3. Phase 2: Interactive `ast-grep` via Chat

### 3.1. Goal

To create a new interactive experience where a user can type a prompt (e.g., "find all async functions") into the chat, and the system will use an LLM to generate an `ast-grep` rule and return the relevant code snippets from the entire repository.

### 3.2. Backend Implementation Plan

-   **Step 3.2.1: Create a New API Endpoint**:
    -   **File**: `src/routes/api/interactive-grep.ts`
    -   **Method**: `POST`
    -   **Request Body**: `{ "prompt": "user's natural language query" }`
    -   **Response**: A streaming response of `ContextItem` JSON objects.

-   **Step 3.2.2: Implement Prompt-to-Rule Translation**:
    -   **Action**: Within the `interactive-grep` endpoint, call an LLM API (e.g., Anthropic, OpenAI).
    -   **Action**: Design a "few-shot" prompt for the LLM, providing examples of user queries and their corresponding `ast-grep` YAML rules. This will guide the LLM to produce valid output.
    -   **Action**: Parse the LLM's YAML response to get the `ast-grep` rule object. Add robust error handling for invalid LLM output.

-   **Step 3.2.3: Implement Dynamic File Scanning**:
    -   **Action**: Use the same `fast-glob` and file-reading logic from the Phase 1 refactoring.
    -   **Action**: Instead of using pre-defined rules, apply the single, dynamically generated rule from the LLM to each file.
    -   **Action**: Stream the results back to the client in the same `ContextItem` format.

### 3.3. Frontend Implementation Plan

-   **Step 3.3.1: Update Chat Component**:
    -   **File**: `src/routes/chat/index.tsx` (or the relevant chat component).
    -   **Action**: Add UI elements or logic (e.g., a special command like `/find` or a toggle button) to distinguish between a regular chat prompt and an interactive code search prompt.

-   **Step 3.3.2: Connect Frontend to New Endpoint**:
    -   **Action**: When a user submits a code search prompt, make a `POST` request to `/api/interactive-grep`.
    -   **Action**: Handle the streaming response from the API. As `ContextItem` objects arrive, render them in a user-friendly way (e.g., as a list of file paths with collapsible code snippets). This will likely require a new component to display the search results.

## 4. Summary of Tasks

1.  **Documentation**: Overwrite `docs/11-ast-grep-fix.md` with this new, comprehensive plan.
2.  **Dependencies**: Add `fast-glob` and `js-yaml`.
3.  **Refactoring (Phase 1)**:
    -   Rewrite the core logic in `src/routes/api/context.ts`.
    -   Rewrite the core logic in `scripts/generate-code-context.ts`.
4.  **Backend Feature (Phase 2)**:
    -   Create the `src/routes/api/interactive-grep.ts` endpoint.
    -   Implement the LLM-based prompt-to-rule translation.
5.  **Frontend Feature (Phase 2)**:
    -   Update the chat UI to trigger code searches.
    -   Implement result display for the `interactive-grep` stream.
6.  **Verification**: Test both the original context generation and the new interactive search feature to ensure they work as expected. 