# Velvet Nova — deploy guide

This turns your app into a real public website that anyone can open — no
Claude.ai account required. It costs nothing to host (Vercel's free tier),
and you pay Anthropic only for the AI messages people actually send.

## What's in this folder
- `public/index.html` — the app (your UI, personas, modes, logo)
- `public/logo.png` — your logo image
- `api/chat.js` — a tiny server function that talks to Anthropic's API using
  your key. **The key never touches the browser**, so it's safe to make this
  site public.

## Step 1 — Get an Anthropic API key (5 min)
1. Go to https://console.anthropic.com and sign up / log in.
2. Add a small amount of credit (a few dollars covers a lot of testing with
   a handful of friends).
3. Go to **API Keys** → **Create Key**. Copy it somewhere safe — you'll paste
   it once in Step 3 and never need to put it in your code.

## Step 2 — Get a free Vercel account (2 min)
1. Go to https://vercel.com/signup and sign up (GitHub login is easiest).

## Step 3 — Deploy
**Easiest path (no command line):**
1. Put this whole folder into a new GitHub repository (drag-and-drop upload
   works on github.com — click "Add file" → "Upload files").
2. In Vercel, click **Add New… → Project**, then import that GitHub repo.
3. Before clicking Deploy, open **Environment Variables** and add:
   - Name: `ANTHROPIC_API_KEY`
   - Value: *(paste the key from Step 1)*
4. Click **Deploy**. In under a minute you'll get a live URL like
   `https://velvet-nova-yourname.vercel.app`.

**If you're comfortable with a terminal instead:**
```
npm install -g vercel
cd velvet-nova-app
vercel
# follow the prompts, then when asked, add the env var:
vercel env add ANTHROPIC_API_KEY
vercel --prod
```

## Step 4 — Test it
Open the URL Vercel gives you, on your own phone and a friend's, and try
each mode. Chat history saves per-device (in the browser), so it won't
sync between your phone and laptop — that's expected at this scale.

## Sending it to friends
Just share the `https://....vercel.app` link. No login needed.

## Keeping costs predictable
- In the Anthropic Console, you can set a monthly spend limit so a busy day
  of testing can't run past what you're comfortable with.
- This app currently sends the last set of messages each time (not
  unlimited history), so costs scale with how much people chat, not with
  how long the app has existed.

## If you outgrow this later
When you're ready for more than a handful of testers — shared chat history
across devices, accounts, or higher traffic — the next step is adding a
real database (e.g. Vercel Postgres or Supabase, both have free tiers) in
place of `localStorage`. Come back and I can wire that in when you're there.
