# File Storage Server Landing Page Plan (Header + Hero)

## Objectives
- Build a clean, maintainable, reusable, and responsive landing page for an open source file storage server using shadcn/ui + Tailwind.
- Showcase the file storage capabilities, features, and encourage adoption/contribution.
- Prefer Server Components; use Client components for animations and interactivity only.
- Scope: Header and Hero sections only.

## Tech & Libraries
- UI: shadcn/ui components
- Animations: motion (framer-motion v12)
- Icons: lucide-react (file, folder, cloud, server icons)
- Data: Server stats and configuration via server function

## Information Architecture
- Route: `/` → `src/app/page.tsx` (Server Component)
- Composition:
  - Header (Server): `src/components/core/site-header.tsx`
    - ProjectLogo (Client): `src/components/core/project-logo.tsx`
  - Hero (Server): `src/features/landing/hero.tsx`
    - Centered single-column layout with project info, stats, and CTAs

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
  - Layout: sticky top, container mx-auto, left: ProjectLogo, right: GitHub link + Documentation nav
  - Uses shadcn/ui primitives for structure and theme consistency
  - Right side: GitHub stars badge, "Get Started" and "Documentation" buttons
- project-logo (Client)
  - Motion-based entrance animation with server/cloud icon
  - Accessible: respects `prefers-reduced-motion`
- hero (Server)
  - Layout: centered single-column design with max-width container
  - Content: project name, tagline, feature badges, stats grid, CTA buttons, GitHub stats
  - All elements centered with proper spacing and responsive design

## Styling & Layout
- Use Tailwind + shadcn/ui with mx-auto for proper centering
- Responsive breakpoints: sm, md, lg
- Centered layout with max-width constraints
- Avoid unnecessary wrapper tags; only semantic sections: `header`, `main`, `section`

## Accessibility
- Reduced motion support for ProjectLogo animations
- Sufficient contrast, semantic HTML, proper heading hierarchy
- Screen reader friendly descriptions for file storage features

## Performance
- Minimal client components, primarily server-side rendered
- Optimized animations with framer-motion
- Fast loading with proper image optimization

## Files to Create
- `src/app/page.tsx` (Server)
- `src/components/core/site-header.tsx` (Server)
- `src/components/core/project-logo.tsx` (Client)
- `src/features/landing/hero.tsx` (Server)
- `src/features/landing/data.ts` (Server function)

## Acceptance Criteria
- Header at top with animated project logo and GitHub/documentation links
- Hero shows centered project name, tagline, key features, and GitHub stats using server-fetched data
- Clean, centered single-column layout without distracting effects
- Stats displayed in responsive grid with proper centering
- Clear call-to-action buttons for "Get Started" and "View on GitHub"
- Page is responsive (mobile/tablet/desktop) with proper container centering
- Codebase respects Server/Client separation per rules
- Emphasizes open source nature and encourages community contribution
