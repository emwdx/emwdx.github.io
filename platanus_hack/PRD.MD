Adventure360 MVP – Technical Product Requirements Document (PRD)
Version: 1.1 (current implementation)
Audience: Coding LLM / engineering agent
Purpose: Blueprint for maintaining and extending Adventure360, a text-adventure engine that renders 360° images or videos per scene, supports overlays, inventory, and structured scene graphs with consistent visual prompts.

1. Product Overview
Adventure360 is a single-page browser app (vanilla HTML/CSS/JS) with no backend. It combines:
- Scene Graph: Nodes (base scenes + overlay close-ups) linked by typed actions.
- Scene Viewer: 360° image via Pannellum or 360° video on a Three.js sphere with drag/zoom, fullscreen, and compass.
- Scene Editor: LocalStorage-backed editor for scenes, actions, overlays, prompts, and assets; includes overlay creator.
- Overlays: Look actions can open a modal close-up scene layered over the base scene with its own actions.
- Inventory: Simple string-based inventory populated by interact actions (givesItem).
- Automatic Asset Naming: `{assetBase}/{sceneId}.pano.{ext}`; optional `videoUrl` overrides.
- Prompt Builder: Scene-specific prompt + global style + equirectangular preamble for consistent generation.
- Asset Checker: HEAD checks derived image URLs and optional videos.

2. High-Level Architecture
Browser SPA
├─ UI Layer (vanilla HTML/CSS)
│   ├─ Scene Graph Editor + Overlay Creator
│   ├─ Play Panel with commands/actions, inventory, fullscreen
│   ├─ Asset Inputs (base URL, extension, global style)
├─ Logic Layer (JS modules, inlined)
│   ├─ SceneStore (graph)
│   ├─ UIStore (asset base/ext, style)
│   ├─ StateStore (current scene, overlay, inventory)
│   ├─ Renderer (pano/video + overlays + compass)
│   ├─ SceneGraphEditor
│   ├─ PlayEngine (command resolution)
│   ├─ PromptBuilder
│   ├─ AssetChecker
└─ Rendering Layer
    ├─ Pannellum (equirectangular pano)
    └─ Three.js sphere (equirectangular video)

3. Data Model Specification
Stored in localStorage under:
- Graph: adv360_graph_v1
- State: adv360_state_v1
- UI: adv360_ui_v1

3.1 Scene
{
  "id": "kebab-case-id",
  "title": "Readable title",
  "description": "Player-facing text",
  "image_prompt": "Scene-specific description; uses compass references (East is forward).",
  "videoUrl": "https://.../scene.pano.mp4",   // optional; overrides image
  "kind": "base" | "overlay",                 // overlay = close-up modal
  "actions": [ Action... ]
}

3.2 Action
{
  "type": "move" | "look" | "interact",
  "cmd": "east",                     // lowercase, unique per scene
  "label": "Go east",                // button text
  "successor": "kitchen",            // required for move; optional for interact
  "overlayScene": "kitchen-sink",    // for look (opens overlay modal)
  "givesItem": "banana",             // optional inventory id for interact
  "closeOverlayOnSuccess": false     // set true to auto-close overlay after action
}

3.3 State
{
  "current": "scene-id",             // active base scene
  "overlay": "overlay-id|null",      // open overlay scene id
  "inventory": ["item-id", ...]
}

3.4 Asset Naming
- Image: {assetBase}/{sceneId}.pano.{ext}
- Video: explicit videoUrl (must end .mp4)
- Audio (future): {assetBase}/{sceneId}.tts.mp3
Notes: When opened via file://, a leading “/” in Asset base is normalized to “./” to resolve local folders (e.g., ./assets).

4. Rendering Rules
- Mode Selection: if videoUrl present → render video sphere; else render derived image.
- Pannellum config: { type: "equirectangular", panorama, autoLoad:true, compass:false, showControls:true, hfov:100 }
- Three.js config: VideoTexture on SphereGeometry(500,64,64), MeshBasicMaterial(side:BackSide); muted + playsInline.
- Error Overlay: On load failure show center overlay with asset name; suggest asset checker.
- Overlay Scenes: Render as centered modal pane over the viewer; base scene remains visible behind.
- Compass: East = 0° forward; heading displayed with needle + text; updates for both video and Pannellum.
- Fullscreen: Toggles viewer; overlays/actions remain visible.

5. Prompt Builder
PROMPT =
  "Equirectangular 360° panorama, consistent series style."
  + "\n\n" + scene.image_prompt
  + "\n\n" + globalStyle

6. Actions & Navigation
- Resolution: exact cmd match (lowercase, trimmed). Buttons call the same resolution.
- Move: requires successor; clears overlay.
- Look: opens overlayScene modal; does not change base scene unless successor is set.
- Interact: may give inventory; may branch via successor; can close overlay.

7. State
- Stored in adv360_state_v1; updates on scene change, overlay open/close, inventory changes.
- Overlay closes on navigation or when actions set closeOverlayOnSuccess.

8. Validation (implemented)
Per Scene:
- id kebab-case, unique
- title nonempty
- image_prompt nonempty
- videoUrl empty or ends .mp4
- actions: cmd lowercase/trimmed; type in [move, look, interact]; move requires successor; overlayScene must exist if provided
Whole Graph:
- start exists
- reachability check from start; reports unreachable scenes
- cycle detection (warn only)
Per-scene errors shown inline in editor.

9. Asset Availability Checker (implemented)
- HEAD each derived image; HEAD video if present; shows ✔/✖ per scene.

10. Performance
- Destroy Pannellum when switching to video.
- Stop requestAnimationFrame loops when tearing down video or Pannellum compass polling.
- Dispose textures; remove event listeners on cleanup.

11. UX Requirements
Editor
- Scene selector/list (overlays tagged)
- Fields: ID, Title, Description, Video URL, Derived image (read-only), Scene prompt, Global style
- Actions list: type, cmd, label, successor, overlayScene, givesItem, close-overlay toggle; add/remove actions
- “Add Overlay” creates overlay scene + look action linking to it
- Save feedback; validation panel
Play
- Scene title/description; derived filename display
- Action buttons + command input (Enter to trigger)
- Fullscreen toggle; compass
- Viewer overlays: load-failure overlay, on-screen action buttons, overlay modal for look actions with its own actions and close button
- Inventory chips

12. Non-Goals
- No backend, auth, uploads
- No procedural story gen (future)
- No TTS yet (reserved in naming)
- No compressed/binary formats

13. Acceptance Criteria
- Editor fields persist and validate; overlays can be created and linked via look actions.
- Switching scenes loads correct video or derived image; asset base/ext changes re-derive URLs immediately.
- Overlay modal opens via look actions, stays modal (does not replace base scene), and overlay actions work.
- Inventory updates when interact actions set givesItem; chips show current items.
- Command + button navigation work; invalid commands list valid options.
- Asset checker reports missing assets; error overlays show on load failure.
- Video sphere renders in Chrome desktop and Safari iOS (muted autoplay); render loop pauses in image mode.
- Import/export reproduces exact graph/UI/state.

14. Deliverables
- Updated index.html (single file) with modules: SceneStore, UIStore, StateStore, Renderer, SceneGraphEditor, PlayEngine, PromptBuilder, AssetChecker
- Validation layer, overlay modal behavior, inventory UI
- Asset checker panel; error overlays
- Performance cleanup and documentation block at top summarizing architecture
