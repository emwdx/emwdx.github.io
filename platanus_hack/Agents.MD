# Agents Guide for Building an Adventure360 Game

Purpose: Instructions for an agent to turn a story idea into a JSON graph (scenes, actions, state) ready to import into the game engine.

## Workflow Overview
1) Story Concept → outline theme, tone, goal.
2) World Layout → list rooms/areas (base scenes) and any close-ups (overlay scenes).
3) Actions → define move/look/interact per scene to achieve the goal.
4) Visual Prompts → write image_prompt per scene (compass-aligned, East is forward).
5) Assets → derive filenames `{sceneId}.pano.{ext}`; optional videos (`.mp4`).
6) Export JSON → matches engine schema (Scenes.MD / Actions.MD / State.MD).

## Schema Snapshot
- Scene: id (kebab), title, description, image_prompt, videoUrl?, kind: base|overlay, actions[].
- Action: type (move|look|interact), cmd (lowercase), label, successor?, overlayScene?, givesItem?, closeOverlayOnSuccess?.
- State: current=start, overlay=null, inventory=[]. Start scene must exist and be reachable.

## Step-by-Step
1) Concept
   - Capture a 1–2 sentence premise + primary goal.
   - Note key props/loot (inventory candidates).
2) Map Scenes
   - List base scenes; give each a unique kebab id and short title.
   - For detailed objects, add overlay scenes (`kind:"overlay"`) with their own prompts.
3) Actions
   - For each base scene: add move actions to exits; cmds are compass-based (east forward).
   - For described objects: add look actions with `overlayScene`.
   - For interactions/loot: add interact actions with `givesItem`, optional `closeOverlayOnSuccess:true`.
   - Avoid duplicate cmds per scene.
4) Prompts
   - Write `image_prompt` describing layout with cardinal directions; keep style coherent with a shared global style.
5) Validate
   - Start exists; all successors/overlayScene ids exist; no unreachable bases; videos end .mp4; prompts non-empty.
6) Export
   - Produce JSON: { start, scenes: [...] }. Optional UI/global style kept separately (engine already has fields).

## Generation Checklist for Consistency
- East is forward in all prompts and actions.
- Every base scene has ≥1 outbound move.
- Overlays include at least one action to close/return or give an item.
- Cmds are lowercase, trimmed, and discoverable.
- Asset names align with ids; extension matches actual files.

## Example Minimal Scene
```jsonc
{
  "id": "kitchen",
  "title": "Kitchen",
  "description": "A moonlit kitchen with a sink to the north wall and a door west.",
  "image_prompt": "Moonlit kitchen; sink on the north wall; door on west wall; table center; East is forward.",
  "videoUrl": "",
  "kind": "base",
  "actions": [
    { "type":"move", "cmd":"west", "label":"Go west", "successor":"living-room" },
    { "type":"look", "cmd":"look sink", "label":"Look at sink", "overlayScene":"kitchen-sink" }
  ]
}
```

## Export Target
- Save JSON to import via the game editor’s Import JSON, or drop into `adv360_graph_v1` via devtools.
