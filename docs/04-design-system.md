# UI Design System

## Design Principle

The report should feel like an enterprise command center: quiet, dense, polished, and decisive. Use premium surfaces, precise spacing, restrained motion, and strong visual hierarchy. The design should not look like default Power BI.

## Themes

### Dark Mode

Primary executive mode for command center and NOC-style monitoring.

| Token | Hex | Use |
| --- | --- | --- |
| `bg.base` | `#071018` | Page background |
| `bg.band` | `#0B1622` | Section bands |
| `surface.strong` | `#101C29` | Tables and dense panels |
| `surface.glass` | `#132234CC` | KPI cards and overlay panels |
| `surface.hover` | `#1B2F43` | Hover state |
| `border.subtle` | `#274157` | Card borders |
| `text.primary` | `#F4F8FB` | Primary labels and KPI values |
| `text.secondary` | `#A9B8C7` | Captions and support text |
| `text.muted` | `#6F8499` | Metadata |
| `accent.azure` | `#5AB9FF` | Links, selected controls |
| `accent.green` | `#36D399` | Healthy |
| `accent.amber` | `#F5B84B` | Review/warning |
| `accent.red` | `#FF5C73` | Critical |
| `accent.violet` | `#A78BFA` | Adoption highlights |
| `accent.teal` | `#2DD4BF` | Capacity and forecast highlights |

### Light Mode

For printable executive packs and embedded leadership reports.

| Token | Hex | Use |
| --- | --- | --- |
| `bg.base` | `#F6F8FB` | Page background |
| `bg.band` | `#EEF3F8` | Section bands |
| `surface.strong` | `#FFFFFF` | Tables and panels |
| `surface.glass` | `#FFFFFFE6` | KPI cards |
| `surface.hover` | `#E6F0FA` | Hover state |
| `border.subtle` | `#D5E0EA` | Borders |
| `text.primary` | `#13202E` | Primary labels and KPI values |
| `text.secondary` | `#4C6277` | Captions |
| `text.muted` | `#73879A` | Metadata |
| `accent.azure` | `#0078D4` | Links and selected controls |
| `accent.green` | `#168A5B` | Healthy |
| `accent.amber` | `#B46A00` | Review/warning |
| `accent.red` | `#C7334D` | Critical |
| `accent.violet` | `#6D5BD0` | Adoption highlights |
| `accent.teal` | `#008D86` | Capacity highlights |

## Typography

| Role | Font | Size | Weight | Notes |
| --- | --- | ---:| ---:| --- |
| Page title | Segoe UI / Aptos Display | 30 | 700 | Tight, executive |
| Section title | Segoe UI / Aptos | 18 | 650 | Use sparingly |
| KPI value | Segoe UI / Aptos Display | 34 | 700 | Large, tabular numerals |
| KPI label | Segoe UI / Aptos | 12 | 600 | Uppercase optional only on cards |
| Body/table | Segoe UI / Aptos | 12 | 400 | Dense but readable |
| Caption | Segoe UI / Aptos | 11 | 400 | Secondary text |
| Micro label | Segoe UI / Aptos | 10 | 600 | Badges and timestamps |

Rules:

- Use tabular numerals where supported.
- Letter spacing is 0.
- Avoid oversized headings inside compact panels.
- KPI values must fit the card at all expected values; abbreviate with K/M/B where needed.

## Spacing

| Token | Size |
| --- | ---:|
| `space.1` | 4 px |
| `space.2` | 8 px |
| `space.3` | 12 px |
| `space.4` | 16 px |
| `space.5` | 20 px |
| `space.6` | 24 px |
| `space.8` | 32 px |

Rules:

- Visual-to-visual gap: 16 px.
- Card padding: 20 px.
- Dense table row height: 34 to 38 px.
- Navigation icon target: 48 x 48 px.
- Card radius: 8 px.
- Button/control radius: 6 px.

## Surface Style

### Glass Card

- Fill: `surface.glass`.
- Border: 1 px `border.subtle`.
- Shadow dark mode: `0 18 40 rgba(0, 0, 0, 0.24)`.
- Shadow light mode: `0 14 34 rgba(19, 32, 46, 0.10)`.
- Blur effect in Power BI: approximate with translucent fill plus subtle border. Do not overuse background blur because Power BI export can flatten effects inconsistently.

### Tables

- Background: `surface.strong`.
- Header fill: slightly darker/lighter than body.
- Header text: 11 px, semibold.
- Row divider: 1 px subtle border.
- Conditional formatting:
  - Healthy: green text with faint green fill.
  - Review: amber text with faint amber fill.
  - Critical: red text with faint red fill.

### Trend Sparklines

- Use thin 2 px line.
- Positive: green.
- Negative: red.
- Neutral: muted blue-gray.
- Show a small endpoint dot only on hover tooltip, not permanently.

## Iconography

Use Fluent-style line icons or Power BI built-in SVG/image assets exported from Fluent icons. Recommended mapping:

| Concept | Icon |
| --- | --- |
| Executive overview | Dashboard |
| Refresh | Sync / Refresh |
| Usage | People / Activity |
| Idle assets | Archive / Clock |
| Workspace | Grid / App folder |
| Capacity | Gauge |
| Alert | Warning |
| Healthy | Check circle |
| Review | Info / Alert triangle |
| Critical | Error circle |
| Recommendation | Lightbulb |

Rules:

- Icons sit inside 32 or 40 px square containers.
- Use icons for navigation and small actions.
- Pair icons with text only when the command may be ambiguous.
- Tooltips must name icon-only actions.

## KPI Card Pattern

| Zone | Content |
| --- | --- |
| Top left | Icon and KPI label |
| Top right | Status chip or delta |
| Center | Primary value |
| Lower left | Secondary metrics, max 3 |
| Lower right | 40 to 70 px sparkline |
| Footer | Last refreshed or drill hint in muted text |

States:

- Default: glass surface, subtle border.
- Hover: surface lightens, border uses `accent.azure`, pointer cursor for drillable cards.
- Selected: left 3 px accent rail.
- Critical: red status chip, not a full red card.
- Loading: skeleton shimmer with no layout shift.

## Tooltip Behavior

Tooltips should feel like inspection panels, not generic hover labels.

| Area | Tooltip Content |
| --- | --- |
| KPI | Definition, current value, previous period, trend, source freshness |
| Refresh failure | Dataset, owner, error category, exception code, last success, recommended action |
| Idle report | Owner, workspace, last view, total views, recommendation, business criticality |
| Workspace score | Component scores and top 3 reasons for score |
| Capacity point | Timestamp, CU %, CPU %, memory %, workload, throttling, top operation |

Rules:

- Tooltip max width: 360 px.
- Tooltip max height: 460 px.
- Use strong labels and compact rows.
- No paragraphs unless explaining an exception.
- Include source timestamp for operational metrics.

## Color Semantics

| Semantic | Dark | Light |
| --- | --- | --- |
| Healthy | `#36D399` | `#168A5B` |
| Review | `#F5B84B` | `#B46A00` |
| Critical | `#FF5C73` | `#C7334D` |
| Informational | `#5AB9FF` | `#0078D4` |
| Adoption | `#A78BFA` | `#6D5BD0` |
| Capacity | `#2DD4BF` | `#008D86` |

Do not color entire pages by status. Use status color as a signal on chips, thin rails, markers, and selected data points.

## Power BI Theme Snippet

```json
{
  "name": "Power BI Premium Command Center",
  "dataColors": [
    "#5AB9FF",
    "#36D399",
    "#F5B84B",
    "#FF5C73",
    "#A78BFA",
    "#2DD4BF",
    "#8FA3B8"
  ],
  "background": "#071018",
  "foreground": "#F4F8FB",
  "tableAccent": "#5AB9FF",
  "visualStyles": {
    "*": {
      "*": {
        "title": [
          {
            "fontColor": { "solid": { "color": "#F4F8FB" } },
            "fontFamily": "Segoe UI Semibold",
            "fontSize": 12
          }
        ],
        "background": [
          {
            "color": { "solid": { "color": "#132234" } },
            "transparency": 12
          }
        ],
        "border": [
          {
            "show": true,
            "color": { "solid": { "color": "#274157" } },
            "radius": 8
          }
        ]
      }
    }
  }
}
```

## Interaction Rules

- KPI cards drill to the relevant control page.
- Slicers live in a single compact filter bar, not scattered across pages.
- Use bookmarks for open/closed filter panel state.
- Use field parameters for switching grain and metrics.
- Use report page tooltips for dense diagnostics.
- Use drill-through for operational detail, not giant tables on the executive page.
- Preserve cross-filter context between pages with synced slicers.

## Accessibility

- Minimum contrast ratio: 4.5:1 for text.
- Critical state must include icon and text, not color only.
- Keyboard focus state: 2 px azure outline.
- Do not rely on tiny colored dots as the only status indication.
- Use concise alt text for image/icon assets.
