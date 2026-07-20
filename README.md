# FarCarFix — AI-Powered Roadside Assistance

FarCarFix is a modern AI-powered car diagnostics and roadside assistance web application built with React, TypeScript, and Vite.

## Features

- **AI Diagnosis Engine** — Identifies 15+ car issues from symptoms including engine knock, brake wear, overheating, oil leaks, transmission problems, AC failure, flat tyres, electrical faults, and more
- **AI Repair Cost Estimator** — Shows DIY, local garage, and authorized service center pricing with brand-based multipliers
- **Nearby Services Finder** — GPS-based locator for mechanics, fuel stations, towing, tyre shops, battery services, and auto parts stores
- **AI Repair Report** — Generates a full downloadable report with image upload, step-by-step DIY guide, cost summary, and WhatsApp/email/print sharing
- **4-Step Mechanic Booking** — Book emergency, garage, home, or towing services with mechanic selection and time slot scheduling
- **User Profile Page** — Manage vehicles, view service history, configure notification settings

## Tech Stack

- React 18 + TypeScript
- Vite 6
- Framer Motion (animations)
- Lucide React (icons)
- Plain CSS design system (no Tailwind in JSX)

## Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`

## Build

```bash
npm run build
```

## Project Structure

```
src/
├── App.tsx                  # Root with page routing
├── index.css                # Design system & global styles
├── features.css             # Feature component styles
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── Features.tsx
│   ├── HowItWorks.tsx
│   ├── WhyChoose.tsx
│   ├── Stats.tsx
│   ├── Testimonials.tsx
│   ├── DiagnosisForm.tsx
│   ├── DiagnosisResult.tsx  # AI diagnosis + feature launcher
│   ├── RepairCostEstimator.tsx
│   ├── NearbyServices.tsx
│   ├── RepairReport.tsx     # Includes image upload
│   ├── MechanicFinder.tsx
│   ├── BookingPage.tsx      # 4-step booking flow
│   ├── UserProfilePage.tsx  # Profile, vehicles, history
│   ├── FinalCTA.tsx
│   ├── Footer.tsx
│   └── GlyphMatrix.tsx
└── data/
    └── vehicleData.ts
```
