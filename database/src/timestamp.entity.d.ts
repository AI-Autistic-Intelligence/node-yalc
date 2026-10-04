import { ClassType, Mixin } from '@node-yalc/types/globals.js';
export declare const YalcEntityWithTimestamps: <T extends ClassType>(base: T) => {
    new (...args: any[]): {
        [x: string]: any;
        createdAt: Date;
        updatedAt: Date;
    };
} & T;
export type YalcEntityWithTimestamps = Mixin<typeof YalcEntityWithTimestamps>;
