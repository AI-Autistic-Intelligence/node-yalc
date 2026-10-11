export function returnValue(value) {
    return () => value;
}
export function returnAsyncValue(value) {
    return async () => value;
}
/**
 * Helper function for typeorm decorators
 */
export const returnProperty = (property) => {
    return (relationEntity) => relationEntity[property];
};
export default returnValue;
//# sourceMappingURL=returnValue.js.map