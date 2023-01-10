export const sanitizeDate = (date: string) => new Date(date).toISOString().substring(0, 10);
