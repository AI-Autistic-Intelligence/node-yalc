export declare class HttpException extends Error {
    readonly response: string | Record<string, any>;
    readonly status: number;
    readonly options?: Record<string, any>;
    constructor(response: string | Record<string, any>, status: number, options?: Record<string, any>);
    static createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
    initMessage(): void;
    initName(): void;
    getResponse(): string | object;
    getStatus(): number;
}
