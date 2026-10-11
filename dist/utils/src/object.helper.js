/**
 * @description Method to check if an item is an object. Date and Function are considered
 * an object, so if you need to exclude those, please update the method accordingly.
 * @param val - The item that needs to be checked
 * @return {Boolean} Whether or not @item is an object
 */
export const isObject = (val) => {
    return val === Object(val) && !Array.isArray(val);
};
/**
 * @description Method to strictly check if an item is an object. Date and Function are not considered
 * @param val - The item that needs to be checked
 * @returns
 */
export function isObjectStrict(val) {
    return (isObject(val) &&
        !Array.isArray(val) &&
        !(val instanceof Date) &&
        !(typeof val === 'function'));
}
/**
 * @description Method to perform a deep merge of objects
 * @param isArrayConcat - Whether or not to concatenate arrays
 * @param target - The targeted object that needs to be merged with the supplied @sources
 * @param sources - The source(s) that will be used to update the @target object
 * @return The final merged object
 */
export const _deepMerge = (isArrayConcat, target, ...sources) => {
    // return the target if no sources passed
    if (!sources.length) {
        return target;
    }
    const result = target;
    if (isObject(result)) {
        const len = sources.length;
        for (let i = 0; i < len; i += 1) {
            const elm = sources[i];
            if (isObject(elm)) {
                for (const key in elm) {
                    if (Object.prototype.hasOwnProperty.call(elm, key)) {
                        if (isObject(elm[key]) && typeof elm[key] !== 'function') {
                            if (!result[key] || !isObject(result[key])) {
                                result[key] = {};
                            }
                            _deepMerge(isArrayConcat, result[key], elm[key]);
                        }
                        else {
                            if (isArrayConcat &&
                                Array.isArray(result[key]) &&
                                Array.isArray(elm[key])) {
                                // concatenate the two arrays and remove any duplicate primitive values
                                result[key] = Array.from(new Set(result[key].concat(elm[key])));
                            }
                            else {
                                result[key] = elm[key];
                            }
                        }
                    }
                }
            }
        }
    }
    return result;
};
/**
 * @description Method to perform a deep merge of objects
 * @param target - The targeted object that needs to be merged with the supplied @sources
 * @param sources - The source(s) that will be used to update the @target object
 * @returns The final merged object
 */
export const deepMerge = (target, ...sources) => {
    return _deepMerge(true, target, ...sources);
};
/**
 * @description Method to perform a deep merge of objects without concatenating arrays
 * @param target - The targeted object that needs to be merged with the supplied @sources
 * @param sources - The source(s) that will be used to update the @target object
 * @returns The final merged object
 */
export const deepMergeWithoutArrayConcat = (target, ...sources) => {
    return _deepMerge(false, target, ...sources);
};
/**
 * Utils to patch a nested property on an object
 * specifying a dot-separated path.
 * If the parent properties do not exist, they will be created
 *
 * @param obj the object to patch
 * @param path the path of the property to set, e.g: "foo.bar.baz"
 * @param value the value to set
 * @returns the patched object
 */
export function objectSetProp(obj, path, value) {
    let schema = obj; // a moving reference to internal objects within obj
    const pList = path.split('.');
    const len = pList.length;
    for (let i = 0; i < len - 1; i++) {
        const elem = pList[i];
        if (!schema[elem])
            schema[elem] = {};
        schema = schema[elem];
    }
    schema[pList[len - 1]] = value;
    return obj;
}
export function objectsHaveSameKeys(...objects) {
    const allKeys = objects.reduce((keys, object) => keys.concat(Object.keys(object)), []);
    const union = new Set(allKeys);
    return objects.every((object) => union.size === Object.keys(object).length);
}
let count = 0;
const idMap = new WeakMap();
/**
 * @description Method to get the object id (unique identifier) of an object
 */
export function getObjectId(object) {
    const objectId = idMap.get(object);
    if (objectId === undefined) {
        count += 1;
        idMap.set(object, count);
        return count;
    }
    return objectId;
}
//# sourceMappingURL=object.helper.js.map