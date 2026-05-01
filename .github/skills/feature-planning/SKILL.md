---
name: feature-planning
description: 'Plan new features and non-trivial extensions in the Khryuchik project. Use when a task needs architecture analysis, owning-layer discovery, file placement decisions, implementation sequencing, or a short execution plan before coding.'
argument-hint: 'Describe the feature, affected area, and any known constraints so the plan can map the work to the existing architecture.'
user-invocable: true
---

# Feature Planning

Use this skill before implementing a new feature or a non-trivial extension in the Khryuchik repository.

## Goal
- Map the request to the existing architecture before editing files.
- Identify the owning layer and the closest existing implementation pattern.
- Produce a short, concrete implementation plan with the smallest necessary change surface.
- Surface architecture risks early instead of discovering them mid-implementation.

## When To Use
- A task adds a new user-facing feature.
- A task changes behavior across multiple layers such as `src/app`, `src/components`, and `src/server`.
- A task needs new files or a new folder structure.
- A task is large enough that implementation order matters.
- A task could fit multiple architectural patterns and needs a deliberate choice.

## Planning Checks
- Identify the owning layer first: route entry, component composition, server logic, client API, utility, or shared types.
- Find the nearest existing implementation that already solves a similar problem.
- Decide whether the change belongs in an existing folder or needs a new folder.
- Call out which dictionaries, locale helpers, request-context functions, or admin/storefront boundaries are relevant.
- Note whether the task should load another skill after planning, such as `component-creation`.

## Output Format
Produce the plan in this shape before implementation:

```text
Analysis
- Existing pattern to follow
- Owning layer(s)
- Key constraints or risks

Plan
1. First implementation step
2. Second implementation step
3. Validation step
```

## Procedure
1. Read the nearest route, component, or service that already handles similar behavior.
2. Decide which layer owns the requested change.
3. Limit the scope to the smallest coherent implementation slice.
4. If new files are needed, state exactly where they belong and why.
5. If the task touches components, load `component-creation` after the plan and before generating files.
6. Only then proceed to implementation.

## Khryuchik-Specific Rules
- Keep admin work under `src/app/(admin)/admin` and storefront localized routing under `src/app/[lang]` or `src/app/(default)`.
- Keep server-only logic in `src/server` and avoid pushing request-bound or data-access logic into client components or page UI.
- Prefer existing folder-based component conventions in `src/components`.
- Prefer existing dictionary-driven copy patterns, especially for admin UI.

## Avoid
- Jumping straight into file creation before identifying the owning layer.
- Proposing broad refactors when a local change fits the current architecture.
- Creating new folders or abstractions without comparing the nearest existing pattern.
- Planning against a hypothetical architecture instead of the one already in the repository.