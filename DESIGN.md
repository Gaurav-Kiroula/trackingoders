# Design Brief

## Direction

Logistics Dashboard — Dark editorial interface optimized for rapid shipment scanning, GPS-centric driver tracking, and role-based information access.

## Tone

Clean, modern, utilitarian minimalism. Function-first with subtle refinement — dispatchers need speed, not decoration.

## Differentiation

Live GPS zone as primary visual anchor; shipment state cards with semantic color-coding (teal for active, amber for alerts, red for issues).

## Color Palette

| Token      | OKLCH        | Role                     |
| ---------- | ------------ | ------------------------ |
| background | 0.145 0.014 260 | Dark UI base (dark mode) |
| foreground | 0.95 0.01 260 | Primary text            |
| card       | 0.18 0.014 260 | Section containers      |
| primary    | 0.75 0.15 190 | Active states, CTAs      |
| secondary  | 0.22 0.02 260 | Tertiary UI elements    |
| accent     | 0.75 0.18 60  | Alerts, warnings        |
| muted      | 0.22 0.02 260 | Disabled, subtle text   |

## Typography

- Display: Space Grotesk — headings, shipment IDs, driver names
- Body: DM Sans — form labels, status text, descriptions
- Scale: hero `text-5xl md:text-6xl font-bold`, h2 `text-3xl md:text-4xl font-bold`, label `text-xs font-semibold uppercase`, body `text-base`

## Elevation & Depth

Card-based elevation with subtle shadows. Header and footer have thin borders; content alternates between card backgrounds and muted sections for visual rhythm.

## Structural Zones

| Zone    | Background          | Border               | Notes                           |
| ------- | ------------------- | -------------------- | ------------------------------- |
| Header  | `bg-card`           | `border-b border-border` | Auth/nav bar, fixed-top         |
| Content | `bg-background`     | —                    | Main workflow area, GPS + cards |
| Sidebar | `bg-sidebar`        | `border-r border-sidebar-border` | Role nav, persistent on desktop |
| Footer  | `bg-muted/20`       | `border-t border-border` | Help text, status indicators    |

## Spacing & Rhythm

8px base grid. Shipment cards: 16px padding, 12px gaps. GPS map region: 32px margin. Header/footer: 16px vertical. Micro-spacing inside buttons: 12px horizontal, 8px vertical.

## Component Patterns

- Buttons: Primary (teal bg, dark fg), secondary (muted bg, light fg), danger (red bg)
- Cards: `rounded-lg`, `bg-card`, `shadow-subtle`, thin `border-border`
- Badges: Semantic colors (green=delivered, teal=in-transit, amber=pending, red=error)
- Forms: Dark inputs, subtle borders, clear focus rings in primary color

## Motion

Entrance: fade-in + slide-up (0.2s ease-out) on page load. Hover: text-color shift + `shadow-elevated` on interactive cards (0.15s). No decorative animations — all motion is semantic.

## Constraints

- No full-page gradients or glassmorphism; maintain readability for drivers in vehicles
- High contrast required (WCAG AA+ for accessibility in bright sunlight)
- Mobile-first responsive; GPS map scales 1:1 across breakpoints
- Dark mode only (no light mode) — reduces driver eye strain

## Signature Detail

Semantic status badges use color + small icon to convey shipment state at a glance. Drivers and customers can instantly scan a list without reading text.
