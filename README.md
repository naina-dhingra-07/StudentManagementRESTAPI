# Student Management REST API (Demo)

A simple, single-page React + Tailwind app that simulates a Student Management
CRUD REST API entirely in the browser (data is kept in `localStorage`, no
backend server required).

## Run locally

**Prerequisites:** Node.js 18+

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Build for production

```bash
npm run build
```

The static output is written to `dist/`.

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## Deploy on Netlify

**Option A — via the Netlify dashboard**
1. Go to https://app.netlify.com and click **Add new site → Import an existing project**.
2. Connect your GitHub account and pick this repo.
3. Build settings are already provided via `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Click **Deploy site**.

**Option B — via the Netlify CLI**

```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

No environment variables or secrets are required — this app has no backend.
