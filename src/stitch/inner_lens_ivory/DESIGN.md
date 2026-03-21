# Design System Document: High-End Editorial Wellness

## 1. Overview & Creative North Star: "The Curated Interior"
This design system is built to transform a digital interface into a tactile, literary sanctuary. Moving away from the clinical "app-like" aesthetic of modern SaaS, our Creative North Star is **"The Curated Interior."** 

We treat the screen as a series of heavy, high-grade paper stocks layered with intention. The goal is to induce a "parasympathetic state"—lowering the user’s heart rate through generous whitespace, rhythmic typography, and a total absence of harsh structural lines. We reject the "standard grid" in favor of an editorial layout where text flows with the authority of a premium monograph.

---

## 2. Colors & Tonal Architecture
The palette is rooted in organic, earthy permanence. We use tonal shifts rather than borders to define the passage from one thought to the next.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to section content. Boundaries must be defined solely through background color shifts. 
- A card should sit on `surface-container-low` (#f7f3ec) against a `surface` (#fdf9f2) background. 
- Use the `surface-container` tiers (Lowest to Highest) to create "nested" depth.

### Surface Hierarchy
- **Base Layer:** `surface` (#fdf9f2) — The blank page.
- **Sectioning:** `surface-container` (#f1ede6) — For grouping related philosophical prompts.
- **Floating/Actionable:** `surface-container-lowest` (#ffffff) — Reserved for active journaling inputs or modal sheets to create a "lifted" paper effect.

### The "Glass & Gradient" Rule
To escape a "flat" digital feel, use **Glassmorphism** for navigation bars and floating action buttons.
- **Backdrop-Blur:** 12px to 20px.
- **Fill:** `surface` at 85% opacity.
- **Signature Texture:** Use a subtle linear gradient on primary CTAs transitioning from `primary` (#536252) to `primary-container` (#6b7b6a). This provides a "weighted" feel to buttons, suggesting the quality of a leather-bound book.

### Philosopher Themes (CSS Variable Injection)
Each module inherits a "Theme State" that overrides the core palette tokens to reflect the psychoanalytic lens being explored:
- **Freud (The Primal):** Warm browns and terracottas.
- **Jung (The Alchemical):** Deep ochre and parchment.
- **Winnicott (The Holding Environment):** Soft moss and sage.

---

## 3. Typography: The Literary Voice
Typography is the primary visual engine of this design system. It must feel "read," not just "scanned."

*   **Display & Headlines (Newsreader/Serif):** Set with tight tracking (-0.02em) and generous leading. These are the "Therapist’s Voice"—authoritative, calm, and unhurried. Use `display-lg` for emotional anchors.
*   **Body (Newsreader/Serif):** The "Journalist’s Voice." We use Serif for body text to slow down the reading speed, encouraging reflection. Line length must never exceed 65 characters.
*   **Labels & UI (Inter/Sans):** Used sparingly for "The System." This is the only place where functionality intrudes on the literary experience. Always set in `label-md` or `label-sm` with increased letter spacing (+0.05em) for a premium, utilitarian contrast.

---

## 4. Elevation & Depth: Tonal Layering
We achieve hierarchy through "Stacking" rather than "Shadowing."

*   **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` background. The subtle contrast (2-3% luminosity shift) creates a soft, natural lift.
*   **Ambient Shadows:** If a floating element (like a "Finish Journaling" button) requires a shadow, it must be an **Ambient Shadow**:
    *   `box-shadow: 0px 12px 32px rgba(74, 69, 65, 0.06);` (Using a tinted version of `on-surface`).
*   **The "Ghost Border" Fallback:** If accessibility requires a border, use `outline-variant` (#c4c8c0) at **15% opacity**. High-contrast black or grey borders are strictly prohibited.

---

## 5. Components

### Buttons: The Tactile Press
*   **Primary:** High-fill `primary` (#536252). Shape: `md` (0.375rem). Use the subtle gradient mentioned in Section 2.
*   **Secondary:** No fill. `label-md` text in `primary`. Interaction is indicated by a subtle `surface-container-high` background shift on hover.
*   **Floating Action (Journal):** A soft gold `tertiary-container` (#8e733a) circle. Use glassmorphism blurs if it overlaps text.

### Inputs: The Journal Field
*   **Text Areas:** No border. A soft `surface-container-low` background. The cursor should be the `secondary` (#7c544f) color.
*   **Labels:** Always `label-md` in `on-surface-variant`, floating above the field with 1.4rem (`spacing-4`) of breathing room.

### Cards & Lists: The Infinite Scroll
*   **Rule:** Forbid divider lines.
*   **Implementation:** Separate list items using `spacing-6` (2rem) of vertical whitespace. If separation is needed, use a background toggle between `surface` and `surface-container-low`.

### Specialized Component: The "Reflection Chip"
*   Used for tagging emotional states. Use `secondary-fixed` (#ffdad5) with `on-secondary-container` (#7b534e) text. Roundedness: `full`. These should feel like small, smooth river stones.

---

## 6. Do’s and Don’ts

### Do:
*   **Use Asymmetry:** Align the headline to the left but the body text with a wider left margin to create an editorial, "white-space-first" layout.
*   **Embrace the Fold:** Allow text to breathe. If a user has to scroll to see the CTA, that is acceptable; the journey is more important than the conversion.
*   **Respect the Serif:** Use `newsreader` for everything that matters emotionally. Save `inter` for the "mechanics" (settings, timestamps, buttons).

### Don't:
*   **Don't Use Pure Black:** It is too aggressive. Use `Charcoal Taupe` (#4A4541) for all "black" text.
*   **Don't Use Stock Photography:** If an image is needed, use abstract textures (grain, paper tooth, watercolor bleeds) that reference the color tokens.
*   **Don't Use Standard Radii:** Avoid the "bubbly" look. Use `sm` (0.125rem) or `md` (0.375rem) for a more tailored, stationery-like feel.

---

## 7. Spacing & Rhythm
The spacing scale is non-linear to prevent a "mathematically perfect" (and thus sterile) look. Use `spacing-16` (5.5rem) for top-of-page margins to signal that this is a premium, unhurried space. 

**Standard Section Gap:** `spacing-12` (4rem).
**Content Grouping:** `spacing-4` (1.4rem).