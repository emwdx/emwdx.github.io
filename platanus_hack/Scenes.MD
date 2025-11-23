# Scene Schema (Adventure360)

Purpose: Keep scenes consistent for rendering, compass alignment, asset naming, and future TTS.

## Cardinal / Compass Convention
- Heading 0° = East is “forward” in viewer (matches current renderer yaw baseline).
- Positive yaw rotates left-to-right (drag left moves view left, camera pans right).
- Prompts should describe objects using cardinal directions based on this convention.
  - Example: “Window to the north”, “Doorway to the west”.

## Scene Object
```jsonc
{
  "id": "kebab-case-unique-id",
  "title": "Readable title",
  "description": "Player-facing text",
  "image_prompt": "Stable/Gen prompt; must reference compass directions per convention",
  "videoUrl": "https://.../scene.pano.mp4",      // optional; overrides image if present
  "actions": [ ActionRef... ],                    // see Actions.MD
  "meta": {
    "compass_zero_deg": 90,                       // 90 means East is forward; override if source asset is rotated
    "notes": "Optional editor notes"
  },
  "kind": "base | overlay"                        // overlay = close-up; not in primary navigation
}
```

### Required
- `id` (kebab-case, unique)
- `title`
- `description`
- `image_prompt` (should mention compass-relative placement)

### Derived (not stored per scene)
- `imageUrl` = `{assetBase}/{id}.pano.{ext}`
- Optional future: `audioUrl` = `{assetBase}/{id}.tts.mp3`
- Overlays: same naming convention; use `kind: "overlay"` and pair with `Action.overlayScene`.

### Validation Guidelines
- `id` kebab-case; unique
- `image_prompt` non-empty
- `videoUrl` empty or ends with `.mp4`
- Actions’ `successor` must reference existing scene (for `move` type) or be blank for local actions.
- Optional `compass_zero_deg` lets you re-align assets if the pano was rendered with a different forward direction.

### Prompt Template (recommended)
```
Equirectangular 360° panorama, consistent series style.
<scene.image_prompt>  // include compass-based placement
<global_style>
```

### Asset Expectations
- Panos must be 2:1 equirectangular.
- Video: H.264 MP4, 2:1 equirectangular, muted/playsInline for mobile.

### Overlays / Close-ups
- Mark close-ups as `kind: "overlay"`; they reuse the same asset naming.
- Open via `Action.type="look"` + `overlayScene:"overlay-id"`.
- Overlays do not change the base `current` scene unless an action also sets `successor`.
- Each overlay should include at least one action that either:
  - Closes the overlay (`closeOverlayOnSuccess:true`), or
  - Moves to another scene (sets `successor`), or
  - Performs an interaction that gives/toggles state (see Actions/State).

## Generation Checklist (for agents)
- Ensure every base scene:
  - Has ≥1 outbound move action.
  - Commands are lowercase, compass-aligned (east is forward).
  - Prompt mentions cardinal placement of key objects.
  - start scene is reachable.
- Overlays:
  - Use `kind:"overlay"`.
  - `image_prompt` describes the close-up target.
  - Have at least one actionable button (e.g., close, interact).
- Asset names derived from ids (`{id}.pano.{ext}` / optional `.mp4`).
