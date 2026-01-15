// Core data model types for Fishing Diary

export interface FishingEntry {
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

export interface Catch {
  species: string;               // Fish species
  size?: number;                 // Length in cm or inches
  weight?: number;               // Weight in kg or lbs
  unit: 'metric' | 'imperial';   // Unit system used
}

export interface WeatherCondition {
  temperature?: number;          // In Celsius or Fahrenheit
  conditions: string;            // e.g., "Sunny", "Overcast", "Rainy"
  windSpeed?: number;            // Optional
  windDirection?: string;        // Optional (N, NE, E, etc.)
}

export interface AppSettings {
  preferredUnits: 'metric' | 'imperial';
  theme: 'light' | 'dark' | 'auto';
  dateFormat: string;            // e.g., "DD/MM/YYYY" or "MM/DD/YYYY"
}

// Form data types (for editing/creating entries)
export type FishingEntryFormData = Omit<FishingEntry, 'id' | 'createdAt' | 'updatedAt'>;

// Filter and search types
export interface EntryFilters {
  locationName?: string;
  species?: string;
  dateFrom?: Date;
  dateTo?: Date;
  gearUsed?: string;
  fliesUsed?: string;
}

export type SortField = 'fishingDate' | 'locationName' | 'createdAt';
export type SortOrder = 'asc' | 'desc';
