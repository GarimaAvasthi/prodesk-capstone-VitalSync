# VitalSync - Care Operations Platform

A modern healthcare workspace for patients, clinicians, and operations teams to manage appointments, records, and day-to-day care with confidence.

## Features

### ✅ Implemented

- **Authentication System** - Firebase-powered registration and login
- **Role-Based Access** - Patient, Doctor, and Admin roles with different permissions
- **Protected Routes** - Middleware-enforced route protection (redirect unauthenticated users to login)
- **User Dashboard** - Personalized dashboard with health metrics and trends
- **Patient Health Records** - View and manage patient health data
- **Global State Management** - Zustand store for auth state persistence
- **Theme Support** - Light/dark mode toggle
- **Responsive Design** - Mobile-first UI with Tailwind CSS
- **Auth Pages** - Login, registration (with role selection), and password recovery flows

### Tech Stack

- **Framework**: Next.js 16.2.3 (App Router with Turbopack)
- **React**: 19.2.4
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: Zustand with localStorage persistence
- **Authentication**: Firebase Authentication
- **Animations**: Framer Motion
- **UI Components**: Lucide React icons
- **Database Charting**: Recharts
- **Fonts**: Manrope (body), Fraunces (headings)

## Project Structure

```
vitalsync-app/
├── app/
│   ├── (auth)/                 # Authentication pages
│   │   ├── login/              # User login (existing users)
│   │   ├── signin/             # Sign up (new users with role selection)
│   │   ├── forgot-password/    # Password recovery
│   │   └── layout.tsx          # Auth layout wrapper
│   ├── dashboard/              # Protected dashboard
│   ├── patient-details/        # Patient health records
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   └── globals.css             # Design tokens & utilities
├── components/
│   ├── AuthShell.tsx           # Reusable auth page layout
│   ├── AuthCard.tsx            # Auth card component
│   ├── DashboardHeader.tsx     # Dashboard header with user info
│   ├── DashboardSidebar.tsx    # Navigation sidebar
│   ├── FormInput.tsx           # Reusable form input
│   ├── ThemeProvider.tsx       # Theme context provider
│   └── ThemeToggle.tsx         # Theme toggle button
├── lib/
│   └── firebase.ts             # Firebase configuration & initialization
├── store/
│   ├── authStore.ts            # Zustand auth store (user, auth state)
│   └── themeStore.ts           # Zustand theme store
├── middleware.ts               # Next.js route protection & auth checks
├── next.config.ts              # Next.js configuration
└── package.json                # Dependencies & scripts
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project with Authentication enabled

### Environment Setup

Create a `.env.local` file in the `vitalsync-app` directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Installation & Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Authentication Flow

### Registration (New Users)
1. Navigate to `/signin`
2. Select role (Patient, Doctor, or Admin)
3. Enter name, email, and password
4. Account created in Firebase
5. User data stored in Zustand + cookies
6. Redirected to `/dashboard`

### Login (Existing Users)
1. Navigate to `/login`
2. Enter email and password
3. Firebase validates credentials
4. User data stored in Zustand + cookies
5. Redirected to `/dashboard`

### Route Protection
- **Middleware** (`middleware.ts`) checks `vitalsync-auth` cookie
- Unauthenticated users accessing protected routes → redirected to `/login`
- Authenticated users accessing auth pages → redirected to `/dashboard`
- Static assets, API routes, and Next.js internals allowed

## Global State (Zustand Store)

### Auth Store (`store/authStore.ts`)

**User Object:**
```typescript
{
  uid: string;
  name: string;
  email: string;
  role: "patient" | "doctor" | "admin";
}
```

**Store Methods:**
- `setUser(user)` - Set authenticated user & save to cookies/localStorage
- `clearUser()` - Clear user data on logout
- `setLoading(bool)` - Update loading state

**Persistence:**
- Stored in localStorage (client-side)
- Synced to cookies for middleware auth checks
- Survives page refresh and browser restart

## Usage Examples

### Access User Data in Components

```typescript
import { useAuthStore } from "@/store/authStore";

export default function MyComponent() {
  const { user, isAuthenticated } = useAuthStore();
  
  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <p>Role: {user?.role}</p>
    </div>
  );
}
```

### Logout

```typescript
import { useAuthStore } from "@/store/authStore";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const handleLogout = async () => {
  await signOut(auth);
  clearUser();
  router.push("/login");
};
```

### Theme Toggle

```typescript
import { useThemeStore } from "@/store/themeStore";

export default function ThemeButton() {
  const { theme, toggleTheme } = useThemeStore();
  
  return (
    <button onClick={toggleTheme}>
      Current: {theme}
    </button>
  );
}
```

## Design System

Custom CSS variables in `globals.css`:

```css
--brand: #0d9488;           /* Teal primary color */
--brand-soft: rgba();        /* Softer brand variant */
--foreground: #0f172a;      /* Text primary */
--muted: #94a3b8;           /* Text secondary */
--line: #e2e8f0;            /* Borders */
--surface-strong: #f8fafc;  /* Card backgrounds */
```

Utility classes:
- `.app-button` - Button styling
- `.app-input` - Input field styling
- `.glass-panel` - Glassmorphic panels
- `.section-shell` - Page container
- `.card-interactive` - Interactive cards

## Key Components

### AuthShell (`components/AuthShell.tsx`)
Reusable authentication page layout with optional side panel. Used by login, registration, and password recovery pages.

### DashboardHeader (`components/DashboardHeader.tsx`)
Displays user name/email from store, role-specific navigation, and logout functionality.

### DashboardSidebar (`components/DashboardSidebar.tsx`)
Main navigation sidebar with role-based menu items.

### FormInput (`components/FormInput.tsx`)
Reusable form input with label, error states, and consistent styling.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues, feature requests, or questions, please open an issue on the project repository.
