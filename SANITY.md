# Sanity CMS setup

**Project ID:** `abnka2pd`  
**Organization ID:** `oBosxzEp6`  
**Dataset:** `production`

## 1. CORS (required for GitHub Pages / static hosting)

**Local dev (`npm run dev`):** The dev server proxies Sanity at `/api/sanity`, so CORS is not required on localhost.

**Production (GitHub Pages):** In [sanity.io/manage](https://www.sanity.io/manage) → project **abnka2pd** → **API** → **CORS origins**, add your live site URL, e.g.:

- `https://linhnguyen3030.github.io`

Allow credentials: **off** is fine for public content.

## 2. Run Sanity Studio

```bash
cd studio
npm install
npm run dev
```

Open the Studio URL (usually `http://localhost:3333`), sign in, and create:

| Document | Document ID | Purpose |
|----------|-------------|---------|
| **Site Settings** | `siteSettings` | Hero, email, footer, social links |
| **About** | `about` | Bio preview + full bio + photo |
| **Project / Band** | (auto) | One doc per band; set **slug** to match URLs (`soul-sipper`, etc.) |

Use **Publish** on each document so the site can read it.

## 3. Run the portfolio site

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000). Content loads from Sanity when published; otherwise the HTML fallback stays visible.

## 4. Deploy Studio (optional)

```bash
cd studio
npm run deploy
```

Hosts the editor at `https://<your-studio>.sanity.studio`.

## API token (optional)

Public `production` data usually works without a token. If queries fail, create a **Viewer** token in API → Tokens and add to `index.html`:

```html
<meta name="sanity-token" content="sk...">
```

Never commit tokens to git.
