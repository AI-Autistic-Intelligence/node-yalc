"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringIsInEnumOrThrow = stringIsInEnumOrThrow;
exports.stringIsInEnum = stringIsInEnum;
const error_enum_js_1 = require("../../errors/src/error.enum.js");
function stringIsInEnumOrThrow(toCheck, enumName, message) {
    if (stringIsInEnum(toCheck, enumName)) {
        return true;
    }
    const err = message ? message : `${error_enum_js_1.ErrorsEnum.INVALID_VALUE} ${toCheck}`;
    throw new Error(err);
}
function stringIsInEnum(toCheck, enumName) {
    for (const enumProperty of Object.values(enumName)) {
        if (typeof enumProperty === 'string' &&
            enumProperty.toLowerCase() === toCheck.toLowerCase()) {
            return true;
        }
    }
    return false;
}
//# sourceMappingURL=validator-helper.js.map