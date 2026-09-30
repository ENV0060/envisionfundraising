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

**Status:** Done (2026-09-30)

Instagram, Facebook and X/Twitter were removed site-wide. LinkedIn is now the only social link and points to https://ca.linkedin.com/company/envision-fundraising (opens in a new tab), in every dropdown menu and footer. The FAQs link, placeholder phone number and placeholder office address were removed in the same pass.

---

## 3. Add location photos for the new offices

**Status:** Done (2026-09-30). Denver, Houston and Montreal photos added. Mississauga no longer needs one (it shares the Toronto / GTA card).

The fallback below still applies to any future office:

Drop these exact filenames into `Location Photos/` and they appear automatically on the homepage grid, join grid, sidebar and city hero. No code changes needed:

- `Mississauga, ON.jpg`
- `Denver, CO.jpg`
- `Houston, TX.jpg`
- `Montreal, QC.jpg`

Landscape skyline shots work best (same style as the existing city photos).

---

## 4. Review "20+ Cities" wording

**Status:** Done (2026-09-30). Homepage stat is now **11 Offices Across North America** and about.html says "with 11 offices across Canada and the United States".

The homepage stats say **20+ Cities** and `about.html` says "operating across 20+ cities". The site now lists **11 offices**. That can still be accurate if campaigns reach more cities than there are offices. Confirm it or update the numbers.

Also worth a read: the new office descriptions for Mississauga, Denver, Houston and Montreal in `script.js` (`cityData`) are draft copy.

---

## 5. Replace John and Aidan placeholder bios and photos

**Status:** Done (2026-09-30). New bios, quotes and photos for John and Aidan, plus a new photo for Michael.

Still placeholder on the team page: Michael Beatty's and Krystal Shannon's descriptions and quotes.

Both live in `team.html` (`.team-featured-card`).
