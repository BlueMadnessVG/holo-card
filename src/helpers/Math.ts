/**
 * Round `value` to `precision` decimal places.
 * @default precision = 3
 */
export const round = (value: number, precision = 3): number =>
  parseFloat(value.toFixed(precision));

/**
 * Clamp `value` to the range [min, max].
 * @default min = 0, max = 100
 */
export const clamp = (value: number, min = 0, max = 100): number =>
  Math.min(Math.max(value, min), max);

/**
 * Re-map `value` from [fromMin, fromMax] onto [toMin, toMax].
 */
export const adjust = (
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number
): number => round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));

/**
 * Euclidean distance between a point and the centre (50, 50),
 * normalised to [0, 1].
 */
export const distanceFromCenter = (x: number, y: number): number =>
  clamp(Math.sqrt((y - 50) ** 2 + (x - 50) ** 2) / 50, 0, 1);
