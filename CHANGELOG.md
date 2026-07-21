# Changelog

All notable changes to FarCarFix are documented here.

## [Unreleased]

## [0.4.0] - 2026-07-21

### Added
- **AI Repair Cost Estimator** — tabbed DIY / local garage / authorized service center pricing with brand multipliers, severity badges and critical warnings
- **Nearby Services Finder** — GPS locator with 7 service type filters, animated map, booking support and Google Maps navigation
- **AI Repair Report** — full structured report with drag-and-drop image upload, WhatsApp / email / print sharing
- **4-Step Mechanic Booking Page** — service type selection, mechanic picker, date/time scheduler and confirmation screen
- **User Profile Page** — vehicle management, service history timeline, notification settings and profile editing
- **Feature Launcher** — post-diagnosis panel to launch cost estimator, nearby services or repair report in one tap
- **Client-side page routing** — home / booking / profile navigation wired across Navbar, Hero, MechanicFinder, FinalCTA and Footer

### Changed
- Diagnosis engine expanded from 5 to 15+ issues (oil leak, smoke, stalling, AC, transmission, fuel, electrical short, alternator, flat tyre, steering, suspension, brake fluid, coolant)
- Navbar updated with Book Mechanic and My Profile buttons
- Hero CTA updated to route to booking page
- Footer Quick Links extended with Booking and Profile

## [0.3.0] - 2026-07-20

### Added
- DiagnosisResult component with GlyphMatrix loading animation
- DiagnosisForm with 4-field autocomplete inputs
- MechanicFinder with booking modal and detail panel
- Vehicle data (brands, models, years, issues)

## [0.2.0] - 2026-07-15

### Added
- Hero section with image carousel and floating metric cards
- Features, HowItWorks, WhyChoose, Stats, Testimonials sections
- FinalCTA and Footer with legal modals

## [0.1.0] - 2026-07-01

### Added
- Initial project scaffold with Vite + React + TypeScript
- Base design system in index.css
