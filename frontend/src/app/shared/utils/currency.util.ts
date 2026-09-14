export function toCurrencyString(value: number | null | undefined): string {
  return (value ?? 0).toFixed(2).replace('.', ',');
}

export function parseCurrencyString(value: string | null | undefined): number {
  if (!value) {
    return 0;
  }
  const normalized = value.replace(/[^\d,]/g, '').replace(',', '.');
  const parsed = Number(normalized);
  return Number.isNaN(parsed) ? 0 : parsed;
}
