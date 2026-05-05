# The Moat Editor — Product Requirements Document

## The Problem

English teachers want students to have uninterrupted, independent writing time. The practical obstacle is that AI writing tools are always a tab away. Detection tools don't prevent use in the moment. Bans create an adversarial dynamic. The environment itself is the problem, and the environment is hard to change.

The Moat Editor doesn't try to police behavior. It creates a different kind of incentive: a visual record of uninterrupted offline time that students can actually feel proud of. The streak mechanic and the water animation work together to make focus feel like something you choose rather than something imposed on you.

---

## Concept

A minimalist, full-screen text editor that works exclusively offline. It monitors connectivity in the background by pinging a rotating list of external endpoints. When it detects that the user has no internet access, it "fills" — a river animation begins flowing through a meandering moat that borders the editor canvas. When connectivity returns, the water stops and the dry channel remains visible, showing a break in the streak.

The moat is the interface. Everything else gets out of the way.

---

## Core Metaphor

The moat represents a protected space. When the water flows, the castle is secure. When the water drains, the walls are down. The user's job is to keep the water moving — which means staying offline and writing.

The animation is not decorative. It is the primary feedback mechanism for the entire app.

---

## Connectivity Detection

The app runs a background polling loop, checking every 10–15 seconds by attempting to fetch a tiny resource (a 1x1 pixel or a favicon) from a list of well-known external hosts: Google, Cloudflare, a CDN endpoint, and a few others. Using multiple targets reduces false positives from any single host being unreachable for unrelated reasons.

If all requests fail (or time out within ~2 seconds), the app registers as offline. If any single request succeeds, the app registers as online.

State transitions:

- **Online → Offline:** Water begins flowing from the entry point (top-left of the moat). Editor activates. Copy button appears.
- **Offline → Online:** Water stops at its current position. The filled portion remains blue. The unfilled portion turns a dry sandy/tan color. Editor remains readable but the copy button disables and a gentle visual indicator signals that the moat is broken.
- **Back Offline Again:** Water resumes from its current dry position. A new fill segment begins, but the gap from the prior online period remains visible — showing the break in continuity.

This means the moat is a visual timeline of the session. A fully filled moat means uninterrupted offline time. A moat with dry gaps tells the story honestly.

---

## The Moat Path

The moat is a continuous, single-width channel that runs along the perimeter of the writing canvas and then meanders inward in a serpentine pattern. It should be designed as a fixed SVG or canvas path that is calculated on load based on screen dimensions.

Path description:

1. **Entry point:** Top-left corner of the screen. Water enters here.
2. **Left column:** The moat runs down the left side of the screen in a back-and-forth serpentine — left a bit, down, right that same amount, down, left again. This meander occupies roughly the left 10–15% of the screen.
3. **Bottom passage:** At the bottom of the left column, the moat turns right and passes under the writing canvas. The section beneath the canvas is rendered as a faint gray silhouette visible through the off-white of the editor surface — like looking at a river through frosted glass or shallow water under ice. A subtle tunnel-mouth graphic marks where the moat enters and exits beneath the canvas.
4. **Right column:** On the right side of the canvas, a matching tunnel-mouth appears and the moat resumes its serpentine meander up the right side of the screen.
5. **Exit point:** Top-right corner. The moat terminates here. A fully filled moat means the water has traveled the entire path.

The moat width should be consistent throughout — approximately 18–24px, wide enough to read clearly but not so wide it dominates the screen.

---

## Water Animation

The fill animation moves as a continuous fluid front progressing along the path at a slow, steady rate — roughly 2–4 pixels per second along the path length. It should feel like watching a slow river, not a progress bar.

Visual properties:

- **Filled water:** A sky blue, slightly translucent. A subtle shimmer or very slow ripple animation suggests movement.
- **Water front:** A soft leading edge, not a hard line. A slightly brighter or lighter blue at the tip conveys flow.
- **Dry channel:** When water stops (user goes online), the unfilled portion shifts to a warm sandy beige or pale terracotta. This color change should be a gentle transition, not an abrupt cut — like watching water recede.
- **Dry gap:** If the user goes back offline after a break, new water begins filling from the current dry position. The gap between the two filled sections remains permanently visible for the session as a record of the interruption.
- **Tunnel section:** Beneath the canvas, the filled portion shows as a muted, desaturated blue-gray. The same dry/filled distinction applies, just at lower opacity.

There should be no fill animation when the user is online. The moat is still. If the user has never gone offline in this session, the moat is simply empty and dry.

---

## Writing Canvas

The canvas is a single full-height scrollable text area centered on the screen. It sits on top of the moat path, which runs beneath and around it.

Visual properties:

- **Background:** Off-white. Something like `#FAF8F4` — warm, paper-like, easy on the eyes.
- **Font:** Open Sans or Lato at 18–20px for body text. Line height around 1.8. Wide enough margins to feel generous.
- **Canvas width:** Approximately 65–70 characters per line. No wider. This is a writing tool, not a document editor.
- **No toolbar.** No formatting controls. No word count visible by default (though a very subtle character or word count could appear in a corner in a very low-contrast gray if there is demand for it).
- **Cursor:** Standard text cursor. No custom styling needed here.

The canvas does not animate. It is the still point at the center of the experience.

---

## Copy Button

A single button, positioned in the bottom-right corner of the canvas (inside the writing area, not on the moat). Small, low-contrast, label: "Copy text."

Behavior:

- **Offline:** Active. Clicking copies all text in the editor to the clipboard. A brief, subtle confirmation (the button text changes to "Copied" for 1.5 seconds) replaces any toast or modal.
- **Online:** Disabled. The button is grayed out and non-interactive. No error message — the visual state communicates the condition.

The idea: students write offline, then copy their draft when they're done and paste it into whatever destination their teacher requires (Google Docs, a submission form, etc.). The Moat Editor does not store or transmit anything.

---

## Text Persistence

The editor content is saved to `localStorage` on every keystroke (debounced by ~500ms). When the app loads, it checks for a saved draft and pre-fills the editor if one exists. This means a student who accidentally closes the tab or loses power does not lose their work.

A very subtle "Draft saved" confirmation — low-contrast gray text, bottom-left of the canvas, visible for 2 seconds — can appear after each save if desired, but it should not draw attention to itself.

No content is ever transmitted to a server. `localStorage` is device-local and session-persistent. This is important for trust: students and teachers should be able to verify that nothing leaves the device.

The moat animation state is not persisted between sessions — it resets on reload. Only the text is saved.

---

## Wi-Fi Off Prompt

When the app loads and detects that the user is online, a clear explanatory nudge appears telling them what the site is and how to begin. This is not a modal or a blocker — it is a persistent inline message that sits over the inactive editor surface until the user goes offline.

**macOS / Linux:** The prompt appears in the upper-left area of the screen, since the wi-fi toggle lives in the menu bar at the top-right of macOS (and equivalently in most Linux desktop environments). The logic is that the eye travels from the instruction across the top of the screen to the control. Suggested text: "Turn off Wi-Fi to begin writing." with a small wireless icon beside it.

**Windows:** The prompt appears in the lower-right area of the screen, since the network icon in the Windows system tray sits in the bottom-right corner. Same text, same icon, different anchor point.

Platform detection can be approximated via `navigator.userAgent` or `navigator.platform`. This doesn't need to be perfect — a best guess between "Windows" and "everything else" covers the vast majority of cases.

The prompt disappears the moment the app detects offline status and the moat begins to fill. It should not reappear mid-session if the user goes back online — by that point they know how the app works.

The prompt should be visually consistent with the rest of the app: no bright colors, no animation, no urgency. It is a quiet explanation, not an alarm. It should be large enough to explain the concept to someone arriving cold: the editor only opens offline, the moving water is a focus streak, and returning online pauses the editor while leaving a visible break in the moat.

---

## Visual States Summary

| State | Moat | Canvas | Copy Button | Wi-Fi Prompt |
|---|---|---|---|---|
| Online, first load | Dry, empty | Dimmed | Disabled | Visible |
| Offline | Filling with water | Active | Enabled | Hidden |
| Back online after writing | Water stops, gap shows | Dimmed | Disabled | Hidden |
| Back offline again | Water resumes, gap visible | Active | Enabled | Hidden |

---

## What This Is Not

The Moat Editor is not a productivity suite. It has no formatting, no file management, no history, no cloud sync, no account system, and no sharing feature. Adding any of those things would undermine the premise. The copy button is the exit ramp. Everything else stays out of the way.

It is also not a surveillance or enforcement tool. It cannot prove to a teacher that a student was offline. What it can do is give students a reason to want to stay offline — the visual satisfaction of an unbroken water streak — and give them a clean, distraction-free place to write when they do.

---

## Open Questions for the Build

A few things worth resolving before coding begins:

**Moat path:** For v1, treat the moat path as a static SVG designed for a standard 1280x800 or 1440x900 viewport. The tunnel beneath the canvas is a static visual — no special rendering logic. The entire moat is a pre-drawn SVG stroke path that gets progressively revealed using `stroke-dashoffset` animation, with the canvas div floating above the SVG layer at a higher z-index.

**False positive handling:** Spotty connectivity can cause rapid online/offline toggling. A 5-second debounce before any state transition prevents the moat from flickering. Worth testing on real school networks, which can be unpredictable.

**localStorage key:** Use a namespaced key like `moat-editor-draft` to avoid collisions. Consider whether a "clear draft" option is needed — a very small, hard-to-find button somewhere in the interface — so students starting a new assignment don't carry over old text.

**Mobile:** Out of scope for v1. The serpentine moat doesn't adapt well to narrow screens. Design for desktop only and add a simple "this app is designed for desktop" message on viewports below 768px wide.

---

## Implementation Stack Suggestion

Given that this is a single-screen, single-purpose tool with no backend, a plain HTML/CSS/JavaScript implementation is the most straightforward path. React would add structure if the component complexity warrants it, but the core use case doesn't require it.

The moat animation would work well as an SVG with a `stroke-dashoffset` animation or a canvas-drawn path with a requestAnimationFrame loop. The latter gives more control over the fluid front appearance but requires more custom rendering code.

The connectivity polling would be a simple `setInterval` using `fetch()` with an `AbortController` timeout against several external URLs with `mode: 'no-cors'`. A successful response (even an opaque one) confirms connectivity.
