export class HttpException extends Error {
    constructor(response, status, options) {
        super();
        this.response = response;
        this.status = status;
        this.options = options;
        this.initMessage();
        this.initName();
    }
    initMessage() {
        if (typeof this.response === 'string') {
            this.message = this.response;
        }
        else if (this.response &&
            typeof this.response === 'object' &&
            'message' in this.response) {
            this.message = this.response.message;
        }
        else if (this.constructor) {
            this.message =
                this.constructor.name.match(/[A-Z][a-z]+|[0-9]+/g)?.join(' ') ??
                    'Error';
        }
    }
    initName() {
        this.name = this.constructor.name;
    }
    getResponse() {
        return this.response;
    }
    getStatus() {
        return this.status;
    }
}
//# sourceMappingURL=http.exception.js.map