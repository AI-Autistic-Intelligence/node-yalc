import { stringIsInEnum } from './validator-helper.js';
export const stringIsInEnumValidatorFactory = (property) => {
    return {
        validate(value) {
            return stringIsInEnum(value, property);
        },
    };
};
//# sourceMappingURL=custom-validator.js.map