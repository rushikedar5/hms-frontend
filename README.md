# 🏥 Smart Hospital Queue & OPD Management System — Frontend

The frontend client for the Smart Hospital Queue & OPD Management System, built with **Next.js 15, TypeScript, and Tailwind CSS**. Provides role-specific dashboards for Admin, Doctor, Receptionist, and Patient with real-time OPD queue tracking.

> 🔗 Backend Repository: [hms](https://github.com/rushikedar5/hms)

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Auth | JWT (stored and sent via HTTP headers) |
| HTTP Client | Fetch API |

---

## ✨ Features

- **Role-based Dashboards** — dedicated views for Admin, Doctor, Receptionist, and Patient
- **Real-time OPD Queue** — live token status tracking (Waiting → In Progress → Done)
- **JWT Auth Flow** — login, token storage, and protected route handling
- **Medical Records Viewer** — patients can view their immutable visit history
- **Responsive UI** — mobile-friendly layout using Tailwind CSS

---

## 🗂️ Project Structure

```
hms-frontend/
├── public/               # Static assets
├── src/
│   ├── app/              # Next.js App Router pages & layouts
│   ├── components/       # Reusable UI components
│   ├── lib/              # API helpers, auth utils, constants
│   └── types/            # TypeScript interfaces & types
├── components.json       # shadcn/ui config
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 👤 Role-Based Views

| Role | UI Capabilities |
|---|---|
| **Admin** | Manage doctors, receptionists, departments |
| **Doctor** | View assigned OPD queue, update token status, write medical notes |
| **Receptionist** | Register patients, generate tokens, manage daily queue |
| **Patient** | View live token status, access personal medical history |

---

## ⚙️ Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/rushikedar5/hms-frontend.git
   cd hms-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment** — create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔗 Connecting to the Backend

Make sure the [HMS backend](https://github.com/rushikedar5/hms) is running on `http://localhost:8080` before starting the frontend. All API calls are proxied through `NEXT_PUBLIC_API_BASE_URL`.

---

## 🏗️ Build for Production

```bash
npm run build
npm start
```

---

## 🚢 Deployment

The easiest way to deploy is via [Vercel](https://vercel.com):

1. Push the repo to GitHub
2. Import it on Vercel
3. Set the `NEXT_PUBLIC_API_BASE_URL` environment variable to your deployed backend URL
4. Deploy

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
