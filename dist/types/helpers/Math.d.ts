/**
 * Round `value` to `precision` decimal places.
 * @default precision = 3
 */
export declare const round: (value: number, precision?: number) => number;
/**
 * Clamp `value` to the range [min, max].
 * @default min = 0, max = 100
 */
export declare const clamp: (value: number, min?: number, max?: number) => number;
/**
 * Re-map `value` from [fromMin, fromMax] onto [toMin, toMax].
 */
export declare const adjust: (value: number, fromMin: number, fromMax: number, toMin: number, toMax: number) => number;
/**
 * Euclidean distance between a point and the centre (50, 50),
 * normalised to [0, 1].
 */
export declare const distanceFromCenter: (x: number, y: number) => number;
