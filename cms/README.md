# ACUTE CMS — Step-by-Step Guide

## Starting the CMS

```bash
cd cms
npm run dev
```

This launches both servers. Open **http://localhost:3000** in your browser.

---

## Navigation

The left sidebar has three sections:

### Overview
- **Dashboard** — landing page with quick actions

### Content (where you'll spend most time)
- **Publications** — add/edit/delete papers (title, authors, venue, year, DOI, topic, summary)
- **Team** — manage team members grouped by status (current/past), edit bios with markdown
- **Posts** — blog/news entries with date, category, and markdown body
- **Research Areas** — edit the 6 research area pages (descriptions, key publications)
- **Features** — homepage featured research rows (reorderable)
- **Gallery** — homepage photo carousel (reorderable)
- **Stats Ticker** — the scrolling numbers bar on the homepage
- **Partners** — logos in 3 tabs: Research, Industry, Funders

### System
- **Image Manager** — browse/upload/delete images
- **Preview** — see the live Jekyll site in an iframe
- **Deploy** — commit and push changes to GitHub

---

## Editing Content (same pattern for all types)

1. Go to the content page (e.g. **Publications**)
2. Click **"Add New"** button at the top
3. Fill in the form fields
4. Click **"Save"**
5. The YAML/Markdown file on disk is updated instantly

To **edit**: click the pencil icon on any item → form opens pre-filled → make changes → Save

To **delete**: click the trash icon → confirm in the dialog

To **reorder** (Gallery, Stats, Features): use the up/down arrow buttons on each item

---

## Managing Team Members

1. Go to **Team**
2. Members are grouped: **Current** at top, **Past** below
3. Click **Add New** → fill in name, role, photo, email, profile URL, status, display order
4. The **bio** field is a markdown text area — write the full bio here
5. To move someone to past: edit them and change **Status** to "past"

---

## Uploading Images

### Option A — From any content form
Each image field has an **Upload** button. Pick a file, it gets auto-compressed and saved to the right directory.

### Option B — Image Manager page
1. Go to **Image Manager**
2. Browse by directory tab (All, team, partners)
3. Click **Upload** to add new images
4. Images are auto-compressed (team photos → 400×400, partner logos → 300×150)

---

## Previewing Changes

1. Go to **Preview**
2. Click **Start Preview** — this launches Jekyll's dev server
3. The site appears in an iframe below
4. Toggle device widths: Desktop / Tablet / Mobile
5. Every content edit triggers an automatic rebuild (incremental)
6. Click **Stop Preview** when done

---

## Deploying to GitHub Pages

1. Go to **Deploy**
2. You'll see:
   - Current branch and recent commits
   - List of changed files (green = new, yellow = modified)
3. Click **Show Diff** to review what changed
4. Type a commit message (e.g. "Add new publication")
5. Choose one of:
   - **Deploy** (recommended) — builds site → commits → pushes in one click
   - Or use individual buttons: Build Only / Commit / Push

After pushing, GitHub Actions will automatically deploy to the live site.

---

## Stopping the CMS

Press `Ctrl+C` in the terminal where you ran `npm run dev`.
