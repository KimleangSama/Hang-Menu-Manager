import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const getNAIfNull = (value: string | undefined | null) => value ?? 'N/A'

export const getCurrencyLabel = (currency: string | undefined | null) => {
  switch (currency) {
    case 'dollar':
      return "$";
    case 'riel':
      return "R";
    default:
      return "Unknown Currency";
  }
};

export const getStatusLabel = (status: string | undefined | null) => {
  switch (status) {
    case 'pending':
      return "Pending";
    case 'preparing':
      return "Preparing";
    case 'ready':
      return "Ready";
    case 'delivered':
      return "Delivered";
    case 'canceled':
      return "Canceled";
    case 'completed':
      return "Completed";
    default:
      return "Unknown Status";
  }
};

export function filterDuplicateEntryMessage(toastMessage: string): string {
  const regex = /Key \((.*?)\)=\((.*?)\) already exists\./;
  const match = toastMessage.match(regex);

  if (match) {
    const field = match[1];
    const value = match[2];
    return `The ${field} '${value}' is already in use. Please use a different value.`;
  }

  return "An unknown error occurred. Please try again.";
}
