export const belongsToEnum = (enumObj, value) => {
    return Object.values(enumObj).includes(value);
};
export const mergeEnums = (...enums) => {
    let merged = {};
    enums.forEach((e) => (merged = { ...merged, ...e }));
    return merged;
};
export const getEnumValueByEnumKey = (myEnum, enumKey) => {
    if (!enumKey)
        return undefined;
    const idx = Object.keys(myEnum).find((x) => x === enumKey);
    return idx ? myEnum[idx] : undefined;
};
//# sourceMappingURL=enum.helper.js.map