# Waraqah & Jitha Frontend

Waraqah & Jitha is a modern e-commerce and artisan marketplace frontend built with React, TypeScript, and Vite. The application supports customer browsing and purchasing experiences, including product discovery, cart flow, checkout, order tracking, wishlist management, and account authentication, while also providing an admin dashboard for managing catalog and operational data.

The project follows a feature-based architecture under `src/features`, with reusable UI components and API modules designed to integrate with a separate backend service.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- React Router DOM
- TanStack React Query
- Axios
- Zustand
- Framer Motion
- Zod + React Hook Form
- ESLint

## Prerequisites

Before running the project locally, make sure you have the following installed:

- Node.js >= 18.x
- npm >= 9.x (or yarn/pnpm if preferred)
- Git
- A running backend API that exposes the storefront and admin endpoints

## Installation & Local Setup Guide

1. Clone the repository:

```bash
git clone https://github.com/No2rProgram2ing/Waraqh_w_githa_frontend.git
cd waraqah_w_jitha
```

2. Install dependencies:

```bash
npm install
```

3. Start the Vite development server:

```bash
npm run dev
```

4. Open the application in your browser. By default, Vite will run at:

```text
http://localhost:5173
```

For testing from another device or local network, expose the server:

```bash
npm run dev -- --host 0.0.0.0
```

Then access it via your machine's local IP, for example:

```text
http://192.168.1.10:5173
```

## Environment Variables Configuration

Create a `.env` file in the project root and configure the API base URL for the backend:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

You may also use a hosted API URL in production or staging environments:

```env
VITE_API_BASE_URL=https://api.example.com/api
```

Notes:

- The frontend expects the backend to be available at the configured API URL.
- When testing on a local network, use the machine IP or the backend host address instead of `localhost` if the API is being accessed from another device.
- If the environment variable is missing, the app will fall back to `/api`, but a proper configured value is recommended for production reliability.

## Production Build & Deployment

To create a production bundle:

```bash
npm run build
```

This generates a `dist` folder containing the optimized static assets ready for deployment.

Common deployment targets include:

- Vercel
- Netlify
- GitHub Pages
- Any static hosting provider compatible with Vite builds

After building, upload the contents of the `dist` folder to your chosen hosting platform or configure the platform to deploy directly from the repository.

## Project Structure

```text
src/
├── api/                 # Shared API clients and request wrappers
├── components/          # Reusable UI components
├── config/              # Runtime config values
├── features/            # Feature-based modules (auth, products, cart, orders, etc.)
├── layouts/             # Page layout wrappers
├── lib/                 # Utility helpers and shared logic
├── pages/               # Generic application pages
├── providers/           # App-wide providers
├── routes/              # Route configuration and guards
├── utils/               # Validation and helper utilities
├── App.tsx              # App bootstrap
├── main.tsx             # Entry point
└── vite-env.d.ts        # Vite environment typing
```

This repository is designed for a frontend-only workflow and is intended to work alongside a separate backend service that exposes the product, auth, cart, and order APIs.
