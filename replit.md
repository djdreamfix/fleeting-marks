# Fleeting Marks

## Overview

Fleeting Marks is a real-time, anonymous map marker application built with React. Users can place temporary markers on a map that automatically expire after 30 minutes. The app features real-time synchronization across clients using WebSocket connections, offline detection, dark/light theme support, and PWA capabilities for mobile installation.

The application is designed primarily for Ukrainian users (UI is in Ukrainian) and provides a simple, privacy-focused way to share temporary location-based information.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite with PWA plugin for service worker generation
- **Routing**: React Router DOM for client-side navigation
- **State Management**: TanStack React Query for server state, React hooks for local state
- **Styling**: Tailwind CSS with shadcn/ui component library (Radix UI primitives)
- **Animations**: Framer Motion for UI transitions
- **Map**: Leaflet with react-leaflet bindings for OpenStreetMap display

### Backend Architecture
- **Server**: Express.js serving both API endpoints and static files
- **Real-time**: Socket.IO for WebSocket-based marker synchronization
- **Pattern**: The server acts as a simple relay - markers are broadcast to all connected clients via WebSocket events (`marker:created`, `marker:removed`)

### Key Design Decisions

1. **Ephemeral Data Model**: Markers are designed to be temporary (30-minute TTL). The current implementation has placeholder storage (returns empty array), requiring proper persistence to be added.

2. **Real-time First**: WebSocket is the primary data sync mechanism. The REST API (`/api/markers`) is secondary, used for initial data fetch and marker creation.

3. **PWA Support**: Full offline detection, service worker caching of map tiles, and installable app manifest for mobile users.

4. **Component Architecture**: UI components are split between custom app components (`src/components/`) and reusable shadcn/ui primitives (`src/components/ui/`).

### File Structure
- `server.js` - Express + Socket.IO backend
- `src/pages/` - Page components (Index, NotFound)
- `src/components/` - Application-specific React components
- `src/components/ui/` - shadcn/ui component library
- `src/hooks/` - Custom React hooks (geolocation, markers, theme, online status)
- `src/types/` - TypeScript type definitions

## External Dependencies

### Third-Party Services
- **OpenStreetMap**: Map tile provider (`https://{s}.tile.openstreetmap.org`)
- **External Backend**: The app currently connects to `https://fleeting-marks.onrender.com` for API and WebSocket - this is the deployed version of `server.js`

### Database Requirements
- **Current State**: No persistent storage implemented - server returns empty array for markers
- **Needed**: Redis (ioredis is already in dependencies) or similar for marker storage with TTL support

### Key NPM Dependencies
- `socket.io` / `socket.io-client` - Real-time communication
- `leaflet` / `react-leaflet` - Map display
- `ioredis` - Redis client (installed but not yet utilized)
- `express` - HTTP server
- Radix UI primitives - Accessible UI components
- `framer-motion` - Animations