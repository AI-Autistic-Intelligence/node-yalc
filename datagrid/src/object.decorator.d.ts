import { FieldMapperProperty, FieldMapper } from '@node-yalc/interfaces';
import { ClassType } from '@node-yalc/types/globals.js';
import { RelationType } from 'typeorm/metadata/types/RelationTypes.js';
import 'reflect-metadata';
export interface DstExtended {
    name: string;
    transformer: {
        (dstObj: Record<any, any>, srcValue: any): void;
    };
}
export declare function isDstExtended(dst: string | DstExtended): dst is DstExtended;
export interface YalcAgGridFieldMetadata extends Omit<FieldMapperProperty, 'dst'> {
    dst?: string | DstExtended;
    src?: string;
    mode?: 'derived' | 'regular' | 'virtual';
    relation?: {
        defaultValue?: any;
        sourceKey: {
            dst: string;
            alias: string;
        };
        targetKey: {
            dst: string;
            alias: string;
        };
        relationType: RelationType;
        type: {
            (): ClassType;
        };
    };
    _propertyName?: string;
}
export declare const YALC_AGGRID_OBJECT_METADATA_KEY: unique symbol;
export declare const YALC_AGGRID_FIELD_METADATA_KEY: unique symbol;
export declare function getPrototype(target: Record<string, unknown> | ClassType): any;
export declare const YalcAgGridField: (options?: YalcAgGridFieldMetadata) => PropertyDecorator;
export declare const getYalcAgGridFieldMetadataList: <T extends YalcAgGridFieldMetadata = YalcAgGridFieldMetadata>(target: Record<string, unknown> | ClassType) => {
    [key: string]: T;
} | undefined;
export declare const hasYalcAgGridFieldMetadataList: (target: Record<string, unknown> | ClassType) => boolean;
export declare const getYalcAgGridFieldMetadata: <T extends YalcAgGridFieldMetadata = YalcAgGridFieldMetadata>(target: Record<string, unknown> | ClassType, propertyName: string | symbol) => T | undefined;
export declare const hasYalcAgGridFieldMetadata: (target: Record<string, unknown> | ClassType, propertyName: string) => boolean;
export declare const YalcAgGridObject: (options?: YalcAgGridObjectOptions) => ClassDecorator;
export declare const getYalcAgGridObjectMetadata: (target: Record<string, unknown> | ClassType) => FilterOption;
export declare const hasYalcAgGridObjectMetadata: (target: Record<string, unknown> | ClassType) => boolean;
export declare enum FilterOptionType {
    INCLUDE = "include",
    EXCLUDE = "exclude"
}
export type FilterOption = {
    type: FilterOptionType;
    fields: string[];
};
export type YalcAgGridObjectOptions = {
    copyFrom?: ClassType;
    filters?: FilterOption;
};
export interface FieldAndFilterMapper {
    field: FieldMapper;
    filterOption?: FilterOption;
    extraInfo?: {
        [key: string]: any;
    };
}
