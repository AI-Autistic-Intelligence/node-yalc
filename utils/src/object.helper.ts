interface IIsObject {
  (item: unknown): boolean;
}

interface IObject {
  [key: string]: unknown;
}

interface IDeepMerge {
  <T extends IObject, U extends IObject>(target: T, ...sources: Array<U>): T & U;
}

/**
 * @description Method to check if an item is an object. Date and Function are considered
 * an object, so if you need to exclude those, please update the method accordingly.
 * @param val - The item that needs to be checked
 * @return {Boolean} Whether or not @item is an object
 */
export const isObject: IIsObject = (val: unknown): val is Record<string, unknown> => {
  return val === Object(val) && !Array.isArray(val);
};

/**
 * @description Method to strictly check if an item is an object. Date and Function are not considered
 * @param val - The item that needs to be checked
 * @returns
 */
export function isObjectStrict(val: unknown): val is Record<string, unknown> {
  return (
    isObject(val) &&
    !Array.isArray(val) &&
    !(val instanceof Date) &&
    !(typeof val === 'function')
  );
}

/**
 * @description Method to perform a deep merge of objects
 * @param isArrayConcat - Whether or not to concatenate arrays
 * @param target - The targeted object that needs to be merged with the supplied @sources
 * @param sources - The source(s) that will be used to update the @target object
 * @return The final merged object
 */
export const _deepMerge = (
  isArrayConcat: boolean,
  target: IObject,
  ...sources: Array<IObject>
): IObject => {
  // return the target if no sources passed
  if (!sources.length) {
    return target;
  }

  const result: IObject = target;

  if (isObject(result)) {
    const len: number = sources.length;

    for (let i = 0; i < len; i += 1) {
      const elm: Record<string, unknown> = sources[i] as Record<string, unknown>;

      if (isObject(elm)) {
        for (const key in elm) {
          if (Object.prototype.hasOwnProperty.call(elm, key)) {
            if (isObject(elm[key]) && typeof elm[key] !== 'function') {
              if (!result[key] || !isObject(result[key])) {
                result[key] = {};
              }
              _deepMerge(isArrayConcat, result[key] as IObject, elm[key] as IObject);
            } else {
              if (
                isArrayConcat &&
                Array.isArray(result[key]) &&
                Array.isArray(elm[key])
              ) {
                // concatenate the two arrays and remove any duplicate primitive values
                result[key] = Array.from(new Set(result[key].concat(elm[key])));
              } else {
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
export const deepMerge: IDeepMerge = <T extends IObject, U extends IObject>(
  target: T,
  ...sources: Array<U>
): T & U => {
  return _deepMerge(true, target, ...sources) as T & U;
};

/**
 * @description Method to perform a deep merge of objects without concatenating arrays
 * @param target - The targeted object that needs to be merged with the supplied @sources
 * @param sources - The source(s) that will be used to update the @target object
 * @returns The final merged object
 */
export const deepMergeWithoutArrayConcat: IDeepMerge = <T extends IObject, U extends IObject>(
  target: T,
  ...sources: Array<U>
): T & U => {
  return _deepMerge(false, target, ...sources) as T & U;
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
export function objectSetProp<T = unknown>(
  obj: Record<string, unknown>,
  path: string,
  value: T,
): Record<string, unknown> {
  let schema = obj as Record<string, unknown>; // a moving reference to internal objects within obj
  const pList = path.split('.');
  const len = pList.length;
  for (let i = 0; i < len - 1; i++) {
    const elem = pList[i];
    if (!schema[elem]) schema[elem] = {};
    schema = schema[elem] as Record<string, unknown>;
  }

  schema[pList[len - 1]] = value;

  return obj;
}

export function objectsHaveSameKeys(...objects: Record<string, unknown>[]) {
  const allKeys = objects.reduce(
    (keys: string[], object: Record<string, unknown>) => keys.concat(Object.keys(object)),
    [] as string[],
  );
  const union = new Set(allKeys);
  return objects.every((object) => union.size === Object.keys(object).length);
}

let count: number = 0;
const idMap: WeakMap<Record<string, unknown> | Array<unknown>, number> =
  new WeakMap<Record<string, unknown> | Array<unknown>, number>();
/**
 * @description Method to get the object id (unique identifier) of an object
 */
export function getObjectId(
  object: Record<string, unknown> | Array<unknown>,
): number {
  const objectId: number | undefined = idMap.get(object);
  if (objectId === undefined) {
    count += 1;
    idMap.set(object, count);

    return count;
  }

  return objectId;
}
