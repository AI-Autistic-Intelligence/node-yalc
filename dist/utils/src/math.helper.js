export function isScientificNotation(num) {
    const scientificPattern = /^[+-]?\d+(\.\d+)?[eE][+-]?\d+$/;
    return scientificPattern.test(num.toString());
}
//# sourceMappingURL=math.helper.js.map