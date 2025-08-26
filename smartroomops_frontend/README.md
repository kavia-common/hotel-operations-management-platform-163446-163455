# SmartRoomOps Frontend

A modern, clean, minimalistic React dashboard for hotel operations with TailwindCSS.

## Features
- Housekeeping and Management dashboards
- Real-time-like room tracking with demo data
- Task/checklist management with photo uploads
- Notifications panel (urgent rooms, guest requests)
- Analytics with Recharts (efficiency, completion, quality)
- Simple forecasting and supervisor verification
- No login required (authentication removed)

## Setup
1. Copy environment example and edit values as needed:
   cp .env.example .env

2. Install dependencies:
   npm install

3. Start development server:
   npm start

## Environment Variables
- REACT_APP_API_BASE_URL: Backend REST base URL (e.g., http://localhost:8000)
- REACT_APP_WEBSOCKET_URL: WebSocket base URL for real-time updates (e.g., ws://localhost:8000)
- REACT_APP_SITE_URL: Public site URL for email redirects if needed

## Mock Data Mode
- The app ships with realistic sample/mock data that powers all dashboards, room views, tasks, notifications, and forecasting so the UI is meaningful without a backend.
- By default, mock mode is enabled and all API requests are handled by the frontend mocks. You can disable mock mode by calling `setMockMode(false)` from `src/services/api.js` (e.g., in a future initialization file) when a backend is available.

## Notes
- Styling uses TailwindCSS utility classes for a minimal, responsive layout.
- Authentication and protected routes have been removed; users can access all features directly.
