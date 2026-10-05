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
2. **DNS Management** → delete the two forwarding `A` records for `@` (`15.197.225.128`, `3.33.251.168`; checked 2026-10-05 — `www` currently has no record at all), then add:

| Type  | Name | Value                            | TTL    |
|-------|------|----------------------------------|--------|
| A     | @    | `75.2.60.5`                      | 1 hour |
| CNAME | www  | `envisionfundraising.netlify.app` | 1 hour |

**At Netlify:**
3. Domain management → confirm custom domain is set as primary, `www` redirects to apex (or vice versa)
4. SSL cert auto-provisions via Let's Encrypt once DNS resolves (usually within minutes)

**Do NOT touch (email — Microsoft 365):** nameservers (`ns23`/`ns24.domaincontrol.com`), the MX record, the TXT records (except the SPF fix in item 8), and the autodiscover / selector1/2._domainkey / lyncdiscover / sip CNAMEs and `_sip` SRV records. Changing nameservers to Netlify would drop these and break company email.

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

Michael Beatty's bio and quote added (2026-09-30). Krystal Shannon's bio and photo added (2026-10-01). Krystal's quote and new title (Director of Strategic Partnerships) added 2026-10-01. No team placeholders left.

Both live in `team.html` (`.team-featured-card`).

---

## 6. Edit the About Us page

**Status:** Done (2026-10-01). Redesigned: hero and Our Story merged, emoji cards and testimonials removed, values as an editorial list, Meet the Team card, three-up CTA.
**Priority:** Medium

`about.html` hasn't had a content pass since it was first built. Things that are known placeholders or worth revisiting:
- **Testimonials:** names and roles are placeholders (Jessica Reynolds, Kai Mitchell, Rachel Morgan; roles like "[Charity Partner]")
- **Our Story** intro and the three cards (Mission-First, Built Different, Real Impact): generic draft copy
- **Values** section (Integrity, Excellence, People First, Growth): draft copy
- Hero subtitle and overall tone, to match the newer pages (Launch Your Campaign, team bios)

---

## 7. Email new applications to an inbox (Netlify)

**Status:** Pending (needs someone with Netlify access)
**Priority:** Medium

Netlify stores every submission of the `apply` form; this adds an email copy.
1. Netlify → **Forms** — confirm the **apply** form is listed (if not: **Enable form detection** and redeploy)
2. **Site configuration → Notifications → Form submission notifications → Add notification → Email notification** — Event: New form submission, Form: `apply`, Email: `info@envisionfundraising.ca` (add more addresses as needed)
3. Send a test application; check spam the first time and mark Netlify (`formresponses@netlify.com`) as a safe sender

Notes: Reply goes to the applicant (form field is named `email`). Resumes arrive as links; always downloadable from Netlify → Forms. Free plan has monthly submission/upload caps.

---

## 8. Fix the email SPF record (GoDaddy DNS)

**Status:** Pending
**Priority:** Low — not blocking anything; separate from item 1

The domain's SPF TXT record is `v=spf1 include:secureserver.net -all`, which doesn't authorize Microsoft 365 (the actual mail provider, per the MX record). Outgoing mail may land in spam; DKIM is set up, which partly compensates.

Change the `@` TXT record to `v=spf1 include:spf.protection.outlook.com -all` — first confirm nothing else sends mail as @envisionfundraising.ca (newsletter tools etc.); if something does, add its include too.
