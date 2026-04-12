/**
 * Coerces a server money value (string or number) to a plain JS number.
 * The API returns decimal strings like "10000.00".
 */
function toNumber(amount: string | number): number {
  return typeof amount === "string" ? parseFloat(amount) : amount;
}

/**
 * Formats a monetary amount as a localised MMK price string.
 * Accepts both numeric amounts and decimal strings from the server.
 * @param amount - amount in kyat as a number or string e.g. "10000.00"
 * @returns e.g. "10,000 MMK"
 */
export function formatPrice(amount: string | number): string {
  return `${toNumber(amount).toLocaleString("en-US")} MMK`;
}

/**
 * Sums an array of prices (numeric or string).
 * @param prices - array of amounts as numbers or decimal strings
 * @returns total amount as a number
 */
export function calculateTotal(prices: (string | number)[]): number {
  return prices.reduce<number>((sum, p) => sum + toNumber(p), 0);
}
