function setMappedProperty(mapProperty, inputObject, outputObject, propertyName, outputKey) {
    let options;
    if (mapProperty === true) {
        options = {};
    }
    else {
        options = mapProperty;
    }
    if (options.exclude === true)
        return; // do not map
    outputObject[outputKey] = options.transformer
        ? options.transformer(inputObject, propertyName)
        : inputObject[propertyName];
}
/**
 * This function allows to map 2 Objects with different properties by using
 * a bridge object (the mapper). In this way we can avoid using property decorators
 * that limit the mapping to a single destination, by allowing any mapping combinations.
 *
 */
export function objectMapper(inputObject, mapper, options = {}) {
    const outputObject = {};
    for (const propertyName in inputObject) {
        if (propertyName === '$transformer') {
            const transformer = inputObject[propertyName];
            transformer(inputObject, outputObject);
            continue;
        }
        const mapProperty = mapper[propertyName];
        // handle mapping when properties are not specified but the option is enabled
        if (mapProperty === undefined) {
            // TODO: use an option to enable this  behaviour
            // if (!Object.keys(outputObject).includes(propertyName))
            //   throw new Error(
            //     `Cannot map property ${propertyName} into the OutputObject. Property doesn't exist in the destination`,
            //   );
            if (options.copyNonMappedProperties === true)
                outputObject[propertyName] = inputObject[propertyName];
            continue;
        }
        // handle excluded properties
        if (mapProperty === false)
            continue; // do not map
        // handle simple mapping with a string
        if (typeof mapProperty !== 'object') {
            outputObject[mapProperty] = inputObject[propertyName];
            continue;
        }
        Object.keys(mapProperty).forEach((mapPropertyKey) => {
            // if (typeof mapProperty === 'boolean') {
            //   outputObject[mapPropertyKey as keyof TOutputObject] = inputObject[
            //     propertyName
            //   ] as any;
            //   return;
            // }
            const mapPropertyItem = mapProperty[mapPropertyKey];
            if (!mapPropertyItem)
                return; // do not map (should not happen)
            setMappedProperty(mapPropertyItem, inputObject, outputObject, propertyName, mapPropertyKey);
        });
    }
    return outputObject;
}
//# sourceMappingURL=object-mapper.helper.js.map