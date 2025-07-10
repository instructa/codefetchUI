"# Filter Update Plan

## Current Implementation Analysis
The `CodefetchFilters` component in `src/components/codefetch-filters.tsx` currently includes quick presets, an apply filters button, a current configuration summary, separate token settings, and display options with tree depth and line numbers.

## Goals
- Remove the quick presets section as they are not useful.
- Remove the apply filters button since the store syncs changes in realtime.
- Reorder display options to put tree depth first.
- Ensure hide/show line numbers uses a checkbox (already implemented).
- Remove the current configuration summary.
- Move token settings (max tokens, encoder, limiter) into display options, accessible via a gear icon since they are rarely used.

## High-Level Plan
1. **Remove Unnecessary Components:**
   - Delete the Quick Presets Card and related code.
   - Remove the Apply Filters button and its handler at the bottom.

2. **Reorder and Enhance Display Options:**
   - In the Display Options Card, ensure Project Tree Depth is the first item.
   - Confirm the Disable Line Numbers uses a checkbox.

3. **Integrate Token Settings:**
   - Move token-related settings into the Display Options Card.
   - Use a gear icon (DropdownMenu or similar) to house the token settings for rarer access.

4. **Remove Current Configuration:**
   - Delete the Current Configuration Card.

5. **Integration and Testing:**
   - Ensure realtime syncing works without the apply button.
   - Test the new UI layout for usability.
   - Update any dependent components if necessary.

6. **Edge Cases:**
   - Handle cases where no scraped data is available.
   - Ensure the gear icon submenu is intuitive and responsive.

## Tickable Task List
- [ ] Read and analyze current `src/components/codefetch-filters.tsx` implementation.
- [ ] Remove Quick Presets Card and applyPreset function.
- [ ] Remove Apply Filters button and its onClick handler.
- [ ] Remove Current Configuration Card.
- [ ] Reorder Display Options to have Project Tree Depth first.
- [ ] Confirm or implement checkbox for Disable Line Numbers.
- [ ] Move token settings (maxTokens, tokenEncoder, tokenLimiter) into Display Options Card behind a gear icon (use DropdownMenu).
- [ ] Update store interactions if needed for realtime updates.
- [ ] Test the component with sample data to ensure filters apply in realtime.
- [ ] Add comments in code documenting the changes.
- [ ] Commit changes and create a pull request." 