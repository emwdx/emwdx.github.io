# Action Schema (Adventure360)

Purpose: Differentiate navigation vs. examination vs. interaction so UI, prompts, and future TTS behave consistently.

## Action Types
- `move`    : Changes scene (requires `successor`)
- `look`    : Adds descriptive text / prompt context; stays in scene
- `interact`: Performs an interaction; may stay or transition depending on `successor`
    - Can award inventory (`givesItem`) or toggle flags (future).

## Action Object
```jsonc
{
  "type": "move | look | interact",
  "cmd": "north",                    // lowercase command text (parser match)
  "label": "Go north",               // UI label
  "successor": "kitchen",            // required for move; optional for others
  "overlayScene": "kitchen-sink",    // for look actions; opens close-up overlay
  "givesItem": "banana",             // optional inventory item to add
  "closeOverlayOnSuccess": true,     // optional: closes overlay after action
  "description": "TTS/feedback text",
  "prompt_note": "Optional modifier for image gen context"
}
```

### Rules
- `cmd` lowercase, trimmed; unique per scene.
- `type=move` → `successor` required and must exist.
- `type=look` → `successor` empty (stay put); may specify `overlayScene`.
- `type=interact` → `successor` optional (stay or branch); may give items.
- `label` defaults to `cmd` if empty.
- `prompt_note` can hint at what the player is focusing on (for image gen or narration).
- `overlayScene` must reference a scene (typically `kind: "overlay"`).
- `givesItem` adds to inventory; deduped by id string.
- Use lowercase `cmd` values and avoid spaces at ends.

### Directional Consistency (ties to Scenes.MD)
- Use cardinal cmds for movement: `north`, `south`, `east`, `west`, `northeast`, `northwest`, `southeast`, `southwest`, `up`, `down`.
- Map these to the compass convention: forward (0° heading) = East. Movement `north` means turn 90° left from forward and move that way in-scene.

## Generation Checklist (for agents)
- For each base scene:
  - Add move actions covering exits; cmds lowercase, compass-based.
  - Add at least one look/interact if objects are described in the prompt.
- For overlays:
  - Triggered via `look` with `overlayScene`.
  - Include an action to close (set `closeOverlayOnSuccess:true`) or return via successor.
  - If the overlay yields loot, set `type:"interact"` + `givesItem:"item-id"`.
- No duplicate `cmd` within a scene; keep labels concise for buttons.

### Suggested Voice Lines (future TTS)
- `move`: “You head north into the kitchen.”
- `look`: “You examine the dusty bookshelf.”
- `interact`: “You pull the lever; a hidden door opens.”

### Validation Guidelines
- `type` in allowed set.
- `cmd` non-empty, lowercase.
- `successor` required when `type=move`; if present must resolve to a scene id.
- No duplicate `cmd` within a scene.
