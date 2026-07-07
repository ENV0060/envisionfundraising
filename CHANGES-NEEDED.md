# Envision Website — Needed Changes

Running list of fixes, follow-ups, and improvements identified during ongoing work.

---

## 1. Switch GoDaddy domain forwarding → real DNS records

**Status:** Pending
**Priority:** High — affects mobile rendering on the live site

### Problem
The custom domain is currently set up via GoDaddy **domain forwarding with masking**, which wraps the live site in an `<iframe>` at the GoDaddy URL. The iframe doesn't propagate the `<meta name="viewport">` tag, so mobile browsers fall back to a ~980px default viewport and shrink the entire page to fit — making the site look "zoomed out" on phones compared to the `.netlify.app` URL.

### Fix
Remove forwarding at GoDaddy and point real DNS records at Netlify so the browser loads the site directly under the custom domain.

**At GoDaddy:**
1. My Products → Domain → **Forwarding** → delete the existing forward
2. **DNS Management** → delete any conflicting `@` A record or `www` CNAME, then add:

| Type  | Name | Value                            | TTL    |
|-------|------|----------------------------------|--------|
| A     | @    | `75.2.60.5`                      | 1 hour |
| CNAME | www  | `<your-site-name>.netlify.app`   | 1 hour |

**At Netlify:**
3. Domain management → confirm custom domain is set as primary, `www` redirects to apex (or vice versa)
4. SSL cert auto-provisions via Let's Encrypt once DNS resolves (usually within minutes)

### Verification
- Browse to `https://yourdomain.com` on mobile — should render at correct mobile width
- URL bar should stay on `yourdomain.com` as you navigate (no iframe lock)
- HTTPS padlock visible
- DNS propagation: typically 10 min – a few hours

---

## 2. Wire up real social media links

**Status:** Pending
**Priority:** Medium — currently 64 placeholder `href="#"` links across the site

### Problem
Every page has 4 social icons (LinkedIn, Instagram, Facebook, X/Twitter) in both the dropdown menu and the footer — all pointing to `href="#"`. Clicking them does nothing.

### Note from Ollie
Only Instagram is in active use right now — the rest of the platforms suck for our audience. So for now, hide/remove LinkedIn, Facebook, and X/Twitter icons across the site rather than wiring them up to dead pages.

### URLs in use
- **Instagram**: https://www.instagram.com/envisionfundraising/
- LinkedIn — pending (placeholder URL was incorrect)
- Facebook — not in use
- X/Twitter — not in use

### Fix
1. In every page (homepage dropdown, sub-page dropdowns, every footer), remove the LinkedIn / Facebook / X/Twitter `<a>` elements
2. Update the remaining Instagram link to:
   ```html
   <a href="https://www.instagram.com/envisionfundraising/"
      class="social-link"
      aria-label="Instagram"
      target="_blank"
      rel="noopener noreferrer">Ig</a>
   ```
3. Files affected: `index.html`, `about.html`, `team.html`, `partner.html`, `charities.html`, `join.html`, `contact.html` (skip the save-state files unless we want them in sync)
4. If/when LinkedIn goes live, add it back with same `target="_blank" rel="noopener noreferrer"` pattern
