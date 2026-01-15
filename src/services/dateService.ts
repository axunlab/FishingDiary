import { format, parse, isValid } from 'date-fns';

// Format a date according to the specified format
export function formatDate(date: Date, dateFormat: string = 'dd/MM/yyyy'): string {
  return format(date, dateFormat);
}

// Format time in HH:mm format
export function formatTime(date: Date): string {
  return format(date, 'HH:mm');
}

// Parse a date string
export function parseDate(dateString: string, dateFormat: string = 'dd/MM/yyyy'): Date {
  return parse(dateString, dateFormat, new Date());
}

// Get current date
export function getCurrentDate(): Date {
  return new Date();
}

// Get current time in HH:mm format
export function getCurrentTime(): string {
  return formatTime(new Date());
}

// Validate a date string
export function isValidDate(dateString: string, dateFormat: string = 'dd/MM/yyyy'): boolean {
  const parsedDate = parseDate(dateString, dateFormat);
  return isValid(parsedDate);
}

// Format date and time together
export function formatDateTime(date: Date, time: string, dateFormat: string = 'dd/MM/yyyy'): string {
  return `${formatDate(date, dateFormat)} ${time}`;
}
