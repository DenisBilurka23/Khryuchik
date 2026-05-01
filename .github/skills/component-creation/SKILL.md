---
name: component-creation
description: 'Create or add React components in the Khryuchik project. Use when creating a new component, page-view, shared UI block, admin form section, barrel export, index.ts, types.ts, or optional CSS module that must follow the repository folder structure.'
argument-hint: 'Describe the component, where it belongs, and whether it is a leaf component or a multi-component feature folder.'
user-invocable: true
---

# Component Creation

Use this skill when adding a new component or restructuring an existing one inside `src/components`.

## Goal
- Follow the repository's folder-based component architecture.
- Prefer barrel exports where a folder exposes multiple components or types.
- Keep props and shared local types in a nearby `types.ts`.
- Add a CSS module only when the component has enough custom styling that `sx` alone would make the file noisy.

## Default Structure

For a leaf component, prefer this shape:

```text
src/components/component-name/
  index.tsx
  types.ts
  component-name.module.css    # only if needed
```

For a feature folder with several public pieces, prefer this shape:

```text
src/components/feature-name/
  index.ts
  types.ts
  primary-component/
    index.tsx
  secondary-component/
    index.tsx
```

## Rules
- Folder names should be kebab-case.
- Component exports should be named exports, not default exports, unless the surrounding route or framework boundary requires otherwise.
- If the folder exposes multiple public components, create a barrel `index.ts` that re-exports components and relevant types.
- If the folder exposes one leaf component, use `index.tsx` as the implementation entry point.
- Keep local props in `types.ts` when they are shared across files in the same component folder or when the component file would become noisy.
- Prefer a folder-based component path over a flat sibling file like `src/components/foo.tsx`.
- Do not create shadow files that conflict with an existing folder-based component.

## Styling Rules
- Start with MUI primitives and `sx` for straightforward styling.
- Add `component-name.module.css` only when the component has substantial custom layout, visual treatment, pseudo-selectors, or styles reused across the component tree.
- Keep the CSS module colocated with the component folder.
- Do not create a CSS file preemptively if the styles remain simple in `sx`.

## Barrel Rules
- If a folder groups several subcomponents, add a top-level `index.ts` that re-exports the public API.
- Re-export both components and public types from the barrel when the folder is meant to be imported from one path.
- Keep internal helpers or one-off implementation details unexported unless they are reused.

## Placement Guide
- Put page composition components in existing `*-page-view` folders when that pattern already exists nearby.
- Put shared auth/admin/account UI into the matching `*-shared` folder instead of duplicating it in a page folder.
- For complex admin forms, follow the existing split into `sections/`, field folders, and a root barrel.
- If a similar component already exists, mirror its folder structure and export style first.

## Procedure
1. Find the nearest existing component with the same role.
2. Decide whether this is a leaf component or a feature folder with multiple public parts.
3. Create a folder-based structure with `index.tsx` for a leaf component or `index.ts` for a multi-export folder.
4. Add `types.ts` when props or local contracts need to be shared or kept separate from rendering.
5. Add a CSS module only if custom styles are substantial enough to justify it.
6. If the folder has multiple exports, add the shared barrel re-exports immediately.
7. Validate imports so consuming code uses the folder entry point rather than deep ad hoc paths when the barrel is intended to be public.

## Good Local Patterns
- `src/components/product` is a feature folder with a shared barrel `index.ts` and a central `types.ts`.
- `src/components/cart` is a compact grouped component folder with barrel re-exports.
- `src/components/admin-product-form` is a larger feature folder that exposes multiple sections and field components through its barrel.

## Avoid
- Creating `src/components/Foo.tsx` when the repo already uses `src/components/foo/index.tsx`.
- Leaving public types scattered across component files when a nearby `types.ts` would make imports cleaner.
- Adding a CSS module for trivial styling that is already clear in MUI `sx`.
- Skipping the top-level barrel when a folder clearly exposes several public components.