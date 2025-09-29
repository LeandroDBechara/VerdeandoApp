export const normalizePhotoUrl = (photo?: string): string | undefined => {
    if (!photo) return undefined;
    const trimmed = String(photo).trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    const base = process.env.EXPO_PUBLIC_API_URL;
    if (trimmed.startsWith('/')) return `${base}${trimmed}`;
    return `${base}/${trimmed}`;
}