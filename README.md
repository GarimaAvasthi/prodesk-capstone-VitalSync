# 🩺 VitalSync: Healthcare Patient Dashboard

![VitalSync Banner](https://img.shields.io/badge/VitalSync-Intelligent_Healthcare-0052CC?style=for-the-badge&logo=health&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Status](https://img.shields.io/badge/Status-In_Development-FF8C00?style=for-the-badge)

## 📌 Abstract / Product Requirements Document (PRD)

The growing demand for accessible, efficient, and patient-centric healthcare services underscores the importance of intelligent digital solutions that bridge the gap between patients and healthcare providers. 

**VitalSync** is a modern, premium hospital management interface designed to streamline healthcare delivery. This product aims to replace fragmented legacy hospital management systems with an intuitive, unified dashboard that balances the complex needs of both patients and doctors with an uncompromising focus on modern aesthetics, glassmorphic design, and frictionless user experiences. 

This README serves as the complete **Product Requirements Document (PRD)** outlining the technical architecture, UI/UX designs, core features, and state management strategies.

---

## 🎨 UI/UX Design System (Figma)

The designs for VitalSync were heavily graded on aesthetics, leveraging sleek dark modes, vibrant blue/teal accent hues, modern typography (Inter), and subtle glassmorphic elements throughout.

🔗 **[View the Complete Figma Design File Here](https://www.figma.com/file/placeholder-vitalsync-designs/VitalSync-Design-System)**


#### 1. Login Page
The login page features secure role-based authentication (Patient vs. Doctor vs. Admin).
<br>
![Login Page Layout](/docs/images/login.png)

#### 2. Main Dashboard
The main dashboard serves as the command center. For patients, it shows upcoming appointments and health summaries. For doctors, it highlights real-time availability queues and pending patient reviews.
<br>
![Main Dashboard Layout](/docs/images/dashboard.png)

#### 3. Patient Details Page
This view is heavily focused on data visualization, featuring a chronological medical history timeline, vital metrics, and an active prescriptions viewer.
<br>
![Patient Details Page Layout](/docs/images/details.png)

---

## 🚀 Core Features (Frontend Focus)

The platform offers a comprehensive digital solution separating concerns via Role-Based Access Control (RBAC).

### 👨‍⚕️ Patient Portal
- **Appointment Booking:** Browse available doctors, pick an open time slot, and confirm a booking (mocked `POST /api/appointments/book`).
- **Medical History Timeline:** A vertical timeline of past diagnoses and hospital visits, populated from mocked data.
- **Prescriptions Viewer:** Active and archived prescriptions displayed with drug name and dosage, organized in tabs.
- **Upcoming Appointments Widget:** A simple card list on the dashboard showing the next scheduled visits.

### 👩‍⚕️ Doctor Dashboard
- **Availability Toggle:** A single on/off toggle that updates the doctor's status (mocked `PUT /api/doctors/:id/availability`).
- **Today's Patient Queue:** A static list of scheduled patients for the day with their appointment time and reason.
- **Patient Detail View:** Clicking a patient row opens their medical history and active prescriptions in a side panel.

### 🛠️ Global / UI Utilities
- Role-based routing: protected routes redirect unauthenticated users to the login page.
- Dark/Light mode toggle with centralized CSS custom properties.
- Fully responsive layout.

### ⚡ Advanced Features

#### 1. Health Analytics Chart Panel
The patient dashboard includes a dedicated **Analytics section** powered by [Recharts](https://recharts.org/).
It renders two visualizations from mocked data:
- A **bar chart** showing appointment frequency by month over the past 6 months.
- A **line chart** tracking a rolling health metric (e.g., blood pressure readings over time).

This is a pure frontend feature — the chart data is seeded locally in the Redux store from a mock JSON file, so no backend is needed. It gives the app a genuinely data-rich feel while staying entirely within scope.

#### 2. Debounced Global Search
A search bar in the top navigation fires a query across **doctors, appointments, and medical history simultaneously**, but only after the user stops typing for **300ms** (debounced via `lodash.debounce` or a `useDebounce` custom hook).

Results are grouped by category (Doctors / Appointments / History) and rendered in a floating dropdown. This avoids excessive re-renders on every keystroke and demonstrates real-world performance thinking — a common interview talking point.

---

## 🧠 State Management & API Design

To handle the complex global state between user sessions, dynamic appointments, and real-time availability, we use **Redux Toolkit** (or Zustand). Below is the proposed State Tree Diagram and Mock API architecture.

### State Tree Diagram

The store is organized into **6 slices**, each mapped to its own domain with isolated state and API responsibilities.

![VitalSync Redux Store State Tree](/docs/images/state_tree.png)


### Mock API Strategies (JSON Server / MSW)
We will be utilizing Fake endpoints to mock the backend integration.
1. `GET /api/doctors` -> Returns list of doctors and their real-time availability boolean.
2. `POST /api/appointments/book` -> Mocks a booking, validates time conflicts, and returns a 201 status.
3. `GET /api/patients/{id}/prescriptions` -> Fetches the active list of medications to populate the Details Page.

---

## 🖥️ Technology Stack

- **Frontend Core**: React.js / Next.js
- **Styling**: Tailwind CSS, Vanilla CSS for Glassmorphism overrides
- **State Management**: Redux Toolkit (or Zustand)
- **Data Fetching & Mocking**: Axios, MSW (Mock Service Worker) for fake API endpoints
- **Icons & Typography**: Phosphor Icons / FontAwesome, Google Inter Font

---

## 🔮 Future Enhancements
- WebRTC integration for direct Telehealth video consultations.
- AI-powered symptom checker before escalating to a doctor.
- Push notifications for appointment reminders.

---

> **VitalSync** - Syncing the pulse of modern healthcare. 

