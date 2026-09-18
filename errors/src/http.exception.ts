// no imports

export class HttpException extends Error {
  public readonly response: string | Record<string, any>;
  public readonly status: number;
  public readonly options?: Record<string, any>;

  constructor(
    response: string | Record<string, any>,
    status: number,
    options?: Record<string, any>,
  ) {
    super();
    this.response = response;
    this.status = status;
    this.options = options;
    this.initMessage();
    this.initName();
  }
  public static createBody(
    objectOrError: object | string,
    description?: string,
    statusCode?: number,
  ) {
    if (!objectOrError) {
      return { statusCode, message: description };
    }
    return typeof objectOrError === 'object' && !Array.isArray(objectOrError)
      ? objectOrError
      : { statusCode, message: objectOrError, error: description };
  }

  public initMessage() {
    if (typeof this.response === 'string') {
      this.message = this.response;
    } else if (
      this.response &&
      typeof this.response === 'object' &&
      'message' in this.response
    ) {
      this.message = (this.response as any).message;
    } else if (this.constructor) {
      this.message =
        this.constructor.name.match(/[A-Z][a-z]+|[0-9]+/g)?.join(' ') ??
        'Error';
    }
  }

  public initName() {
    this.name = this.constructor.name;
  }

  public getResponse(): string | object {
    return this.response;
  }

  public getStatus(): number {
    return this.status;
  }
}
