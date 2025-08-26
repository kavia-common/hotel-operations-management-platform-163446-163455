# SmartRoomOps Frontend

A modern, clean, minimalistic React dashboard for hotel operations with TailwindCSS.

## Features
- Housekeeping and Management dashboards
- Real-time room tracking (WebSocket)
- Task/checklist management with photo uploads
- Notifications panel (urgent rooms, guest requests)
- Analytics with Recharts (efficiency, completion, quality)
- Role-based access (Housekeeping, Supervisor, Manager)
- Simple forecasting and supervisor verification

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

## Notes
- This is a prototype; API endpoints are assumed to exist on the backend.
- Styling uses TailwindCSS utility classes for a minimal, responsive layout.
