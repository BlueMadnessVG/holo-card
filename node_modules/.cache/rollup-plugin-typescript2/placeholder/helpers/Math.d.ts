declare const round: (value: number, precision?: number) => number;
declare const clamp: (value: number, min?: number, max?: number) => number;
declare const adjust: (value: number, fromMin: number, fromMax: number, toMin: number, toMax: number) => number;
export { round, clamp, adjust };
