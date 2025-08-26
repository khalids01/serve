# File Storage Server Landing Page Plan (Header + Hero)

## Objectives
- Build a clean, maintainable, reusable, and responsive landing page for an open source file storage server using shadcn/ui + Tailwind.
- Showcase the file storage capabilities, features, and encourage adoption/contribution.
- Prefer Server Components; use Client components for animations, interactivity, and 3D only.
- Scope: Header and Hero sections only.

## Tech & Libraries
- UI: shadcn/ui components
- Animations: motion (framer-motion v12)
- 3D: react-three-fiber + drei (OrbitControls) for file visualization
- Icons: lucide-react (file, folder, cloud, server icons)
- Data: Server stats and configuration via server function

## Information Architecture
- Route: `/` → `src/app/page.tsx` (Server Component)
- Composition:
  - Header (Server): `src/components/core/site-header.tsx`
    - ProjectLogo (Client): `src/components/core/project-logo.tsx`
  - Hero (Server wrapper): `src/features/landing/hero.tsx`
    - Left (Server): project name, tagline, key features, GitHub stats (fetched via server function)
    - Right (Client): FileVisualization 3D with OrbitControls `src/components/core/file-visualization.tsx`
  - FloatingFiles (Client, page-level overlay): `src/components/core/floating-files.tsx`

## Data Model & Fetching
- Server function: `src/features/landing/data.ts` → `getLandingData()`
  - Reads server statistics:
    - Total storage capacity
    - Files stored count
    - Active connections
    - GitHub repository stats (stars, forks, contributors)
  - Fallbacks if data missing:
    - projectName: "Serve - Open Source File Storage"
    - tagline: "Fast, secure, and scalable file storage server"
    - features: ["High Performance", "Open Source", "Secure", "Scalable"]
    - stats: default placeholder values

## Components
- site-header (Server)
  - Layout: sticky top, container, left: ProjectLogo, right: GitHub link + Documentation nav
  - Uses shadcn/ui primitives for structure and theme consistency
  - Right side: GitHub stars badge, "Get Started" and "Documentation" buttons
- project-logo (Client)
  - Motion-based entrance animation with server/cloud icon
  - Accessible: respects `prefers-reduced-motion`
- hero (Server)
  - Layout: responsive 2-column grid
    - Left column: project name, tagline, feature highlights, GitHub stats, CTA buttons
    - Right column: FileVisualization
- file-visualization (Client)
  - R3F Canvas with floating file/folder icons in 3D space
  - File icons orbit around a central server icon
  - Rotation animation + drei's OrbitControls (enabled)
  - Lazy loaded via `next/dynamic` with `ssr: false`
  - Responsive sizing; contains within parent, maintains performance
- floating-files (Client)
  - Lightweight canvas-based floating file icons across page background
  - Subtle file/document icons drifting upward
  - Runs behind content with pointer-events none
  - Respects `prefers-reduced-motion`

## Styling & Layout
- Use Tailwind + shadcn/ui; simple container and spacing
- Responsive breakpoints: sm, md, lg
- Avoid unnecessary wrapper tags; only semantic sections: `header`, `main`, `section`

## Accessibility
- Reduced motion support for ProjectLogo, FileVisualization rotation, and FloatingFiles
- Sufficient contrast, semantic HTML, aria labels on interactive 3D region
- Screen reader friendly descriptions for file storage features

## Performance
- Dynamic import for heavy client components: FileVisualization and FloatingFiles
- Keep 3D draw calls minimal (central server icon + orbiting file sprites)
- Memoize file icon textures and optimize rendering

## Files to Create
- `src/app/page.tsx` (Server)
- `src/components/core/site-header.tsx` (Server)
- `src/components/core/project-logo.tsx` (Client)
- `src/components/core/floating-files.tsx` (Client)
- `src/components/core/file-visualization.tsx` (Client)
- `src/features/landing/hero.tsx` (Server)
- `src/features/landing/data.ts` (Server function)

## Acceptance Criteria
- Header at top with animated project logo and GitHub/documentation links
- Hero shows project name, tagline, key features, and GitHub stats using server-fetched data
- Right shows 3D file visualization with orbiting file icons around server icon
- Floating file icons background effect visible behind content
- Clear call-to-action buttons for "Get Started" and "View on GitHub"
- Page is responsive (mobile/tablet/desktop)
- Codebase respects Server/Client separation per rules
- Emphasizes open source nature and encourages community contribution
