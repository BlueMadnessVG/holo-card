// * return a value that has been rounded to a set precision
var round = function (value, precision) {
    if (precision === void 0) { precision = 3; }
    return parseFloat(value.toFixed(precision));
};
//  *Return a value that has been limited between min & max
var clamp = function (value, min, max) {
    if (min === void 0) { min = 0; }
    if (max === void 0) { max = 100; }
    return Math.min(Math.max(value, min), max);
};
// * return a value that has been re-mapped according to the from/to
var adjust = function (value, fromMin, fromMax, toMin, toMax) {
    return round(toMin + (toMax - toMin) * (value - fromMin) / (fromMax - fromMin));
};
export { round, clamp, adjust };
