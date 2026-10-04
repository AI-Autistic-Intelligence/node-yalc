import { isClass } from '@node-yalc/utils/class.helper.js';
import 'reflect-metadata';
export function isDstExtended(dst) {
    const _dst = dst;
    return !!_dst.name && !!_dst.transformer;
}
export const YALC_AGGRID_OBJECT_METADATA_KEY = Symbol('AGGRID_OBJECT_METADATA_KEY');
export const YALC_AGGRID_FIELD_METADATA_KEY = Symbol('AGGRID_FIELD_METADATA_KEY');
export function getPrototype(target) {
    return isClass(target) || !target.prototype ? target : target.prototype;
}
export const YalcAgGridField = (options = {}) => {
    return (target, property) => {
        const classConstructor = target.constructor;
        const propertyName = property.toString();
        const metadata = Reflect.getMetadata(YALC_AGGRID_FIELD_METADATA_KEY, classConstructor) || {};
        const newMetadata = { ...metadata };
        newMetadata[propertyName] = {
            dst: propertyName,
            src: propertyName,
            ...options,
            _propertyName: propertyName,
        };
        Reflect.defineMetadata(YALC_AGGRID_FIELD_METADATA_KEY, newMetadata, classConstructor);
    };
};
export const getYalcAgGridFieldMetadataList = (target) => {
    return Reflect.getMetadata(YALC_AGGRID_FIELD_METADATA_KEY, getPrototype(target));
};
export const hasYalcAgGridFieldMetadataList = (target) => {
    return Reflect.hasMetadata(YALC_AGGRID_FIELD_METADATA_KEY, getPrototype(target));
};
export const getYalcAgGridFieldMetadata = (target, propertyName) => {
    const metadata = getYalcAgGridFieldMetadataList(target);
    const name = propertyName.toString();
    if (!metadata || !metadata[name])
        return undefined;
    return metadata[name];
};
export const hasYalcAgGridFieldMetadata = (target, propertyName) => {
    const metadata = Reflect.getMetadata(YALC_AGGRID_FIELD_METADATA_KEY, getPrototype(target));
    return metadata && !!metadata[propertyName];
};
export const YalcAgGridObject = (options) => {
    return (target) => {
        let metadata = options ?? {};
        if (metadata.copyFrom) {
            const copyFrom = metadata.copyFrom;
            metadata = { ...metadata, ...getYalcAgGridObjectMetadata(copyFrom) };
            const fieldMetadata = { ...getYalcAgGridFieldMetadataList(copyFrom) };
            Reflect.defineMetadata(YALC_AGGRID_FIELD_METADATA_KEY, fieldMetadata, target);
        }
        Reflect.defineMetadata(YALC_AGGRID_OBJECT_METADATA_KEY, metadata, target);
    };
};
export const getYalcAgGridObjectMetadata = (target) => {
    return Reflect.getMetadata(YALC_AGGRID_OBJECT_METADATA_KEY, getPrototype(target));
};
export const hasYalcAgGridObjectMetadata = (target) => {
    return Reflect.hasMetadata(YALC_AGGRID_OBJECT_METADATA_KEY, getPrototype(target));
};
export var FilterOptionType;
(function (FilterOptionType) {
    FilterOptionType["INCLUDE"] = "include";
    FilterOptionType["EXCLUDE"] = "exclude";
})(FilterOptionType || (FilterOptionType = {}));
//# sourceMappingURL=object.decorator.js.map