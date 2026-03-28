# Testingproject

This repository contains the FarmDirect application in the `harvest-connect-mobile-main/` folder.

FarmDirect is a farmer-to-buyer marketplace built with Vite, React, TypeScript, Tailwind CSS, and shadcn/ui-style components. It supports role-based onboarding, farmer product management, buyer shopping flows, admin moderation, local API-backed data, proof uploads, PDF export, chat, notifications, and location-based discovery.

## What Is In This Repo

- `harvest-connect-mobile-main/` - the main FarmDirect application
- `vercel.json` - root deployment routing configuration
- `.vscode/` - workspace settings

## Main Project

For the full project documentation, setup steps, workflow details, feature list, and architecture notes, open:

- [FarmDirect README](harvest-connect-mobile-main/README.md)

## Quick Start

```sh
cd harvest-connect-mobile-main
npm install
npm run server
npm run dev
```

## Key Features

- farmer signup, login, profile completion, listings, and payments
- buyer signup, login, browsing, cart, checkout, favorites, and orders
- admin login-only access and moderation dashboard
- product details, ratings, reviews, chat, delivery, notifications, and settings
- local JSON-backed API for users, products, orders, and activity logs

## Stack

- TypeScript
- React
- Vite
- Tailwind CSS
- Express
- React Router
- React Query
- jsPDF
- Lucide React

## Notes

- The root README exists so GitHub shows project documentation at the repository level.
- The full application code and deeper documentation live in `harvest-connect-mobile-main/`.
