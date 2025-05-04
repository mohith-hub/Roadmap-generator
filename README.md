
# 🗺️ AI Roadmap Generator

Generate personalized, domain-specific roadmaps powered by AI. Whether you're diving into Web Development, Cybersecurity, Machine Learning, or more — this app gives you curated, actionable learning paths.

---

## 🚀 Features

- 🔍 **Skill Domain Selection** – Choose from domains like:
  - Web Development
  - Cybersecurity
  - Data Science
  - Machine Learning
  - IoT

- 🤖 **AI-powered Sources** – Pulls learning content from:
  - GitHub Repos
  - Medium Articles
  - YouTube Playlists

- 🌲 **Tree-style Roadmaps** – Visual, hierarchical structure to guide your learning journey.

---

## 🧠 Tech Stack

- **Framework**: Next.js (App Router)
- **Frontend**: React, CSS Modules
- **Languages**: JavaScript
- **Data Source API Routes**: `/api/github`, `/api/medium`, `/api/youtube`

---

## 📁 Folder Structure

```

src/
├── app/
│   ├── api/            # Fetch content from GitHub, Medium, YouTube
│   ├── domains/        # Domain-specific core topics
│   ├── roadmaps/       # UI & data for roadmap creation
│   ├── layout.js       # App layout
│   └── page.js         # Landing page
├── public/             # Static assets (favicon, images)

````

---

## ⚙️ Getting Started

```bash
git clone https://github.com/your-username/roadmap-generator.git

cd roadmap-generator

npm install

npm run dev
````

Visit `http://localhost:3000` to start generating roadmaps.

---

## 📌 TODOs

* [ ] Add user login and save roadmaps
* [ ] Support PDF export
* [ ] Add more domains (e.g. DevOps, Mobile Dev)

---

## 🧑‍💻 Author

**Your Name**
[Portfolio](https://nextjs-portfolio-psi-lac.vercel.app/)
---

> Empower your journey. One roadmap at a time.


