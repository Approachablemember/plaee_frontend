/**
 * Ensure probability is within valid range (0-1)
 */
export function clampProbability(value: number): number {
  return Math.max(0, Math.min(1, value));
}

/**
 * Convert price string to number
 */
export function parsePrice(price: string | number): number {
  if (typeof price === 'number') return price;
  return parseFloat(price) || 0;
}

/**
 * Simulate realistic price movement
 */
export function simulatePriceChange(currentPrice: number): number {
  // Random walk with mean reversion
  const volatility = 0.02; // 2% volatility
  const meanReversion = 0.1; // Pull towards 0.5
  const midpoint = 0.5;
  
  const randomChange = (Math.random() - 0.5) * volatility;
  const meanReversionForce = (midpoint - currentPrice) * meanReversion * 0.01;
  
  const newPrice = currentPrice + randomChange + meanReversionForce;
  return clampProbability(newPrice);
}
