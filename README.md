# VitalSync — Care Operations Platform

![VitalSync](https://img.shields.io/badge/VitalSync-Care_Operations-0d9488?style=for-the-badge&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth-FFA500?style=for-the-badge&logo=firebase&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-State-333333?style=for-the-badge&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Status](https://img.shields.io/badge/Status-MVP_Complete-22c55e?style=for-the-badge)

---

## Overview

**VitalSync** is a modern healthcare workspace for patients, clinicians, and operations teams to manage appointments, records, and day-to-day care with confidence. The platform features:

✅ **Production-Ready Authentication** — Firebase-powered registration, login, and role-based access control  
✅ **Protected Routes** — Middleware-enforced security with automatic redirects  
✅ **Global State Management** — Zustand store with persistent user sessions  
✅ **Responsive UI** — Mobile-first design with light/dark mode support  
✅ **Role-Based Workflows** — Patient, Doctor, and Admin interfaces  

This project demonstrates a modern healthcare tech stack built with Next.js, React, Firebase, and Tailwind CSS.

Vercel app - "https://vitalsync-app-plum.vercel.app/"
---

## Screens & User Experience

> 🎨 **[View Figma Prototype →](https://www.figma.com/make/C2ASbegP1129BVw4zKZnMB/Role-based-authentication-setup?t=ukguaDpcJa6hL1oI-1)**

UI/UX designed in Figma and implemented in React/Next.js. Design system includes:
- **Teal/Blue accent palette** (#0d9488 primary)
- **Glassmorphic panels** with backdrop blur and smooth animations
- **Custom CSS variables** for consistent theming across light/dark modes
- **Responsive grid layouts** optimized for desktop, tablet, and mobile

### 🔑 Authentication Pages
- **Login** (`/login`) — Sign in for existing users with email/password
- **Sign Up** (`/signin`) — Role-based registration (Patient, Doctor, Admin)
- **Password Recovery** (`/forgot-password`) — Account recovery flow
- **Features:** Error handling, loading states, form validation, smooth animations

### 📊 Dashboard
- **Personalized header** with user name/email from global state
- **Health metrics grid** — Real-time vital signs (heart rate, hydration, activity, sleep)
- **Interactive charts** — Trends visualization with [Recharts](https://recharts.org/)
- **Navigation sidebar** — Role-specific menu items
- **Theme toggle** — Light/dark mode with persistence

### 🩺 Patient Details
- **Role-based access** — Different views for patients and doctors
- **Vital signs display** — Color-coded health indicators
- **Health history** — Timeline of medical events
- **Responsive layout** — Optimized for all screen sizes

---

## Core Features — Implemented ✅

### 1. Authentication System
- **Firebase Integration** — Create account, sign in, password recovery
- **Role Selection** — Patient, Doctor, Admin roles during registration
- **Session Persistence** — Auto-login via secure cookies & localStorage
- **Logout** — Clear auth state and redirect to login

### 2. Route Protection
- **Middleware Guards** — Automatic redirection of unauthenticated users
- **Public Routes** — `/`, `/login`, `/signin`, `/forgot-password`
- **Protected Routes** — `/dashboard`, `/patient-details`
- **Automatic Redirects** — Logged-in users bypass auth pages

### 3. Dashboard
- **User Header** — Display name, email, and role from global state
- **Health Metrics** — Real-time vital signs display
- **Health Trends Chart** — Interactive line chart showing metrics over time
- **Navigation Sidebar** — Role-specific menu items
- **Theme Toggle** — Light/dark mode support

### 4. Patient Health Records
- **Patient Details View** — Comprehensive health data display
- **Appointment History** — Track upcoming and past appointments
- **Vital Signs Grid** — Color-coded health indicators
- **Responsive Layout** — Mobile-optimized interface

### 5. Global State Management
- **Zustand Store** — User data (`uid`, `name`, `email`, `role`)
- **Automatic Persistence** — localStorage + Cookies for session recovery
- **Theme Store** — Separate store for light/dark mode preference
- **Cookie Integration** — Works with Next.js middleware for auth checks

---

## State Management

### Zustand Stores

**Auth Store** (`store/authStore.ts`)
```typescript
interface AuthState {
  user: { uid, name, email, role } | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser(user)
  clearUser()
  setLoading(bool)
}
```

**Theme Store** (`store/themeStore.ts`)
```typescript
interface ThemeState {
  theme: "light" | "dark"
  toggleTheme()
}
```

### Persistence Strategy
- **localStorage** — User data and theme survive page refreshes
- **Cookies** — Authentication state shared with Next.js middleware
- **Automatic Hydration** — Zustand rehydrates on app load
- **Cookie Expiry** — 7-day auth token validity

---

## Technology Stack

| Category | Technology | Version |
|----------|------------|----------|
| Framework | Next.js | 16.2.3 |
| Runtime | React | 19.2.4 |
| Build Tool | Turbopack | Latest |
| Styling | Tailwind CSS | Latest |
| State Management | Zustand | Latest |
| Authentication | Firebase Auth | v10+ |
| Animations | Framer Motion | Latest |
| Charts | Recharts | Latest |
| Icons | Lucide React | Latest |
| Fonts | Manrope + Fraunces | Google Fonts |
| Validation | React Hook Form | Latest |
| HTTP Client | Fetch API | Native |
| Deployment | Vercel | Cloud |

---

## Project Structure

```
vitalsync-app/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Auth route group
│   │   ├── login/page.tsx      # Sign in page
│   │   ├── signin/page.tsx     # Sign up with role selection
│   │   ├── forgot-password/    # Password recovery
│   │   └── layout.tsx          # Auth layout wrapper
│   ├── dashboard/page.tsx      # Main dashboard (protected)
│   ├── patient-details/        # Patient health records (protected)
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Landing page
│   └── globals.css             # Design tokens & utilities
├── components/
│   ├── AuthShell.tsx           # Reusable auth layout
│   ├── DashboardHeader.tsx     # Header with user info
│   ├── DashboardSidebar.tsx    # Navigation sidebar
│   ├── ThemeProvider.tsx       # Theme context
│   ├── ThemeToggle.tsx         # Light/dark mode toggle
│   └── FormInput.tsx           # Reusable form input
├── lib/
│   └── firebase.ts             # Firebase config
├── store/
│   ├── authStore.ts            # Auth state (Zustand)
│   └── themeStore.ts           # Theme state (Zustand)
├── middleware.ts               # Route protection
├── next.config.ts              # Next.js config
└── package.json                # Dependencies

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project with Authentication enabled

### Environment Setup

Create `.env.local` in `vitalsync-app/`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Installation

```bash
cd vitalsync-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)


## Future Enhancements

- Backend API integration (Supabase/PostgreSQL)
- Appointment booking system
- Video consultation (WebRTC)
- Prescription management
- Real-time notifications
- AI symptom checker

---

> **VitalSync** — Care operations that feel calm and clear.
