# BlueAI PM — Web App UI Kit

High-fidelity, click-through prototype of the BlueAI web + desktop app.

## Screens

| Screen | Description |
|---|---|
| **Chat** | Main AI chat interface with message bubbles, prompt suggestions, loading states |
| **Dashboard** | Overview cards, skills grid, jobs grid, scheduled tasks, CTA band |
| **Jobs** | Active jobs list + job history, job detail modal |
| **Skills** | Skills list with search, create/modify modals, skill detail sheet |

## Usage

Open `index.html` in a browser. Navigate via the top navbar menu icon or inline links.

## Components

- `Navbar.jsx` — Fixed top bar with gradient logo, credits button, avatar, dropdown menu
- `Dashboard.jsx` — Home overview with 4-stat cards, CTA band, skills/jobs preview grids
- `Chat.jsx` — Full chat interface with message rendering, suggestions, input area
- `Jobs.jsx` — Jobs list with status badges, action buttons, detail modal
- `Skills.jsx` — Skills management with search, create modal, skill cards

## Design Notes

- Font: Plus Jakarta Sans (substitute for SF Pro — see README.md)
- Primary accent: `#1990FF`
- Brand gradient: `#0EA4C5 → #7B4CFF`
- Icons: custom inline SVGs, Heroicons v2 outline style, strokeWidth=2
- All Tailwind classes are replicated as inline CSS in this prototype
