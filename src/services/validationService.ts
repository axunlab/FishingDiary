import { FishingEntryFormData } from '../types';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Validate fishing entry form data
export function validateFishingEntry(data: FishingEntryFormData): ValidationResult {
  const errors: ValidationError[] = [];

  // Validate fishing date
  if (!data.fishingDate) {
    errors.push({ field: 'fishingDate', message: 'Fishing date is required' });
  }

  // Validate fishing time
  if (!data.fishingTime) {
    errors.push({ field: 'fishingTime', message: 'Fishing time is required' });
  } else if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(data.fishingTime)) {
    errors.push({ field: 'fishingTime', message: 'Time must be in HH:mm format' });
  }

  // Validate location name
  if (!data.locationName || data.locationName.trim().length === 0) {
    errors.push({ field: 'locationName', message: 'Location name is required' });
  }

  // Validate gear used
  if (!data.gearUsed || data.gearUsed.trim().length === 0) {
    errors.push({ field: 'gearUsed', message: 'Gear used is required' });
  }

  // Validate flies used
  if (!data.fliesUsed || data.fliesUsed.trim().length === 0) {
    errors.push({ field: 'fliesUsed', message: 'Flies used is required' });
  }

  // Validate weather conditions
  if (!data.weather.conditions || data.weather.conditions.trim().length === 0) {
    errors.push({ field: 'weather.conditions', message: 'Weather conditions are required' });
  }

  // Validate catches
  if (!data.catches || data.catches.length === 0) {
    errors.push({ field: 'catches', message: 'At least one catch is required' });
  } else {
    data.catches.forEach((catch_, index) => {
      if (!catch_.species || catch_.species.trim().length === 0) {
        errors.push({
          field: `catches[${index}].species`,
          message: `Species is required for catch ${index + 1}`
        });
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Validate a single field
export function validateField(fieldName: string, value: any): ValidationError | null {
  switch (fieldName) {
    case 'locationName':
      if (!value || value.trim().length === 0) {
        return { field: fieldName, message: 'Location name is required' };
      }
      break;
    case 'fishingTime':
      if (!value) {
        return { field: fieldName, message: 'Fishing time is required' };
      }
      if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
        return { field: fieldName, message: 'Time must be in HH:mm format' };
      }
      break;
    // Add more field validations as needed
  }
  return null;
}
