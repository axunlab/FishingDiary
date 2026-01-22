# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fishing Diary is a Progressive Web App (PWA) for personal fishing diary management. It's a client-only React application targeting iOS Safari, with all data stored locally in IndexedDB (no server dependencies).

**Current Status**: Phase 1 MVP complete - core CRUD operations implemented, deployed to GitHub Pages.

## Build & Development Commands

```bash
npm run dev       # Start Vite dev server (http://localhost:5173)
npm run build     # TypeScript check + Vite production build
npm run preview   # Preview production build locally
npm run deploy    # Build and deploy to GitHub Pages
```

**Note**: No testing infrastructure is currently configured. TypeScript strict mode is the primary code quality mechanism.

## Tech Stack

- **React 19** with TypeScript 5.9
- **Vite 7** for build tooling
- **Tailwind CSS 4** for styling
- **Dexie.js** for IndexedDB wrapper
- **date-fns** for date formatting
- **vite-plugin-pwa** for PWA/service worker support

## Architecture

The app follows a four-layer architecture with clear separation of concerns:

```
UI Layer (components/)
    ↓
Application Logic (hooks/, services/)
    ↓
Data Access (repositories/)
    ↓
IndexedDB (via Dexie)
```

### Key Directories

- `src/components/` - React UI components (EntryForm, EntryList, EntryDetail, Settings)
- `src/hooks/` - Custom React hooks for state management (useEntries, useSettings)
- `src/services/` - Business logic (entryService, validationService, dateService, database)
- `src/repositories/` - IndexedDB data access abstraction
- `src/types/` - TypeScript interfaces for all data models

### State Management

App.tsx is the main routing hub, managing view state ('list' | 'add' | 'edit' | 'detail' | 'settings') and coordinating data flow. State is managed via React hooks (useState + custom hooks), not Redux/Zustand.

### Database Schema

Two IndexedDB object stores:
- **entries** - Fishing entries with indexes on `fishingDate`, `locationName`, `createdAt`
- **settings** - App preferences (units, theme, date format)

## PWA Configuration

- Base URL: `/FishingDiary/` (GitHub Pages)
- Service worker with cache-first strategy
- Standalone display mode for iOS
- Required icons: icon-192.png, icon-512.png, apple-touch-icon.png (in public/)

## Key Files

- `fishing-diary-architecture.md` - Detailed technical architecture and roadmap
- `src/types/index.ts` - All data model definitions (FishingEntry, Catch, WeatherCondition, AppSettings)
- `src/services/database.ts` - Dexie database initialization and schema
- `src/App.tsx` - Main component with view routing and navigation
