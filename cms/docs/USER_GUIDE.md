# ACUTE Lab Website — Content Management Guide

This guide explains how to use the ACUTE Content Manager (CMS) to edit the lab website without touching code.

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [The Dashboard](#2-the-dashboard)
3. [Managing Publications](#3-managing-publications)
4. [Managing Team Members](#4-managing-team-members)
5. [Managing Blog Posts](#5-managing-blog-posts)
6. [Managing Research Areas](#6-managing-research-areas)
7. [Managing Featured Research](#7-managing-featured-research)
8. [Managing the Gallery](#8-managing-the-gallery)
9. [Managing the Stats Ticker](#9-managing-the-stats-ticker)
10. [Managing Partners & Funders](#10-managing-partners--funders)
11. [Image Manager](#11-image-manager)
12. [Previewing the Website](#12-previewing-the-website)
13. [Publishing Your Changes](#13-publishing-your-changes)
14. [Troubleshooting](#14-troubleshooting)

---

## 1. Getting Started

### Prerequisites

You need the following installed on your computer:

- **Node.js** (version 20 or higher) — [download here](https://nodejs.org) (Windows: use the `.msi` installer, keep all defaults)
- **Git** — [download here](https://gitforwindows.org/) (Windows: install "Git for Windows", keep all defaults — this includes Git Bash)
- **Ruby + Jekyll** — only needed for the Preview feature (optional, see [Section 12](#12-previewing-the-website))

### Which terminal to use

| Operating System | Terminal |
|-----------------|----------|
| **Windows** | Open **Git Bash** (installed with Git for Windows). Right-click on your desktop and select "Git Bash Here", or search for "Git Bash" in the Start menu. |
| **macOS** | Open **Terminal** (Applications > Utilities > Terminal) |

All commands in this guide work in both Git Bash (Windows) and Terminal (macOS).

### First-Time Setup

1. **Clone the repository** (only the first time):

```bash
cd ~/Documents
git clone git@github.com:Acute-hi-is/Acute-hi-is.github.io.git acute_website_v2
```

2. **Install CMS dependencies**:

```bash
cd acute_website_v2/cms
npm install
```

This only needs to be done once (or after updates to the CMS).

### Starting the CMS

Every time you want to edit content:

```bash
cd ~/Documents/acute_website_v2
git pull origin main       # get the latest changes
cd cms
npm run dev                # start the CMS
```

Open your browser and go to **http://localhost:3000**

### Stopping the CMS

Press **Ctrl+C** in the terminal.

---

## 2. The Dashboard

When you open the CMS, you land on the **Dashboard**.

![Dashboard](screenshots/01-dashboard.png)

The dashboard shows:

- **Content counts** — how many publications, team members, posts, and research areas exist
- **Quick Actions** — shortcuts to create new content or deploy changes
- **Git Status** — whether you have unsaved (uncommitted) changes

---

## 3. Managing Publications

Click **Publications** in the sidebar.

![Publications list](screenshots/02-publications.png)

### What you see

- A list of all publications sorted by year (newest first)
- **Filter buttons** at the top: All, Haptics, Acoustics, Perception
- Each row shows the title, authors, year, topic badge, and a DOI link

### Adding a new publication

1. Click the orange **+ Add** button (top right)
2. Fill in the form:

![Publication form](screenshots/03-publication-form.png)

| Field | What to enter |
|-------|--------------|
| Title | Full paper title |
| Authors | Author names, comma-separated (e.g. "I. Makarov, R. Unnthorsson") |
| Venue | Journal or conference name |
| Year | Publication year |
| DOI | The DOI identifier (e.g. "10.3390/s25010001") |
| Topic | Select: Haptics, Acoustics, or Perception |
| Summary | A 1-2 sentence description of the paper |
| Image URL | Optional — path to a thumbnail image |
| PDF Path | Optional — path to a locally hosted PDF |

3. Click **Save**

### Editing a publication

Click the pencil icon on any row. The form opens with the current values. Make your changes and click **Save**.

### Deleting a publication

Click the trash icon on any row. A confirmation dialog appears — click **Delete** to confirm.

---

## 4. Managing Team Members

Click **Team** in the sidebar.

![Team page](screenshots/04-team.png)

Members are grouped into **Current Members** and **Past Members**.

### Adding a new team member

1. Click **+ Add Member** (top right)
2. Fill in:
   - **Name** — full name
   - **Role** — e.g. "PhD Candidate", "Postdoctoral Researcher"
   - **Photo** — click Upload to add a photo (auto-compressed to 400x400)
   - **Email** — optional
   - **Profile URL** — optional link to university page
   - **Status** — "current" or "past"
   - **Order** — display order (lower numbers appear first)
   - **Bio** — write in the text area. This supports Markdown formatting
3. Click **Save**

### Moving a member to "Past"

Edit the member, change **Status** from "current" to "past", and save.

### Editing a bio

Click the pencil icon on any member. The bio field supports Markdown:

- `**bold text**` for bold
- `*italic text*` for italic
- `[link text](url)` for links
- Blank lines for new paragraphs

---

## 5. Managing Blog Posts

Click **Posts** in the sidebar.

![Posts page](screenshots/05-posts.png)

### Adding a new post

1. Click **+ New Post** (top right)
2. Fill in:
   - **Title** — the post headline
   - **Date** — publication date
   - **Category** — e.g. "publication", "lab", "event"
   - **Excerpt** — a short summary (shown on the homepage)
   - **Content** — the full post body (Markdown supported)
3. Click **Save**

The post filename is auto-generated from the date and title.

---

## 6. Managing Research Areas

Click **Research Areas** in the sidebar.

![Research Areas page](screenshots/09-research.png)

Each research area has a title, summary, description paragraphs, and linked publications.

### Editing a research area

1. Click the pencil icon on any row
2. The form includes:
   - **Title** and **Summary**
   - **Description** — multiple paragraphs (use Add/Remove buttons to manage)
   - **Publications** — linked papers with text and DOI (use Add/Remove buttons)
   - **Images** — main image and highlight image
3. Click **Save**

---

## 7. Managing Featured Research

Click **Features** in the sidebar.

![Features page](screenshots/10-features.png)

These are the highlighted research sections on the homepage.

### Reordering

Use the up/down arrows on the left of each row to change the display order.

### Editing a feature

Click the pencil icon. You can change the label, title, description text, DOI link, image, and layout direction (Normal or Reversed).

---

## 8. Managing the Gallery

Click **Gallery** in the sidebar.

![Gallery page](screenshots/06-gallery.png)

The gallery controls the photo carousel on the homepage.

### Adding a photo

1. Click **+ Add Photo** (top right)
2. Set the **image path** (type it or use Upload)
3. Add a **caption** and **alt text** (for accessibility)
4. Click **Save**

### Reordering photos

Use the up/down arrows to change the carousel order.

---

## 9. Managing the Stats Ticker

Click **Stats Ticker** in the sidebar.

![Stats Ticker page](screenshots/07-stats.png)

The stats ticker is the scrolling numbers bar on the homepage.

### Adding a stat

1. Click **+ Add Stat** (top right)
2. Enter the **Number** (e.g. "93%", "200 Hz", "34 dB")
3. Enter the **Label** (description of what the number means)
4. Click **Save**

### Reordering

Use the up/down arrows to change the scroll order.

---

## 10. Managing Partners & Funders

Click **Partners** in the sidebar.

![Partners page](screenshots/08-partners.png)

Partners are organized in three tabs:

- **Research** — academic research partners
- **Industry** — industry collaborators
- **Funders** — funding organizations

### Adding a partner

1. Select the correct tab
2. Click the orange **+ Add to [group]** button
3. Fill in the name, website URL, logo (use Upload), and alt text
4. Click **Save**

Logos are auto-compressed to 300x150 pixels.

---

## 11. Image Manager

Click **Image Manager** in the sidebar.

![Image Manager page](screenshots/11-images.png)

### Browsing images

Use the filter tabs at the top:
- **All** — every image on the site
- **team** — team member photos
- **partners** — partner and funder logos

### Uploading images

1. Click the orange **Upload** button (top right)
2. Select one or more files
3. Images are automatically compressed:
   - Team photos: max 400x400, JPEG
   - Partner logos: max 300x150, PNG
   - Other images: max 1200px wide, JPEG

### Deleting images

Click the trash icon below any image and confirm.

---

## 12. Previewing the Website

Click **Preview** in the sidebar.

![Preview page](screenshots/14-preview.png)

**Note:** This feature requires Ruby and Jekyll installed on your computer. This is optional — you can skip it and your changes will still work after publishing.

**Installing Ruby + Jekyll (if you want Preview):**

| OS | How to install |
|----|---------------|
| **Windows** | Download [RubyInstaller](https://rubyinstaller.org/) (Ruby+Devkit version). After install, open a new Git Bash and run: `gem install jekyll bundler` then `cd ~/Documents/acute_website_v2 && bundle install` |
| **macOS** | Ruby is pre-installed. Run: `gem install jekyll bundler` then `cd ~/Documents/acute_website_v2 && bundle install` |

**Using Preview:**

1. Click the orange **Start** button
2. Wait for Jekyll to build the site (may take 10-20 seconds the first time)
3. The website appears in the preview area
4. Use the **Desktop / Tablet / Mobile** buttons to test different screen sizes
5. Click **Stop** when done

Every time you save content in the CMS, the preview updates automatically.

**If you don't have Ruby installed**, skip this step — just publish your changes and check the live website instead.

---

## 13. Publishing Your Changes

When you're happy with your edits, click **Deploy** in the sidebar.

![Deploy page — top](screenshots/12-deploy.png)

### Step 1: Review your changes

- **Changed Files** shows everything you've modified
- Click **Show Diff** to see exactly what changed

### Step 2: Commit and push

![Deploy page — bottom](screenshots/13-deploy-bottom.png)

1. Type a short **commit message** describing your changes (e.g. "Add new publication by Karimi et al.")
2. Click **Commit** to save your changes locally
3. Click **Push** to publish to GitHub

Or use the orange **Build + Commit + Push** button to do everything in one click.

After pushing, the website updates automatically.

### Important

- Always **pull the latest changes** before starting work (`git pull origin main` in terminal)
- Write clear commit messages so others know what changed
- Only one person should edit at a time to avoid conflicts

---

## 14. Troubleshooting

### The CMS won't start

- Make sure you're in the `cms/` directory
- Run `npm install` again to ensure dependencies are up to date
- Check that Node.js 20+ is installed: `node --version`
- **Windows:** Make sure you're using **Git Bash**, not Command Prompt (cmd). The CMS may not work correctly in cmd.

### Changes don't appear on the live site

- Make sure you committed AND pushed (check the Deploy page)
- Wait a minute — the site may take a moment to update after pushing

### Preview doesn't work

- Preview requires Ruby and Jekyll installed locally
- If you don't have them, skip preview — your changes will still work after pushing

### "Merge conflict" error when pushing

- This means someone else edited the same file at the same time
- Ask a team member with git experience to help resolve it
- To avoid this: always `git pull` before starting, and coordinate with colleagues

### "Permission denied (publickey)" when pushing

- Your SSH key is not set up for GitHub
- Ask a team member to help you add your SSH key to the ACUTE GitHub organization
- Alternative: use HTTPS instead of SSH — ask your team lead for instructions

### Images look wrong or don't upload

- Supported formats: JPEG, PNG, SVG, WebP
- Images are auto-compressed on upload — the original is not kept
- Maximum recommended size before upload: 10 MB

---

## Quick Reference

| Task | Where | Button |
|------|-------|--------|
| Add a publication | Publications page | + Add |
| Add a team member | Team page | + Add Member |
| Write a blog post | Posts page | + New Post |
| Upload an image | Image Manager | Upload |
| Reorder items | Gallery / Stats / Features | Up/Down arrows |
| Preview the site | Preview page | Start |
| Publish changes | Deploy page | Build + Commit + Push |

**Website:** [https://acute-hi-is.github.io](https://acute-hi-is.github.io)

**Start the CMS:** `cd cms && npm run dev` then open http://localhost:3000
