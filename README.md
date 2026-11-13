# tidemark.llc

The Tidemark Advisory website: five pages of plain HTML and one stylesheet. There is no build step, so it runs on GitHub Pages or any static host (Netlify, Cloudflare Pages, Vercel) as-is.

## What's here

| Path | What it is |
| --- | --- |
| `index.html` | Home |
| `services.html`, `results.html`, `about.html`, `contact.html` | Inner pages |
| `404.html` | Page-not-found (GitHub Pages uses it automatically) |
| `assets/css/site.css` | All styles. Brand colors are the variables at the top. |
| `assets/fonts/` | Montserrat and Source Sans 3 (SIL Open Font License) |
| `assets/img/` | Logos, Jason's portraits, and `og-image.png` (the preview shown when the link is shared) |
| `favicon.svg`, `favicon-*.png`, `apple-touch-icon.png`, `icon-*.png`, `site.webmanifest` | Browser and phone icons |
| `sitemap.xml`, `robots.txt` | For search engines |
| `.nojekyll` | Tells GitHub Pages to serve the files exactly as they are |

## Before launch

1. **Booking link.** In `contact.html`, replace `#booking-link` with your scheduling page (for example a Google Calendar appointment schedule or Calendly link). Every "Book an intro call" button on the site goes to the Contact page, so this is the only place to change.
2. **Business email.** Search all `.html` files for `[add business email]` (footer of every page and the Contact page) and replace it. To make it clickable, use `<a href="mailto:you@tidemark.llc">you@tidemark.llc</a>`.
3. **Photos.** The home page has two photo spots that show a flat slate color until you add a photo:
   - Hero: still water and an evergreen shoreline at dusk, at least 2400 px wide.
   - Photo band: layered evergreen ridgelines in fog, at least 2400 px wide.

   Put the files in `assets/img/photos/` (for example `hero.jpg` and `ridgelines.jpg`), then in `index.html` replace each `<!-- PHOTO: ... -->` comment with the `<img ...>` line it shows. The dark veil over the photo stays, so the text keeps its contrast.
4. **Domain.** Links in the page headers and `sitemap.xml` assume `https://tidemark.llc`. If you launch on a different address, search and replace it.

## Publish on GitHub Pages (no command line)

1. Sign in to GitHub and create a new repository, for example `tidemark-site`. Set it to Public. GitHub Pages on a private repository needs a paid plan.
2. In the new repository, choose **Add file → Upload files**. Drag in everything inside this folder (the files and the `assets` folder, not the folder itself), then click **Commit changes**. If your computer hides `.nojekyll`, the site still works without it.
3. Go to **Settings → Pages**. Under **Build and deployment → Source**, choose **Deploy from a branch**, pick `main` and `/ (root)`, and click **Save**.
4. After a minute or two the site is live at `https://<your-username>.github.io/tidemark-site/`.

To change something later, edit the file on GitHub (the pencil icon) or upload a replacement. Each commit republishes the site.

## Point tidemark.llc at it

1. In the repository, go to **Settings → Pages → Custom domain**, enter `tidemark.llc` and click **Save**. GitHub adds a `CNAME` file to the repository for you. GitHub also recommends verifying the domain under your account's Pages settings first.
2. At your domain registrar's DNS settings, add:
   - Four `A` records for `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
   - Optional, for IPv6, four `AAAA` records for `@`: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.
   - A `CNAME` record for `www` pointing to `<your-username>.github.io` (no repository name).
3. DNS can take up to 24 hours. When the option appears in **Settings → Pages**, tick **Enforce HTTPS**.

Source: GitHub Docs, "Managing a custom domain for your GitHub Pages site" and "Configuring a publishing source for your GitHub Pages site."

## Other hosts

Netlify, Cloudflare Pages and Vercel can all deploy this folder unchanged. Point them at the repository, or drag the folder into the host's upload page, and leave the build command empty.

## Editing guide

- Copy and layout live in the `.html` files. Headings use the classes `display`, `h1`, `h2` and `h3`; small capital labels use `eyebrow`.
- Colors, fonts and spacing are variables at the top of `assets/css/site.css`. The brand rules (gold only for the mark line and rules, never gold text on cream; one call to action, "Book an intro call") are in the Tidemark design system.
- Keep text over photos inside the `.photo` blocks so the slate veil keeps it readable.
