export function isNativeClass(func, className) {
    return (typeof func === 'function' &&
        func.prototype?.constructor === func &&
        (className ? func.name === className : true));
}
export function isES6Class(func, className) {
    return (typeof func === 'function' &&
        /^class\s/.test(func.toString()) &&
        (className ? func.name === className : true));
}
export function isClass(func, className) {
    return isNativeClass(func, className) || isES6Class(func, className);
}
//# sourceMappingURL=class.helper.js.map