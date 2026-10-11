export declare const HttpStatusCodes: Record<string, number | string>;
export type HttpStatusCodes = (typeof HttpStatusCodes)[keyof typeof HttpStatusCodes];
export declare const getHttpStatusDescription: (status: HttpStatusCodes, fallbackDescription?: string) => string;
