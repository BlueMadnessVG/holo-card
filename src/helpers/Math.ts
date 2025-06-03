// * return a value that has been rounded to a set precision
const round = (value: number, precision: number = 3) => parseFloat(value.toFixed(precision));

//  *Return a value that has been limited between min & max
const clamp = (value: number, min: number = 0, max: number = 100) => {
    return Math.min(Math.max(value, min), max);
}

// * return a value that has been re-mapped according to the from/to
const adjust = (value: number, fromMin: number, fromMax: number, toMin: number, toMax: number) => {
    return round(toMin + (toMax - toMin) * (value - fromMin) / (fromMax - fromMin));
}

export { round, clamp, adjust }