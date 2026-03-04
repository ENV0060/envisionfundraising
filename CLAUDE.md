# Envision Fundraising Inc. — Website Project

## Overview
Multi-page marketing website for **Envision Fundraising Inc.**, a Canadian/US company running face-to-face donor fundraising campaigns for major charities. Built as clean multi-page HTML/CSS/JS — no frameworks.

## Design System

### Colours
| Token          | Hex       | Usage                    |
|----------------|-----------|--------------------------|
| `--navy`       | `#0B1F3A` | Primary background       |
| `--charcoal`   | `#1C1C2E` | Alternate dark sections  |
| `--off-white`  | `#F5F0EB` | Body text, light sections|
| `--gold`       | `#D4A84B` | CTAs, accents, highlights|
| `--gold-hover` | `#E0BC6A` | Hover state for gold     |
| `--white`      | `#FFFFFF` | Headings, cards          |
| `--grey-text`  | `#A0A0B0` | Secondary/muted text     |
| `--dark-card`  | `#141426` | Card backgrounds         |

### Typography
- **Headings:** Outfit (800/900 weight)
- **Body:** Inter (400–600 weight)
- Both loaded via Google Fonts

### Design Feel
Warm and mission-driven but visually sophisticated. Not generic nonprofit — more like a premium consulting or tech company that happens to do fundraising.

## File Structure
```
Envision - Website/
├── index.html              # Homepage (complete)
├── style.css               # Shared stylesheet
├── script.js               # Shared JavaScript
├── about.html              # About Us (complete)
├── team.html               # Meet the Team (complete)
├── partner.html            # Partner With Us (complete)
├── charities.html          # Launch Your Campaign (not started)
├── join.html               # Teams Near You / Careers (not started)
├── contact.html            # Contact page (not started)
├── Photos/                 # Team & brand photos
│   ├── John MacInnis.png
│   ├── Aidan Hughes.jpeg
│   ├── Envision Logo.jpg
│   └── Envision Logo - Inspire Change.png
├── index-new-logo.html     # Save state: [ENVISION] CSS text logo version
├── style-new-logo.css      # Save state: [ENVISION] CSS text logo version
├── Location Photos/        # City skyline/landmark photos
│   ├── Ottawa, ON.jpg
│   ├── Toronto, ON.jpg
│   ├── Vancouver, BC.jpg
│   ├── Calgary, AB.jpg
│   ├── Edmonton, AB.webp
│   ├── Halifax, NS.jpg
│   ├── Columbus, OH.jpg
│   └── Windsor, ON.jpg
├── Charity Logos/           # Logo image files
│   ├── Save the Children Logo.png
│   ├── Amensty International Logo.png   (note: filename typo preserved)
│   ├── Oxfam Logo.png
│   ├── CARE Logo.png
│   ├── Children Believe Logo.png
│   ├── Hope and Healing Logo.png
│   ├── SOS Children's Villages Logo.png
│   └── Trillium Health Partners Logo.jpg
├── Charity Websites List.docx
├── Considerations and To-Do's.docx
├── CLAUDE.md               # This file
└── .claude/
    └── launch.json         # Preview server config (Ruby HTTP)
```

## Dev Server
Ruby HTTP server on port 8080. Config in `.claude/launch.json`:
```json
{
  "name": "envision-site",
  "runtimeExecutable": "ruby",
  "runtimeArgs": ["-run", "-e", "httpd", ".", "-p", "8080"],
  "port": 8080
}
```
**Note:** Python3 http.server does NOT work — Xcode Command Line Tools not installed. Use Ruby.

To view on phone: same Wi-Fi network, navigate to `http://<laptop-ip>:8080`.

## Homepage (index.html)

8 sections including decorative curve dividers (stripped down from earlier 10-section version):

1. **Navigation** — Fixed sticky nav with Inspire Change logo image (`Photos/Envision Logo - Inspire Change.png`, `filter: invert(1)`, 36px height) + hamburger only (no visible nav-links on homepage). Hamburger opens a slide-in dropdown panel from the right. Dropdown contains: audience links (Partner With Us, Launch Your Campaign, Join a Team Near You), divider, About Us, Meet the Team, Careers, FAQs, Get In Touch button, and social icons. Audience links in dropdown use class `dropdown-audience-links`. SVG inside button has `pointer-events: none` to fix click propagation. Scrolled state: lighter charcoal background (`rgba(28, 28, 46, 0.94)`) with subtle gold bottom border for separation.

2. **Hero** — Full-viewport with animated intro sequence using **Inspire Change logo** (`Photos/Envision Logo - Inspire Change.png`):
   - Single image with `filter: invert(1)` + `mix-blend-mode: screen` for dark background rendering
   - **Polygon clip-path** used instead of `inset()` to independently control bracket visibility vs "Inspire Change." hiding:
     - Initial: `clip-path: polygon(0 0, 100% 0, 100% 78%, 60% 78%, 60% 100%, 0 100%)` — L-shaped: full height on left (brackets visible), clips bottom-right (hides "Inspire Change.")
     - Reveal: 78% values animate to 100%, collapsing the notch to show full logo
   - **Phase 1 (0–15%)**: Logo fades in centered, scaled from 0.7→1.0, polygon hides "Inspire Change."
   - **Phase 2 (22–30%)**: Polygon animates to reveal "Inspire Change." tagline
   - **Phase 3**: Gold shimmer sweeps across full logo (`logo-shimmer` 1.75s at 1.63s delay, overlay blend mode)
   - **Phase 4 (56–71%)**: Logo drifts down from center to watermark position above ticker (`top: 50%` → `calc(100% - 65px)`), fades to 6% opacity
   - **Hero text** fades in staggered at 4.0s, 4.3s, 4.6s (`hero-text-in` keyframe with scale+translateY)
   - Full animation: 6s `logo-intro` keyframe
   - Tagline: "Fundraising That Moves People.", subtitle, three CTA buttons (Partner With Us, Launch Your Campaign, Join a Team Near You)
   - Background: textured charcoal with vignette, subtle gold glow, faint crosshatch texture
   - Desktop hero padding: `70px 20px 0` (reduced from 100px for better vertical centering)
   - **City ticker** at bottom of hero (not a separate section): gold gradient bar with scrolling city names + year labels (Ottawa 2016, Toronto 2017, Vancouver 2018, Calgary 2020, Edmonton 2021, Halifax 2025, Columbus 2025, Windsor 2025). Bar has `box-shadow` glow for softened edges.
   - **Save states**: `index-new-logo.html` + `style-new-logo.css` preserve the previous [ENVISION] CSS text logo version

3. **Impact Stats** — 4-column grid (12+ Years, 500K+ Donors, 20+ Cities, 10+ Partners). Count-up animation via IntersectionObserver + requestAnimationFrame with ease-out cubic. Full-width curved gold glow bleed from ticker above via `::before` pseudo-element using `radial-gradient(ellipse)`.

4. **Curved Divider: Stats → Locations** — Gold SVG stroke curve (concave up) with horizontal `linearGradient` fading to transparent at edges. Frames the top of the locations section.

5. **Locations Near You** — 8 city cards as `<a href="join.html">` links in a 4-column grid with real photos. Each card has a photo, gradient scrim overlay (`::before` with `:has(img)` selector), and city name label. Cities: Ottawa, Toronto/GTA, Vancouver, Calgary, Edmonton, Halifax, Columbus, Windsor. Background set to `transparent` so body gradient shows through. On **mobile (<=768px)**: converts to a 3D horizontal auto-scrolling carousel (see Mobile Carousel section below).

6. **Curved Divider: Locations → Paths** — Gold SVG stroke curve (convex down) with same horizontal gradient fade. Frames the bottom of the locations section.

7. **Audience Path Cards** — "How Can We Help You?" heading with stationary gold radial glow behind it (`.paths-glow` class, `mix-blend-mode: screen`, 1000x250px ellipse). 3 cards with updated labels and brightened backgrounds (`rgba(255,255,255,0.055)`, border `rgba(255,255,255,0.09)`):
   - For Directors → Partner With Us → `partner.html`
   - For Charities → Launch Your Campaign → `charities.html`
   - For Individuals → Join a Team Near You → `join.html`

8. **Footer** — 4-column grid: brand/tagline (Inspire Change logo image), page links, contact info, social links. Background `transparent` to show body gradient. Gold `border-top` at `rgba(212,168,75,0.15)` for separation. Contact info is placeholder. Homepage footer omits "Home" and "Contact" links. Page links have hover scale effect (`transform: scale(1.16)` with `transform-origin: left center`); contact links excluded from scale via `.footer-contact` class.

### Visual Progression Effects
The homepage uses several layered techniques to create a sense of scroll progression:
- **Body gradient**: Long `linear-gradient` from charcoal (#1C1C2E) through deep navy shades to near-black (#080815). Sections have transparent/minimal backgrounds so the gradient shows through.
- **Gold curved dividers**: Thin gold SVG stroke curves above and below the Locations section. Strokes use horizontal `linearGradient` (transparent → 0.5 opacity gold → transparent) so edges fade naturally with no hard lines.
- **Stationary gold glow**: Radial gradient ellipse behind "How Can We Help You?" heading using `.paths-glow::before` with `mix-blend-mode: screen`.
- **Curved ticker glow**: Full-width `radial-gradient(ellipse)` below the gold ticker bar, creating a curved fade rather than a flat line.
- **Scrolled nav**: Lighter charcoal with gold `border-bottom` for clear separation against page content.

### Removed from Homepage (moved to sub-pages)
- Charity Logo Wall (logos still in `Charity Logos/` folder, not displayed anywhere currently)
- How It Works / About section (content reworked into `about.html`)
- Team Section (moved to `team.html`)
- Testimonials (moved to `about.html`)

## Sub-Pages

### about.html (Complete)
About Us page with:
- **Page Hero**: "About Envision" heading + mission statement
- **Our Story** (`#our-story`): Intro paragraph + 3 cards (Mission-First, Built Different, Real Impact) using `.about-section`
- **Values** (`.values-section`): Off-white background, "What We Stand For" heading, 2x2 grid of values (Integrity, Excellence, People First, Growth) using `.value-item` cards
- **Testimonials**: 3 quote cards (Jessica Reynolds, Kai Mitchell, Rachel Morgan — placeholder names/roles)
- **CTA Path Cards**: "Ready to Work Together?" with 3 path cards
- Shared footer + nav with visible nav-links

### team.html (Complete)
Meet the Team page with:
- **Page Hero**: "Meet the Team" heading
- **Featured Founders** (`.team-featured`): Side-by-side photo + bio cards for:
  - John MacInnis — CEO & Founder (real photo: `Photos/John MacInnis.png`)
  - Aidan Hughes — Vice President (real photo: `Photos/Aidan Hughes.jpeg`)
  - Even-numbered cards use `flex-direction: row-reverse` for alternating layout
  - Each has circular photo (200px, gold border), bio text, and italic quote
- **Supporting Team** (`.team-grid`): 4-column grid with placeholder cards (Operations Lead, City Manager Toronto, City Manager Vancouver, Training & Development)
- **CTA Path Cards**: "Want to Join Us?" with 3 path cards
- Shared footer + nav with visible nav-links

### partner.html (Complete)
Partner With Us page for fundraising directors:
- **Page Hero**: "Better Pay, More Support, Less Work." + "What's stopping you?"
- **Content + Sidebar Layout** (`.content-layout`): 2-column grid (main content + 380px sticky sidebar)
  - **Main content**: "The deal is simple." heading, body copy about the partnership model, 8-item feature checklist (`.feature-list` with checkmark bullets), "Let's Talk" CTA
  - **Sidebar**: 4 script/pitch cards (Elevator Pitch, Recruiter Hook, Director Pitch, The Closer) — each with a label + blockquote
- **CTA Section**: "Not a Director?" with 3 path cards (Work With Us, Join Our Team, Meet the Team)
- Shared footer + nav with visible nav-links

## Navigation Differences: Homepage vs Sub-Pages

**Homepage (`index.html`)**:
- Nav has only Inspire Change logo image + hamburger toggle (no visible nav-links)
- Dropdown uses class `dropdown-audience-links` with updated labels: Partner With Us, Launch Your Campaign, Join a Team Near You

**Sub-pages (`about.html`, `team.html`, `partner.html`)**:
- Nav has Inspire Change logo image + visible nav-links (Partner With Us, Work With Us, Join Our Team) + hamburger toggle
- Dropdown uses class `dropdown-mobile-links` with original labels: Partner With Us, Work With Us, Join Our Team

## Mobile Hero Layout (<=768px)

The mobile hero uses a different layout strategy from desktop:
- **Hero**: `height: 100dvh`, `padding: 60px 20px 0`, `overflow: hidden`
- **Hero content**: `justify-content: center` with `padding-bottom: 60px` — centers text/buttons vertically
- **Ticker**: `position: absolute; bottom: 0; left: 0; right: 0; width: 100%` — pinned to bottom of hero, no `100vw` (avoids horizontal overflow on mobile Safari)
- **Important**: Do NOT use `overflow-x: clip` on mobile hero — causes blank ticker on real Safari. Do NOT use `width: 100vw` on mobile ticker — causes horizontal overflow/blank bar on right side.

## Mobile Locations Carousel (<=768px)

The locations grid converts to a 3D horizontal auto-scrolling carousel on mobile:
- Items duplicated in JS for seamless infinite loop
- Auto-scroll at 0.52px/frame
- Loops back when reaching `originalSetWidth + 80` threshold
- Manual swipe override: detects horizontal touch (dx > dy), pauses auto-scroll, resumes 800ms after touchend
- 3D transforms: `rotateY` (±30deg), `translateZ` (-50px at edges), `scale` (1.1 center → 0.7 edges)
- Opacity: 1.0 center → 0.3 edges
- CSS `mask-image` gradient fades edges left/right
- CSS `perspective: 800px` on container, `transform-style: preserve-3d` on items
- Hover transforms disabled on mobile via CSS `!important`
- `reveal-children` stagger overridden with `opacity: 1 !important` so duplicated items are visible

## Key JavaScript Features (script.js)

- **Sticky nav**: Adds `.scrolled` class on scroll > 60px
- **Dropdown panel**: Creates overlay dynamically, open/close with toggle button, closes on overlay click or link click
- **Scroll reveal**: IntersectionObserver with `.reveal` and `.reveal-children` classes, staggered delays via nth-child (up to 12 children)
- **Stats counter**: requestAnimationFrame with ease-out cubic curve, triggered by IntersectionObserver
- **Mobile locations carousel**: 3D horizontal auto-scroll with manual touch override
- **City ticker**: Duplicates innerHTML for seamless CSS animation loop

## Key CSS Patterns

- CSS Custom Properties for all design tokens
- Body-level `linear-gradient` for page-wide color drift (sections use transparent backgrounds)
- SVG stroke curves with horizontal `linearGradient` for edge-faded dividers (no hard lines)
- `radial-gradient(ellipse)` for curved glow effects (ticker bleed, paths heading glow)
- `mix-blend-mode: screen` on `.paths-glow::before` for natural gold glow blending
- `:has()` selector for conditional location card styling (gradient scrim when img is present)
- `mask-image` / `-webkit-mask-image` for mobile carousel edge fading
- `perspective` + `transform-style: preserve-3d` for 3D carousel
- `will-change: transform, opacity` for GPU acceleration on carousel items
- `scroll-snap-type: none` on mobile carousel (auto-scroll handles positioning)
- `backdrop-filter: blur()` on nav and dropdown panel
- Scrolled nav: gold `border-bottom` for separation against dark backgrounds
- Hero intro animation: `logo-intro` (6s, polygon clip-path reveal + drift), `logo-shimmer` (1.75s at 1.63s delay), `hero-text-in` (staggered at 4.0–4.6s)
- `clip-path: polygon()` animation for progressive logo reveal — L-shaped polygon hides bottom-right ("Inspire Change.") while keeping left (brackets) fully visible, then collapses notch to reveal
- `filter: invert(1)` + `mix-blend-mode: screen` on hero logo img and nav logo for dark background rendering
- `mix-blend-mode: overlay` for hero logo shimmer effect
- Footer link hover: `transform: scale(1.16)` with `transform-origin: left center`, contact links excluded
- Location cards as `<a>` elements linking to `join.html`
- Three responsive breakpoints: 1024px (tablet), 768px (mobile), 480px (small mobile)

## Charity Partners & Links

| Charity                     | URL                                       | Logo File                          |
|-----------------------------|-------------------------------------------|------------------------------------|
| Save the Children           | https://www.savethechildren.ca/           | Save the Children Logo.png         |
| Amnesty International       | https://amnesty.ca/                       | Amensty International Logo.png     |
| Oxfam Canada                | https://www.oxfam.ca/                     | Oxfam Logo.png                     |
| CARE                        | https://www.care.org/                     | CARE Logo.png                      |
| Children Believe            | https://childrenbelieve.ca/               | Children Believe Logo.png          |
| Hope and Healing Int'l      | https://www.hopeandhealing.org/           | Hope and Healing Logo.png          |
| SOS Children's Villages     | https://www.soschildrensvillages.ca/      | SOS Children's Villages Logo.png   |
| Trillium Health Partners    | https://trilliumhealthpartners.ca/        | Trillium Health Partners Logo.jpg  |

**Note:** Charity logos are NOT currently displayed on any page. The logo wall was removed from the homepage. Logos remain in `Charity Logos/` folder for potential future use.

## Pending / In Progress

### Sub-Pages Not Started
- `charities.html` — Launch Your Campaign / Work With Us (for charity organizations)
- `join.html` — Teams Near You / Join Our Team (recruitment/careers)
- `contact.html` — Contact page

### Placeholder Content to Replace
- Supporting team member names, titles, and photos (`team.html` — 4 placeholder cards in `.team-grid`)
- Testimonial names and roles (`about.html` — names are placeholder, roles say "[Charity Partner]" etc.)
- Social media URLs (footer + dropdown — all currently `#`)
- Contact info: phone number is `+1 (000) 000-0000`, office address is `[Office Address Placeholder]`
- FAQ section (dropdown links to `#faq` but no FAQ section exists on any page)
- Footer credit: `Website by [Your Name/Agency]`

### Navigation Consistency
- Homepage uses updated link labels (Launch Your Campaign, Join a Team Near You) while sub-pages still use original labels (Work With Us, Join Our Team). May need to unify.
- Homepage dropdown uses `dropdown-audience-links` class; sub-pages use `dropdown-mobile-links` class

### Logo Situation
- All logos now PNG except Trillium (still .jpg)
- Logos are not displayed anywhere currently — the charity logo wall section was removed from the homepage
- Some logos renamed from earlier versions (Oxfam Canada → Oxfam, CARE Charity → CARE, Children Believe now .png)

## User Preferences
- This chat is used for requests, troubleshooting, questions, and creative discussion simultaneously
- Prefers iterative visual refinement — likes seeing changes and adjusting
- Warm, mission-driven but visually sophisticated aesthetic
- No frameworks — clean multi-page HTML/CSS/JS
- Personality-driven copy (team bios are witty/bold, not corporate)
