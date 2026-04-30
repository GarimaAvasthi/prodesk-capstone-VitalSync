# VitalSync  
is a full-stack healthcare operations dashboard built as a capstone project. It gives **Patients**, **Doctors**, and **Admins** a role-specific workspace to manage their data — all backed by a live cloud database.

![VitalSync](https://img.shields.io/badge/VitalSync-Care_Operations-0d9488?style=for-the-badge&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth_%26_Firestore-FFA500?style=for-the-badge&logo=firebase&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-State_Management-333333?style=for-the-badge&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-Data_Viz-22c55e?style=for-the-badge&logoColor=white)
![Status](https://img.shields.io/badge/Status-Capstone_Complete-0d9488?style=for-the-badge)

> **Live Demo →** [https://vitalsync-app-plum.vercel.app](https://vitalsync-app-plum.vercel.app)
> **Figma Prototype →** [View Design](https://www.figma.com/make/C2ASbegP1129BVw4zKZnMB/Role-based-authentication-setup?t=ukguaDpcJa6hL1oI-1)

---



The app demonstrates every core concept of modern web development:
- **Authentication** — Real Firebase Auth 
- **CRUD** — Create, read, update, delete data with instant UI updates
- **Data Visualization** — Live charts that react to real database changes
- **Role-Based Access** — Three completely different dashboards from one login
- **Route Protection** — Middleware prevents unauthorized access

---

## Role Overview

| Role | What they can do |
|---|---|
| 🧑‍⚕️ **Patient** | Live Health Vitals Tracker · Manage personal tasks · AI Health Assistant |
| 🩺 **Doctor** | Full patient record CRUD · Care Team management · Live admission analytics |
| 🛡️ **Admin** | System Operations Monitoring · Global User Directory · Staff roster CRUD |

---

## Feature Checklist

### 🔐 Authentication (Firebase Auth)
- [x] Register with name, email, password, and role selection
- [x] Login with email + password (real Firebase — no bypass)
- [x] Forgot password → email reset link via Firebase
- [x] Session persists across page refreshes (Zustand + localStorage + cookies)
- [x] Logout clears all session data
- [x] Wrong credentials → specific, clear error messages (not a generic fail)
- [x] Middleware route guard — unauthenticated users redirected to `/login`
- [x] Authenticated users auto-redirected away from `/login`/`/signin`

### 🧑‍⚕️ Patient Dashboard
- [x] Personalized greeting using name from Firebase Auth
- [x] **PatientHealthTracker** — Real-time editable chronic disease metrics (BP, Blood Sugar, Heart Rate, Weight)
- [x] **Task CRUD** — Add, edit, delete personal tasks saved to Firestore
- [x] Tasks filtered by `user.uid` — each patient sees **only their own tasks**
- [x] Real-time task list via `onSnapshot` — instant UI updates without refresh
- [x] Status badges: 🟡 To Do · 🔵 In Progress · ✅ Done
- [x] **TaskStatsChart** — Bar chart of tasks by status + animated progress bar (live data)
- [x] **AI Assistant** — Global floating chatbot powered by Google Gemini for health workspace support

### 🩺 Doctor Dashboard
- [x] Stat panels: Patients today, Avg wait, Telehealth sessions, Urgent flags
- [x] **Patient CRUD** — Add, edit, delete patient records saved to Firestore
- [x] **Care Team Page** — Dedicated workspace for staff roster and department distribution
- [x] Real-time patient list via `onSnapshot`
- [x] Edit modal pre-fills existing patient data
- [x] **Vital Sign Trends** — Interactive area chart for biometric monitoring

### 🛡️ Admin Dashboard
- [x] Stat panels: Active clinics, Daily appointments, Staff onboarded, Satisfaction
- [x] **Operations Page** — Live system health monitor (Uptime, API latency, Audit Log)
- [x] **AdminUserDirectory** — Global visibility of all registered users (Doctor, Patient, Admin)
- [x] **Staff CRUD** — Add, edit, delete staff records (name, role, department)
- [x] **StaffDeptChart** — Bar chart of staff by department with color-coded legend pills (live data)

### 🌐 Landing Page
- [x] Animated hero section with Framer Motion
- [x] Platform features section
- [x] Role cards (Patients, Clinicians, Operations)
- [x] Responsive sticky navbar with mobile hamburger menu
- [x] Live metric stats

### 🎨 UI / UX
- [x] Full dark / light mode toggle (persisted)
- [x] Glassmorphic panel design system
- [x] Responsive — mobile, tablet, desktop
- [x] Smooth micro-animations (fade-up, scale-in, float)
- [x] Sidebar with role badge and role-filtered navigation links
- [x] Cross-page link: Login ↔ Create account ↔ Forgot password

---

## Technology Stack

| Category | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Runtime | React 19 |
| Styling | Tailwind CSS v4 + Custom CSS variables |
| State Management | Zustand (persist middleware) |
| Authentication | Firebase Auth |
| Database | Firebase Firestore |
| AI | Google Gemini AI |
| Charts | Recharts (AreaChart, BarChart) |
| Animations | Framer Motion |
| Icons | Lucide React |
| Fonts | Manrope + Fraunces (Google Fonts) |
| Deployment | Vercel |

---

## Project Structure

```
vitalsync-app/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          
│   │   ├── signin/page.tsx         
│   │   ├── forgot-password/        
│   │   └── layout.tsx
│   ├── dashboard/page.tsx         
│   ├── patient-details/page.tsx    
│   ├── layout.tsx
│   ├── page.tsx                   
│   └── globals.css                
├── components/
│   ├── AuthShell.tsx               
│   ├── DashboardSidebar.tsx        
│   ├── PatientCRUD.tsx             
│   ├── StaffCRUD.tsx               
│   ├── TaskCRUD.tsx                
│   ├── AnalyticsChart.tsx          
│   ├── TaskStatsChart.tsx          
│   ├── StaffDeptChart.tsx          
│   ├── AppointmentBooking.tsx      
│   ├── ThemeProvider.tsx
│   └── ThemeToggle.tsx
├── lib/
│   └── firebase.ts                 
├── store/
│   ├── authStore.ts                
│   └── themeStore.ts               
├── middleware.ts                       
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A Firebase project with **Authentication** (Email/Password) and **Firestore** enabled

### Environment Setup

Create `.env.local` inside `vitalsync-app/`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Run Locally

```bash
cd vitalsync-app
npm install
npm run dev
```

Open [http://localhost:3000]

### Firestore Collections

The app writes to three Firestore collections automatically:

| Collection | Created by | Fields |
|---|---|---|
| `tasks` | Patient | `title`, `status`, `dueDate`, `patientId`, `createdAt` |
| `patients` | Doctor | `name`, `visitReason`, `time`, `room`, `createdAt` |
| `staff` | Admin | `name`, `role`, `department`, `createdAt` |

---

## Security Notes

-  only accounts registered through Firebase can log in
- each patient's tasks are scoped to their `uid` via Firestore `where()` queries
-  server-side cookie check blocks unauthenticated access to all `/dashboard` and `/patient-details` routes
- Firebase error codes are mapped to specific, user-friendly messages (not raw Firebase output)

---

> **VitalSync** — Care operations that feel calm and clear.
