export declare const HttpStatusCodes: Record<string, any>;
export type HttpStatusCodes = (typeof HttpStatusCodes)[keyof typeof HttpStatusCodes];
export declare const getHttpStatusDescription: (status: HttpStatusCodes, fallbackDescription?: string) => string;
