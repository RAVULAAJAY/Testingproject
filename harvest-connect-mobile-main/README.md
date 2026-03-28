# FarmDirect

FarmDirect is a farmer-to-buyer marketplace built with Vite, React, TypeScript, Tailwind CSS, and shadcn/ui-style components. The application is structured to help farmers list produce directly, help buyers discover and order fresh products without middlemen, and give admins a separate protected dashboard for oversight and moderation.

## Table Of Contents

- [Project Overview](#project-overview)
- [Idea And Goal](#idea-and-goal)
- [How The App Works](#how-the-app-works)
- [Features](#features)
- [Workflow](#workflow)
- [Pages And Modules](#pages-and-modules)
- [Technology Stack](#technology-stack)
- [Languages Used](#languages-used)
- [Data, API, And State](#data-api-and-state)
- [Validation And Rules](#validation-and-rules)
- [Setup](#setup)
- [Scripts](#scripts)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)

## Project Overview

FarmDirect is a role-based marketplace that connects farmers, buyers, and admins in one platform. The project focuses on direct trade, profile verification, product discovery, order handling, chat, notifications, and admin-level platform control.

## Idea And Goal

The core idea is to reduce friction between farmers and buyers by keeping the workflow inside one app:

- farmers can create and manage listings directly
- buyers can search, compare, save, and order produce
- admins can review users, products, orders, and activity logs from a dedicated dashboard

The goal is to make the experience practical, transparent, and easy to operate from both mobile and desktop layouts.

## How The App Works

1. A user opens the landing page and chooses a role.
2. The user signs up or logs in based on the selected role.
3. Farmers complete profile and payment requirements before using farmer tools.
4. Buyers complete signup details and can then browse the marketplace, save favorites, and place orders.
5. Admin access is login-only and uses environment-based credentials.
6. Shared global state and a local API server keep users, products, orders, messages, notifications, and activity logs in sync.

## Features

### Public And Shared Features

- branded landing page and role selection
- responsive layout and navigation
- login and signup flows
- product details pages with farmer context
- messages, chat, delivery, notifications, settings, and profile pages
- PDF export with branded account details and proof support

### Farmer Features

- farmer dashboard
- complete profile workflow
- product listing management
- payment detail setup
- farmer payments page
- proof upload handling
- order and account activity visibility

### Buyer Features

- buyer dashboard
- browse marketplace listings
- search and filter products
- favorites and cart management
- checkout flow
- buyer payment setup
- recent order tracking
- ratings and reviews access

### Admin Features

- login-only admin access
- admin dashboard
- user review and moderation
- product review and deletion
- order status management
- activity log inspection
- transaction and revenue summaries

## Workflow

### Farmer Workflow

1. Choose Farmer during signup.
2. Enter personal and farm information.
3. Upload proof and provide payment details.
4. Complete profile verification if required.
5. Open the farmer dashboard.
6. Add products, update stock, and manage listings.
7. Review orders and payments.

### Buyer Workflow

1. Choose Buyer during signup.
2. Enter account, location, proof, and payment information.
3. Open the buyer dashboard.
4. Explore nearby and trending products.
5. Save favorites or add items to cart.
6. Complete checkout and follow order progress.

### Admin Workflow

1. Sign in with the configured admin credentials.
2. Open the admin dashboard.
3. Review users, listings, orders, and logs.
4. Moderate or remove records when needed.
5. Monitor platform revenue and transactions.

## Pages And Modules

The application is organized across these route-level pages and feature modules:

- [src/pages/Index.tsx](src/pages/Index.tsx)
- [src/pages/DashboardPage.tsx](src/pages/DashboardPage.tsx)
- [src/pages/ProfilePage.tsx](src/pages/ProfilePage.tsx)
- [src/pages/SettingsPage.tsx](src/pages/SettingsPage.tsx)
- [src/pages/OrdersPage.tsx](src/pages/OrdersPage.tsx)
- [src/pages/MessagesPage.tsx](src/pages/MessagesPage.tsx)
- [src/pages/ChatPage.tsx](src/pages/ChatPage.tsx)
- [src/pages/LocationPage.tsx](src/pages/LocationPage.tsx)
- [src/pages/RatingsPage.tsx](src/pages/RatingsPage.tsx)
- [src/pages/DeliveryPage.tsx](src/pages/DeliveryPage.tsx)
- [src/pages/NotificationsPage.tsx](src/pages/NotificationsPage.tsx)
- [src/pages/CompleteProfilePage.tsx](src/pages/CompleteProfilePage.tsx)
- [src/pages/ProductDetailsPage.tsx](src/pages/ProductDetailsPage.tsx)
- [src/pages/Farmer/FarmerDashboardPage.tsx](src/pages/Farmer/FarmerDashboardPage.tsx)
- [src/pages/Farmer/MyListingsPage.tsx](src/pages/Farmer/MyListingsPage.tsx)
- [src/pages/Farmer/AddPaymentDetailsPage.tsx](src/pages/Farmer/AddPaymentDetailsPage.tsx)
- [src/pages/Farmer/FarmerPaymentsPage.tsx](src/pages/Farmer/FarmerPaymentsPage.tsx)
- [src/pages/Buyer/BuyerDashboardPage.tsx](src/pages/Buyer/BuyerDashboardPage.tsx)
- [src/pages/Buyer/BrowseListingsPage.tsx](src/pages/Buyer/BrowseListingsPage.tsx)
- [src/pages/Buyer/CartPage.tsx](src/pages/Buyer/CartPage.tsx)
- [src/pages/Buyer/CheckoutPage.tsx](src/pages/Buyer/CheckoutPage.tsx)
- [src/pages/Buyer/FavoritesPage.tsx](src/pages/Buyer/FavoritesPage.tsx)
- [src/pages/Buyer/AddPaymentPage.tsx](src/pages/Buyer/AddPaymentPage.tsx)
- [src/components/AdminDashboard.tsx](src/components/AdminDashboard.tsx)
- [src/components/EnhancedAuthForm.tsx](src/components/EnhancedAuthForm.tsx)
- [src/components/RoleSelection.tsx](src/components/RoleSelection.tsx)
- [src/components/RoleSelectionSignup.tsx](src/components/RoleSelectionSignup.tsx)
- [src/components/Layout.tsx](src/components/Layout.tsx)
- [src/components/Navbar.tsx](src/components/Navbar.tsx)
- [src/components/Sidebar.tsx](src/components/Sidebar.tsx)

## Technology Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn/ui-style components
- React Router
- React Query
- Express backend for local API data
- jsPDF and jspdf-autotable for PDF export
- Lucide React icons
- Radix UI primitives
- Recharts for charting
- React Hook Form and Zod for form handling and validation support

## Languages Used

- TypeScript for the frontend application
- JavaScript for the local Express server in `server.cjs`
- HTML for the application shell in `index.html`
- CSS through Tailwind CSS and global stylesheet files

## Data, API, And State

The application uses a shared global state layer for:

- users
- products
- orders
- messages
- notifications
- cart items
- favorites
- activity logs

The local API server in `server.cjs` stores data in JSON files under `data/`:

- `data/users.json`
- `data/products.json`
- `data/orders.json`
- `data/activityLogs.json`

The frontend API layer in `src/lib/api.ts` talks to the local backend and the app polls for updates so the UI stays current.

## Validation And Rules

The validation layer covers the most important user inputs:

- email format
- password strength and confirmation
- name and phone number
- location and address
- coordinate validation for farm or buyer location data
- ID proof file type and file size
- profile photo upload for buyer signup
- payment details using bank fields or UPI ID

Admin credentials are not created through signup. They are read from environment variables:

- `VITE_ADMIN_LOGIN_EMAIL`
- `VITE_ADMIN_LOGIN_PASSWORD`

## Branding And Assets

- The product uses the FarmDirect brand name consistently.
- Logo and favicon assets live in `public/`.
- Shared branding is handled through reusable UI components.
- PDF exports and account screens use the local FarmDirect branding assets.

## Setup

```sh
npm install
npm run server
npm run dev
```

If a Vite port is already in use, the dev server will move to the next open port automatically.

## Scripts

```sh
npm run dev
```

Starts the Vite frontend.

```sh
npm run server
```

Starts the local Express API server on port 4000.

```sh
npm run build
```

Builds the production bundle.

```sh
npm run preview
```

Previews the production build locally.

```sh
npm run lint
```

Runs ESLint over the codebase.

## Environment Variables

Create a local `.env.local` file when needed.

- `VITE_API_BASE` - overrides the API base URL
- `VITE_ADMIN_LOGIN_EMAIL` - admin login email
- `VITE_ADMIN_LOGIN_PASSWORD` - admin login password

## Project Structure

```text
harvest-connect-mobile-main/
├── data/                  # JSON-backed local data store
├── public/                # Static assets, favicon, and branding files
├── server.cjs             # Local Express API server
├── src/
│   ├── components/        # Shared UI and feature components
│   ├── context/           # Auth and global state providers
│   ├── hooks/             # Custom hooks
│   ├── lib/               # API, validation, data, and utilities
│   └── pages/             # Route-level screens
├── package.json           # Scripts and dependencies
├── vite.config.ts         # Vite configuration
└── tsconfig*.json         # TypeScript configuration files
```

## Summary

FarmDirect is structured as a complete marketplace application rather than a simple demo. It includes role-based onboarding, proof uploads, profile completion, product listing management, browsing, favorites, cart and checkout flows, delivery and notification tracking, chat, admin moderation, PDF export, and local JSON-backed persistence.
