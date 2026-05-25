/**
 * Formats a numeric value into Bangladeshi Taka (৳) formatting.
 * Using South Asian locale ('en-IN') for proper lakh/crore comma separation.
 */
export function formatCurrency(val: number): string {
  if (val === null || val === undefined || isNaN(val)) return '৳0';
  return `৳${Math.round(val).toLocaleString('en-IN')}`;
}
