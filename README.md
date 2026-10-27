# SolarVault — Deploy to Railway

## 3-Step Launch

### Step 1 — Push to GitHub (2 min)
1. Create a new repo at github.com/new (name it `solarvault`, keep it public or private)
2. In this folder run:
```bash
git remote add origin https://github.com/YOUR_USERNAME/solarvault.git
git push -u origin main
```

### Step 2 — Connect to Railway (1 min)
1. Go to **railway.app/project/7e9e07b4-84f1-405b-8a0b-b62d80461f96**
2. Click **+ New Service → GitHub Repo**
3. Select your `solarvault` repo
4. Railway auto-detects Node.js and runs `npm start`

### Step 3 — Go Live (30 sec)
1. In your service settings → **Networking → Generate Domain**
2. Your public URL is live! ⚡

---

## Optional: AI Features (Bill Analyzer, Co-Pilot, Narrative)
Add your Anthropic API key as an environment variable in Railway:
- Name: `ANTHROPIC_API_KEY`
- Value: your key from console.anthropic.com

The app will need a small server-side proxy to use it securely.
Contact your developer to wire that up, or use the app in demo mode without it.

---

## What's Inside
- `SolarVault.jsx` — Full 3,775-line React app (all logic, data, views)
- `index.html` — CDN loader (React, Recharts, Three.js, Lucide, Tailwind, Babel)
- `server.js` — Express server (serves static files, SPA routing)
- `package.json` — Node.js config (only dep: express)
