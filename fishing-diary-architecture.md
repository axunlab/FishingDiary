# Personal Fishing Diary - Reference Architecture

## 1. Overview

A Progressive Web App (PWA) for personal fishing diary management that runs locally on iOS devices. The application stores all data client-side with no server dependencies, authentication, or sharing capabilities.

**Version**: 1.0 (Proof of Concept)  
**Target Platform**: iOS (iPhone) via PWA  
**Architecture Style**: Single Page Application (SPA)

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    iOS Safari Browser                    │
│  ┌───────────────────────────────────────────────────┐  │
│  │           Fishing Diary PWA (SPA)                 │  │
│  │                                                   │  │
│  │  ┌──────────────┐  ┌──────────────┐             │  │
│  │  │  UI Layer    │  │  Service     │             │  │
│  │  │  (React/Vue) │  │  Worker      │             │  │
│  │  └──────┬───────┘  └──────┬───────┘             │  │
│  │         │                  │                     │  │
│  │  ┌──────▼──────────────────▼───────┐            │  │
│  │  │   Application Logic Layer       │            │  │
│  │  │   (Business Logic)               │            │  │
│  │  └──────┬──────────────────────────┘            │  │
│  │         │                                        │  │
│  │  ┌──────▼──────────────────────────┐            │  │
│  │  │   Data Access Layer              │            │  │
│  │  └──────┬──────────────────────────┘            │  │
│  │         │                                        │  │
│  │  ┌──────▼──────────────────────────┐            │  │
│  │  │   IndexedDB (Local Storage)     │            │  │
│  │  └─────────────────────────────────┘            │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Technology Stack

**Frontend Framework**: 
- React 18+ or Vue 3+ (recommend React for broader ecosystem)
- TypeScript for type safety

**UI Components**:
- Tailwind CSS for styling
- shadcn/ui or similar component library for iOS-friendly UI

**State Management**:
- React Context API + useReducer (for React)
- Or Pinia (for Vue)
- Keep it simple for POC

**Local Storage**:
- IndexedDB (via Dexie.js wrapper for easier API)
- LocalStorage for app preferences only

**PWA Features**:
- Workbox for service worker generation
- Web App Manifest for install prompt

**Build Tools**:
- Vite (fast, modern bundler)
- PWA plugin for Vite

**Date/Time Handling**:
- date-fns or Day.js (lightweight)

---

## 3. Data Model

### 3.1 Core Entities

#### FishingEntry
```typescript
interface FishingEntry {
  id: string;                    // UUID
  createdAt: Date;               // Auto-generated timestamp
  updatedAt: Date;               // Auto-updated timestamp
  
  // When & Where
  fishingDate: Date;             // Date of fishing trip
  fishingTime: string;           // Time (HH:mm format)
  locationName: string;          // e.g., "Smith River - North Pool"
  locationLabel?: string;        // Optional additional label
  
  // Catch Details
  catches: Catch[];              // Array of fish caught
  
  // Gear & Flies
  gearUsed: string;              // Free text
  fliesUsed: string;             // Free text (comma-separated or free form)
  
  // Weather
  weather: WeatherCondition;
  
  // Optional notes
  notes?: string;
}

interface Catch {
  species: string;               // Fish species
  size?: number;                 // Length in cm or inches
  weight?: number;               // Weight in kg or lbs
  unit: 'metric' | 'imperial';   // Unit system used
}

interface WeatherCondition {
  temperature?: number;          // In Celsius or Fahrenheit
  conditions: string;            // e.g., "Sunny", "Overcast", "Rainy"
  windSpeed?: number;            // Optional
  windDirection?: string;        // Optional (N, NE, E, etc.)
}
```

#### AppSettings
```typescript
interface AppSettings {
  preferredUnits: 'metric' | 'imperial';
  theme: 'light' | 'dark' | 'auto';
  dateFormat: string;            // e.g., "DD/MM/YYYY" or "MM/DD/YYYY"
}
```

### 3.2 IndexedDB Schema

**Database Name**: `fishingDiary`  
**Version**: 1

**Object Stores**:

1. `entries`
   - keyPath: `id`
   - Indexes:
     - `fishingDate` (for chronological sorting)
     - `locationName` (for location-based queries)
     - `createdAt` (for recent entries)

2. `settings`
   - keyPath: `key`
   - Single document store for app preferences

---

## 4. Application Architecture

### 4.1 Layer Breakdown

#### 4.1.1 UI Layer (Presentation)
**Responsibilities**:
- Render views and handle user interactions
- Form validation and user feedback
- Responsive design for iPhone screens

**Key Components**:
- `EntryForm`: Add/Edit fishing entries
- `EntryList`: Display all entries in chronological order
- `EntryDetail`: View single entry details
- `SearchView`: Optional search functionality
- `SettingsView`: App preferences

#### 4.1.2 Application Logic Layer
**Responsibilities**:
- Business logic and data transformations
- Date/time formatting
- Validation rules
- State management

**Key Modules**:
- `entryService`: CRUD operations for fishing entries
- `validationService`: Input validation
- `dateService`: Date/time utilities
- `exportService`: Future export functionality (CSV/JSON)

#### 4.1.3 Data Access Layer
**Responsibilities**:
- Abstract IndexedDB operations
- Provide consistent API for data operations
- Handle errors and offline scenarios

**Key Modules**:
- `database.ts`: IndexedDB initialization and configuration
- `entryRepository.ts`: Data access methods for entries
- `settingsRepository.ts`: Settings persistence

---

## 5. Key Features Implementation

### 5.1 Add Entry Flow

```
User Action → Form Validation → Create Entry Object → 
Store in IndexedDB → Update UI → Show Confirmation
```

**Key Considerations**:
- Auto-fill current date/time with option to edit
- Form should be optimized for quick entry
- Validation should be non-blocking where possible

### 5.2 View Entries

**Default View**: Chronological list (newest first)

**Display Format**:
```
[Date] [Time] - [Location]
[Species] - [Size/Weight]
[Weather icon/summary]
```

**Sorting Options**:
- Date (newest/oldest)
- Location (alphabetical)

### 5.3 Edit/Delete Entry

- Tap entry to view details
- Edit button opens form with pre-filled data
- Delete with confirmation prompt
- Optimistic UI updates

### 5.4 Search (Optional)

**Search Criteria**:
- Location name
- Species
- Date range
- Gear/flies used

**Implementation**: 
- Client-side filtering of IndexedDB results
- Use indexes for better performance

---

## 6. PWA Implementation

### 6.1 Manifest Configuration

```json
{
  "name": "Fishing Diary",
  "short_name": "Fishing",
  "description": "Personal fishing diary and log",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#ffffff",
  "theme_color": "#0ea5e9",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 6.2 Service Worker Strategy

**Caching Strategy**: Cache-First
- Cache all app assets (HTML, CSS, JS)
- Runtime caching for any external resources

**Offline Capability**:
- All features work offline (since no server dependency)
- Data persists in IndexedDB
- Service worker ensures app loads offline

---

## 7. iOS-Specific Considerations

### 7.1 Install to Home Screen

- Provide clear instructions for "Add to Home Screen"
- Use iOS-specific meta tags:
  ```html
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="apple-mobile-web-app-title" content="Fishing Diary">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  ```

### 7.2 UI/UX Optimization

- Use safe area insets for notched iPhones
- Bottom navigation for thumb-friendly access
- Large tap targets (minimum 44x44pt)
- Native-like transitions and animations
- Pull-to-refresh gesture

### 7.3 Data Persistence

- IndexedDB has good support in iOS Safari 14+
- Consider backup/export feature to prevent data loss
- No iCloud sync (would require native app)

---

## 8. Security & Privacy

### 8.1 Data Security

- All data stored locally on device
- No network requests (except for initial app load)
- No tracking or analytics
- No third-party services

### 8.2 Data Export (Recommended Future Feature)

- Export to JSON for backup
- Email export option
- Import from JSON for data restoration

---

## 9. Development Roadmap

### Phase 1: Core MVP (POC)
- [ ] Setup PWA infrastructure
- [ ] Implement IndexedDB layer
- [ ] Create entry form (all mandatory fields)
- [ ] Display entry list
- [ ] Basic edit/delete functionality
- [ ] iOS PWA installation support

### Phase 2: Enhancement
- [ ] Search functionality
- [ ] Settings page (units, theme)
- [ ] Data export feature
- [ ] Improved UI/UX polish

### Phase 3: Advanced Features (Future)
- [ ] Statistics and insights
- [ ] Location favorites
- [ ] Gear/fly library
- [ ] Photo support

---

## 10. Technical Specifications

### 10.1 Browser Requirements

- iOS Safari 14.5+ (for good IndexedDB and PWA support)
- Standalone mode recommended for best experience

### 10.2 Performance Targets

- First Contentful Paint: < 1.5s
- Time to Interactive: < 2.5s
- IndexedDB query time: < 50ms (for typical dataset)
- App size: < 500KB (initial bundle)

### 10.3 Data Limits

- IndexedDB storage: Typically 500MB+ available on iOS
- Recommended max entries: 10,000+ (performance should remain good)

---

## 11. Example File Structure

```
fishing-diary/
├── public/
│   ├── manifest.json
│   ├── icon-192.png
│   ├── icon-512.png
│   └── apple-touch-icon.png
├── src/
│   ├── components/
│   │   ├── EntryForm.tsx
│   │   ├── EntryList.tsx
│   │   ├── EntryDetail.tsx
│   │   ├── SearchView.tsx
│   │   └── Settings.tsx
│   ├── services/
│   │   ├── database.ts
│   │   ├── entryService.ts
│   │   ├── validationService.ts
│   │   └── dateService.ts
│   ├── repositories/
│   │   ├── entryRepository.ts
│   │   └── settingsRepository.ts
│   ├── types/
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useEntries.ts
│   │   └── useSettings.ts
│   ├── utils/
│   │   └── constants.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## 12. Deployment

### 12.1 Hosting Options (for POC)

1. **GitHub Pages** (Free, simple)
2. **Netlify** (Free tier, continuous deployment)
3. **Vercel** (Free tier, optimized for SPAs)

### 12.2 Build Process

```bash
npm run build        # Creates optimized production build
npm run preview      # Test production build locally
```

### 12.3 Testing on iOS

1. Deploy to hosting service
2. Access URL from iPhone Safari
3. Test "Add to Home Screen"
4. Verify offline functionality
5. Test all features in standalone mode

---

## 13. Conclusion

This architecture provides a solid foundation for a personal fishing diary PWA that meets all mandatory requirements while remaining simple enough for a proof of concept. The use of modern web technologies ensures good performance and user experience on iOS devices, while the offline-first approach guarantees data privacy and reliability.

**Next Steps**:
1. Set up development environment
2. Initialize Vite + React + TypeScript project
3. Implement IndexedDB layer with Dexie.js
4. Build core UI components
5. Test on iPhone
6. Deploy and iterate

