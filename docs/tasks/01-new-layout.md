# Dashboard Layout Refactoring Plan

## Overview
Create two distinct layouts within the dashboard routes:
- **No-sidebar layout**: For the dashboard index page (`/dashboard`)
- **With-sidebar layout**: For dynamic URL pages (`/dashboard/$url`)

## Current State
- Both routes currently share a single layout defined in `(dashboard)/route.tsx`
- The sidebar and search input are always visible
- The index page doesn't need these elements

## Goal
- `/dashboard` → Clean, minimal layout without sidebar
- `/dashboard/$url` → Full layout with sidebar and search functionality

## Implementation Plan

### 1. Create Reusable Sidebar Layout Component
**File**: `src/components/layout/dashboard-sidebar-layout.tsx`

This component will encapsulate:
- `SidebarProvider`
- `AppSidebar`
- `SidebarInset`
- `SiteHeader`
- Search form with URL input
- Children slot for page content

### 2. Refactor Route Layout
**File**: `src/routes/(dashboard)/route.tsx`

Options:
- **Option A**: Strip down to minimal wrapper with just `<Outlet />`
- **Option B**: Remove file entirely if no shared logic is needed

### 3. Update Dynamic URL Route
**File**: `src/routes/(dashboard)/$url.tsx`

- Import `DashboardSidebarLayout`
- Wrap existing `ValidUrlContent` component with the layout
- Remove duplicate providers and search form logic
- Pass URL state to the layout's search form

### 4. Verify Index Route
**File**: `src/routes/(dashboard)/index.tsx`

- No changes needed to the component itself
- Will automatically render without sidebar once parent layout is simplified
- Maintains its clean, minimal appearance

## Technical Details

### Component Structure
```
DashboardSidebarLayout
├── SidebarProvider
│   ├── AppSidebar
│   └── SidebarInset
│       ├── SiteHeader
│       ├── SearchForm
│       └── {children}
```

### State Management
- Search form state moves to `DashboardSidebarLayout`
- URL navigation logic stays in the layout
- Child components receive data via props or context

### Import Aliases
- All imports must use `~` alias (resolves to `./src`)
- Example: `import { DashboardSidebarLayout } from '~/components/layout/dashboard-sidebar-layout'`

## Testing Plan

### Type Safety
```bash
pnpm lint
pnpm typecheck
```

### Unit Tests
```bash
pnpm test
```

### Manual QA Checklist
- [ ] Navigate to `/dashboard` → Should show plain dashboard without sidebar
- [ ] Navigate to `/dashboard/https%3A%2F%2Fgithub.com%2Fowner%2Frepo` → Should show sidebar layout
- [ ] Test search form submission → Should navigate to encoded URL
- [ ] Test browser back/forward → Should update search input
- [ ] Verify no layout flash on navigation

## Future Considerations

### Reusability
- Export `DashboardSidebarLayout` from `~/components/layout` index
- Other routes can import and use the same layout pattern

### Search Form Component
- Consider extracting search form to `~/components/search/url-search-form.tsx`
- Makes the layout component cleaner and more focused

### Layout Variants
- Could add props to `DashboardSidebarLayout` for customization:
  - `showSearch?: boolean`
  - `sidebarVariant?: 'inset' | 'floating'`
  - `compactHeader?: boolean`

## Migration Steps

1. Create layout component with all sidebar logic
2. Update `$url.tsx` to use new layout
3. Simplify or remove `route.tsx`
4. Test both routes thoroughly
5. Clean up any unused imports or dead code

## Benefits

- **Separation of Concerns**: Each route controls its own layout needs
- **Flexibility**: Easy to add more layout variants in the future
- **Performance**: Index page doesn't load unnecessary sidebar code
- **Maintainability**: Layout logic centralized in one component 