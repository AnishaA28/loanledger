# Design Brief

## Purpose & Tone
Personal finance loan tracking dashboard. Professional restraint, trustworthy, minimal decoration. Every pixel serves information hierarchy. No playfulness, all precision — like a premium banking app.

## Differentiation
**Status-driven visual feedback**: Loan health communicated at a glance via color-coded badges (active = blue, completed = green, overdue = orange). Culturally aware: Indian Rupee (₹) as primary currency.

## Color Palette

| Token          | Light OKLCH   | Dark OKLCH    | Purpose                      |
|----------------|---------------|---------------|------------------------------|
| Primary        | 0.52 0.12 260 | 0.72 0.12 260 | Trustworthy indigo-blue      |
| Accent         | 0.58 0.15 180 | 0.78 0.15 180 | Teal for interactive focus   |
| Destructive    | 0.56 0.2 25   | 0.62 0.22 25  | Sunset orange-red (overdue)  |
| Muted          | 0.92 0 0      | 0.24 0 0      | Neutral backgrounds          |
| Background     | 0.98 0 0      | 0.14 0 0      | Clean, breathing space       |
| Border         | 0.9 0 0       | 0.3 0 0       | Subtle structure             |

## Typography
- **Display**: Figtree (geometric, modern, finance-grade) — headers, card titles
- **Body**: GeneralSans (clean, legible at all sizes) — copy, labels, form text
- **Mono**: GeistMono (data precision) — amounts, dates, transaction IDs

## Elevation & Depth
Card-based layout with minimal shadows (`shadow-sm` only). Subtle 1px borders on cards. No depth layering — flat, clean surfaces emphasize content over decoration.

## Structural Zones

| Zone         | Background       | Border    | Purpose                               |
|--------------|------------------|-----------|---------------------------------------|
| Header       | muted/90         | border-b  | Navigation, title, action buttons     |
| Main Content | background       | none      | Loan cards in grid (2-3 cols mobile)  |
| Card         | card             | border    | Individual loan with amount, status   |
| Status Badge | Contextual color | none      | Active (blue), Completed (green), Overdue (orange) |
| Footer       | muted/40         | border-t  | Links, copyright                      |

## Spacing & Rhythm
16px base grid. Generous breathing room: 16px card padding, 24px gap between cards. Mobile-first responsive: 1 column on sm, 2 on md, 3 on lg.

## Component Patterns
- **Loan Cards**: Bordered, 1px grey, 8px radius. Flex layout: borrower name + amount (mono font, ₹ prefix) on left, status badge + due date on right.
- **Status Badges**: Semantic colors, `badge-sm` utility (2.5px padding, 4px radius, 12px text). Filled background + foreground color pair.
- **Forms**: Light bordered inputs, 4px radius. Focus state uses `ring` token. Labels: smaller text above, muted foreground.
- **Buttons**: Primary (indigo bg, white text), Secondary (transparent, border), Destructive (orange). All use `transition-smooth`.

## Motion
Single smooth transition: `transition-smooth (0.3s cubic-bezier(0.4, 0, 0.2, 1))` for hover states, form focus, badge reveals. No complex animations.

## Constraints
- No full-page gradients, no neon glows, no floating elements.
- All interactive states use consistent ring + hover opacity shift.
- Loan amounts always display in ₹ with proper formatting (no symbols outside India context).
- Status badges are non-interactive (read-only visual feedback).

## Signature Detail
**Loan status badges** — compact, color-coded, instantly communicative. Each status color maps to financial health: neutral blue (active, normal), success green (completed, trust), warning orange (overdue, attention needed). Paired with clean tabular data, they create a "dashboard at a glance" experience.
