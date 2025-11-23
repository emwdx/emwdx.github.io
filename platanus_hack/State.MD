# State Schema (Adventure360)

Purpose: Track player progress, current/overlay context, and inventory consistently across UI, prompts, and future TTS.

```jsonc
{
  "current": "scene-id",         // active base scene
  "overlay": "overlay-id|null",  // optional close-up scene open over base
  "inventory": ["item-id", ...]  // simple string ids; deduped
}
```

## Rules
- `current` must point to a base scene.
- `overlay` points to an overlay scene when open; UI shows close-up.
- `inventory` is append-only per `givesItem` actions (deduped). Future: allow remove/spend flags.

## Behavior
- Opening a `look` action with `overlayScene` sets `overlay`.
- `closeOverlayOnSuccess` or scene transitions clear `overlay`.
- `interact` actions may add items via `givesItem`.
- Navigation (`move`) closes overlays unless explicitly reopened.

## Persistence
- Stored in `localStorage` under `adv360_state_v1`.
- Saved on every state change (scene switch, overlay open/close, inventory change).

## Extensions (future)
- `flags`: keyed booleans for puzzle state.
- `visited`: set of scene ids for traversal logic.
- `journal`: ordered log for TTS/narration.

## Generation Checklist (for agents)
- Initialize state with:
  - `current = startSceneId`
  - `overlay = null`
  - `inventory = []`
- When creating overlays, ensure an action exists that will clear `overlay` (close, move, or interact with `closeOverlayOnSuccess:true`).
- When adding loot actions, ensure `givesItem` is unique and meaningful; consider matching item ids to narrative nouns.
