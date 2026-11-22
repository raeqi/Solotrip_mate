// Utility to generate stable IDs (avoids hydration mismatch)
let idCounter = 0;

export function generateId(prefix: string = 'id'): string {
    return `${prefix}-${++idCounter}`;
}

export function resetIdCounter(): void {
    idCounter = 0;
}
