import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}


export function tryParseFloat(value: string): number | null {
    try {
        return parseFloat(value);
    } catch (error) {
        return null;
    }
}
export function tryParseURL(value: string): URL | null {
    try {
        return new URL(value);
    } catch (error) {
        return null;
    }
}

export function tryParseInt(value: string): number | null {
    try {
        return parseInt(value);
    } catch (error) {
        return null;
    }
}

export function isValidUUID(value: string): boolean {
    return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value);
}

export function localeDate(date: Date, locale :string) {
    return date.toLocaleString(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export function localeDateShort(date: Date, locale :string) {
    return date.toLocaleString(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}
export function withSearchParameters(url: URL, key: string, value: string): URL {
    const urlString = url.toString();
    const newUrl = new URL(urlString);
    newUrl.searchParams.set(key, value);
    return newUrl;
}