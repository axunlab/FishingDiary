# Fishing Diary PWA

A Progressive Web App (PWA) for personal fishing diary management that runs locally on iOS devices. All data is stored client-side with no server dependencies.

## Features

- **Offline-First**: All data stored locally using IndexedDB
- **PWA Support**: Install on iOS home screen for native-like experience
- **Privacy-Focused**: No server, no tracking, no data sharing
- **Fishing Entry Management**: Log fishing trips with detailed information
  - Date, time, and location
  - Catch details (species, size, weight)
  - Gear and flies used
  - Weather conditions
  - Notes

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Database**: IndexedDB (via Dexie.js)
- **Date Handling**: date-fns
- **PWA**: vite-plugin-pwa (Workbox)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
fishing-diary/
├── public/              # Static assets and PWA icons
├── src/
│   ├── components/      # React components
│   ├── services/        # Business logic services
│   │   ├── database.ts  # Dexie database configuration
│   │   ├── entryService.ts
│   │   ├── dateService.ts
│   │   └── validationService.ts
│   ├── repositories/    # Data access layer
│   │   ├── entryRepository.ts
│   │   └── settingsRepository.ts
│   ├── types/          # TypeScript type definitions
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main App component
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles
├── index.html
├── vite.config.ts      # Vite configuration
├── tailwind.config.js  # Tailwind configuration
└── tsconfig.json       # TypeScript configuration
```

## PWA Installation on iOS

1. Deploy the app to a hosting service (GitHub Pages, Netlify, Vercel, etc.)
2. Open the URL in Safari on your iPhone
3. Tap the Share button
4. Select "Add to Home Screen"
5. The app will appear on your home screen like a native app

### Required PWA Icons

Before deploying, you need to create the following icons in the `public/` directory:

- `icon-192.png` (192x192 pixels)
- `icon-512.png` (512x512 pixels)
- `apple-touch-icon.png` (180x180 pixels)

You can generate these using tools like:
- [PWA Builder Image Generator](https://www.pwabuilder.com/imageGenerator)
- [Real Favicon Generator](https://realfavicongenerator.net/)

## Database Schema

The app uses IndexedDB with the following structure:

### Object Stores

1. **entries**
   - Key: `id` (UUID)
   - Indexes: `fishingDate`, `locationName`, `createdAt`
   - Stores all fishing entries

2. **settings**
   - Key: `key`
   - Stores app preferences (units, theme, date format)

## Development Roadmap

### Phase 1: Core MVP (Current)
- [x] Setup PWA infrastructure
- [x] Implement IndexedDB layer
- [ ] Create entry form
- [ ] Display entry list
- [ ] Basic edit/delete functionality
- [ ] iOS PWA installation support

### Phase 2: Enhancement
- [ ] Search functionality
- [ ] Settings page (units, theme)
- [ ] Data export feature (JSON)
- [ ] Improved UI/UX polish

### Phase 3: Advanced Features
- [ ] Statistics and insights
- [ ] Location favorites
- [ ] Gear/fly library
- [ ] Photo support

## Performance Targets

- First Contentful Paint: < 1.5s
- Time to Interactive: < 2.5s
- IndexedDB query time: < 50ms
- App bundle size: < 500KB

## Browser Support

- iOS Safari 14.5+
- Chrome/Edge (for testing)
- Best experience in standalone mode (installed as PWA)

## License

ISC

## Architecture

For detailed architecture documentation, see [fishing-diary-architecture.md](fishing-diary-architecture.md)
