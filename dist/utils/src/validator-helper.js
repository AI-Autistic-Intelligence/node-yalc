import { ErrorsEnum } from '../../errors/src/error.enum.js';
export function stringIsInEnumOrThrow(toCheck, enumName, message) {
    if (stringIsInEnum(toCheck, enumName)) {
        return true;
    }
    const err = message ? message : `${ErrorsEnum.INVALID_VALUE} ${toCheck}`;
    throw new Error(err);
}
export function stringIsInEnum(toCheck, enumName) {
    for (const enumProperty of Object.values(enumName)) {
        if (typeof enumProperty === 'string' &&
            enumProperty.toLowerCase() === toCheck.toLowerCase()) {
            return true;
        }
    }
    return false;
}
export class ValidationError extends Error {
    constructor(param, message) {
        super(message);
        this.param = param;
        this.name = 'ValidationError';
    }
}
/**
 * Validates integer parameters within strict allow-listed bounds.
 */
export function parseBoundedInt(raw, name, min, max) {
    if (raw === null || raw === undefined || raw.trim() === '') {
        throw new ValidationError(name, `Parameter '${name}' is required.`);
    }
    if (!/^-?\d+$/.test(raw)) {
        throw new ValidationError(name, `Parameter '${name}' must be an integer.`);
    }
    const val = Number.parseInt(raw, 10);
    if (val < min || val > max) {
        throw new ValidationError(name, `Parameter '${name}' must be between ${min} and ${max}.`);
    }
    return val;
}
export function parseOptionalInt(raw, name, min, max) {
    if (raw === null || raw === undefined || raw.trim() === '')
        return undefined;
    return parseBoundedInt(raw, name, min, max);
}
//# sourceMappingURL=validator-helper.js.map