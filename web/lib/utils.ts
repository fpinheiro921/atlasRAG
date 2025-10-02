import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number to a fixed number of decimal places
 */
export function formatNumber(num: number, decimals: number = 1): string {
  return num.toFixed(decimals);
}

/**
 * Calculate 7-day rolling average from weight entries
 */
export function calculateRollingAverage(weights: number[]): number {
  if (weights.length === 0) return 0;
  const sum = weights.reduce((acc, weight) => acc + weight, 0);
  return sum / weights.length;
}

/**
 * Format date to YYYY-MM-DD string
 */
export function formatDateId(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Get date N days ago
 */
export function getDaysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

/**
 * Calculate percentage change between two values
 */
export function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
}
