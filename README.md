# ✨ StickerVerse

> The internet's favourite sticker community. Upload, discover, and vibe.

**Live Demo:** [stickerverse-ruddy.vercel.app](https://stickerverse-ruddy.vercel.app)

---

## 📸 Overview

StickerVerse is a full-stack sticker sharing platform where creators can upload their art, discover stickers from others, follow creators, and build their collection.

---

## 🚀 Features

- 🎨 **Upload Stickers** — Drag & drop PNG, WEBP, GIF with title, description, tags and category
- 🔍 **Search & Discover** — Browse by category or search by name
- 👤 **User Profiles** — Public profiles with sticker galleries, followers and following
- ❤️ **Follow System** — Follow your favourite creators
- 📊 **Dashboard** — Track your uploads, downloads and follower stats
- 🔐 **Auth** — Email/password registration with custom username + GitHub OAuth
- 🛡️ **Admin Panel** — Manage users and sticker content
- 📱 **Fully Responsive** — Works on mobile, tablet and desktop

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Backend | Supabase (PostgreSQL) |
| Auth | Supabase Auth (Email + GitHub OAuth) |
| Storage | Supabase Storage |
| Deployment | Vercel |

---

## 📁 Project Structure

```
stickerverse/
├── app/
│   ├── page.tsx                  # Home page
│   ├── auth/
│   │   ├── signin/page.tsx       # Sign in page
│   │   ├── register/page.tsx     # Register page
│   │   └── callback/route.ts     # OAuth callback
│   ├── sticker/[id]/page.tsx     # Sticker detail page
│   ├── upload/page.tsx           # Upload page
│   ├── search/page.tsx           # Search & discovery
│   ├── user/[username]/page.tsx  # User profile
│   ├── dashboard/page.tsx        # User dashboard
│   ├── admin/page.tsx            # Admin panel
│   └── api/
│       ├── stickers/             # Sticker CRUD API
│       ├── upload/               # File upload API
│       └── follow/               # Follow system API
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── ui/
│       ├── StickerCard.tsx
│       └── Skeleton.tsx
├── context/
│   └── AppContext.tsx            # Global auth + state
├── lib/
│   ├── supabase.ts               # Browser client
│   └── server/supabase.ts        # Server client
└── mocks/
    └── data.ts                   # Categories + types
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) account
- A [Vercel](https://vercel.com) account (for deployment)

### 1. Clone the repository

```bash
git clone https://github.com/allenasat044-prog/stickerverse.git
cd stickerverse
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌍 Deployment

Deployed on Vercel. To deploy your own:

1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Add environment variables
4. Click Deploy

---

## 👤 Author

Built by **SHANKS** — [@allenasat044-prog](https://github.com/allenasat044-prog)

> *"Stickers that actually slap."*
