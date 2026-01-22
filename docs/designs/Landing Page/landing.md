# Lumina SaaS Enterprise Design System

**Profile Version:** 1.0
**Design Archetype:** Modern B2B SaaS / High-Trust Enterprise
**Visual Signature:** Swiss-style typography merged with ethereal "Aurora" gradients and glassmorphism.

---

## 1. Design Philosophy
The Lumina system is built to communicate **precision, security, and automation**. It avoids the harshness of traditional corporate designs by introducing fluid background gradients and soft, rounded geometry, making complex data appear approachable.

### Core Values
* **Clarity:** High contrast text on clean surfaces.
* **Fluidity:** Soft transitions, gradients, and rounded corners.
* **Trust:** Deep navy anchors (stability) mixed with vibrant blues (technology).
* **Depth:** Layered UI using shadows and backdrop blurs to establish hierarchy.

---

## 2. Color System

### Primary Brand
Used for primary actions, headers, and navigation anchors.

| Token | Hex | Tailwind Reference | Usage |
| :--- | :--- | :--- | :--- |
| **Primary Base** | `#0F172A` | `slate-900` | Main CTA background, H1/H2 text. |
| **Primary Hover** | `#1E293B` | `slate-800` | Hover states for buttons. |
| **Surface Dark** | `#0F172A` | `bg-slate-900` | Dark mode backgrounds, footer. |

### Accent Palette
Used for icons, data visualization, gradients, and active states.

| Token | Hex | Tailwind Reference | Usage |
| :--- | :--- | :--- | :--- |
| **Electric Blue** | `#3B82F6` | `blue-500` | Primary accent, links, icons. |
| **Indigo** | `#4F46E5` | `indigo-600` | Secondary accent, gradients. |
| **Teal** | `#14B8A6` | `teal-500` | Success indicators, verified badges. |
| **Amber** | `#F59E0B` | `amber-500` | Warning, "Review" status. |

### Neutral / Surface
Used for backgrounds, borders, and body text.

| Token | Hex | Tailwind Reference | Usage |
| :--- | :--- | :--- | :--- |
| **Canvas** | `#FFFFFF` | `white` | Card backgrounds, inputs. |
| **Canvas Alt** | `#F8FAFC` | `slate-50` | Section backgrounds. |
| **Border** | `#E2E8F0` | `slate-200` | Subtle borders for cards. |
| **Text Main** | `#0F172A` | `slate-900` | Headings. |
| **Text Body** | `#475569` | `slate-600` | Paragraphs. |

---

## 3. Typography
**Font Family:** `Plus Jakarta Sans`, `Inter`, or similar geometric sans-serif.

### Hierarchy & Scale

* **Display / Hero H1**
    * **Size:** `4.5rem` (72px) to `3rem` (48px)
    * **Weight:** ExtraBold (800)
    * **Tracking:** Tight (`-0.02em`)
    * **Line Height:** `1.1`
    * **Style:** Often utilizes a gradient text fill (`bg-clip-text`).

* **Section Heading H2**
    * **Size:** `2.25rem` (36px)
    * **Weight:** Bold (700)
    * **Color:** Neutral-900

* **Card Heading H3**
    * **Size:** `1.25rem` (20px)
    * **Weight:** Bold (700)
    * **Color:** Neutral-900

* **Body Text**
    * **Size:** `1rem` (16px) or `1.125rem` (18px) for leads.
    * **Weight:** Regular (400)
    * **Color:** Neutral-600
    * **Line Height:** Relaxed (`1.6`)

* **Overline / Label**
    * **Size:** `0.875rem` (14px)
    * **Weight:** SemiBold (600)
    * **Case:** Uppercase
    * **Tracking:** Wide (`0.05em`)

---

## 4. UI Components

### Buttons
* **Primary Action:**
    * Shape: Full Pill (`rounded-full`)
    * Color: Primary Base (`#0F172A`) text White.
    * Shadow: `shadow-xl` + colored glow (`shadow-primary/25`).
    * Hover: `scale-105` transformation.
* **Secondary Action:**
    * Shape: Full Pill (`rounded-full`)
    * Color: White background, Border `#E2E8F0`, Text `#334155`.
    * Hover: Light gray background (`bg-slate-50`).

### Cards (Features & Content)
* **Container:** White background.
* **Border:** 1px solid `#F1F5F9`.
* **Radius:** `rounded-2xl` (16px) or `rounded-3xl` (24px).
* **Shadow:** `shadow-soft` (custom low opacity) resting.
* **Hover Effect:** Lift (`-translate-y-1`), `shadow-xl`, border color darken slightly.
* **Internal Layout:** Icon in top-left (encased in rounded-xl square) -> Title -> Body text.

### Badges & Status Indicators
* **Style:** "Soft" style. 10-15% opacity background with 100% opacity text of the same hue.
* **Shape:** `rounded-md` or `rounded-full`.
* **Example:** Low Risk = `bg-green-100 text-green-700`.

### Dashboard Previews (Glassmorphism)
* **Container:** `bg-white/70` (70% opacity).
* **Effect:** `backdrop-blur-md` or `backdrop-blur-xl`.
* **Border:** `border-white/50` (Translucent white border).
* **Shadow:** `shadow-2xl` for floating effect.

---

## 5. Visual Effects & Atmospherics

### The "Aurora" Background
A defining characteristic of this style is the background lighting.
* **Implementation:** Large, blurred radial gradients placed behind the content layers.
* **Colors:** Fades between Light Blue (`#E0F2FE`), Indigo (`#E0E7FF`), and White.
* **Blur:** `blur-3xl` (very high gaussian blur).
* **Position:** Top-left and Top-right corners, or centered behind Hero text.

### Gradients
* **Text Gradient:** Linear gradient from Blue-600 to Indigo-600 applied to key words in H1.
* **Icon Gradient:** Icons often sit on a very subtle fade (e.g., Blue-50 to White).

---

## 6. Layout Patterns

### Hero Section
1.  **Top:** Navigation with glassmorphism (`bg-white/80 backdrop-blur`).
2.  **Center:** "Trusted by" pill badge -> H1 Headline -> Subheadline -> Two buttons (Primary/Secondary).
3.  **Bottom:** Large visual anchor (Dashboard screenshot or abstract visualization) floating with a heavy shadow.

### Feature Grid
* **Grid:** 4-column layout on Desktop.
* **Interaction:** Cards are interactive; hovering one highlights it while others remain neutral.

### Pricing Table
* **Structure:** 3 Columns.
* **Emphasis:** Center card is scaled up (`scale-105`), has a border-color highlight (Primary Blue), and a "Popular" tag.
* **Lists:** Checkmark icons use the primary accent color.

### Workflow / Process
* **Layout:** Horizontal row of steps.
* **Connectors:** Subtle lines connecting the steps behind the icons.
* **Icons:** Large circular containers (`w-24 h-24`) with drop shadows.

---

## 7. Technical Implementation Notes (CSS/Tailwind)

* **Corner Radius:** Default to `rounded-xl` for small elements, `rounded-3xl` for containers.
* **Transitions:** `transition-all duration-300 ease-out` on almost all interactive elements.
* **Spacing:** Use generous padding. Section `py` should be `20` to `32` (5rem - 8rem).
* **Borders:** Use `border-slate-100` for light mode to keep things subtle. Avoid harsh black borders.