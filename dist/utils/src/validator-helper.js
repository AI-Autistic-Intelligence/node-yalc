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
//# sourceMappingURL=validator-helper.js.map