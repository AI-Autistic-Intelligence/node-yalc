"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpStatusCodeToErrors = void 0;
const error_class_js_1 = require("./error.class.js");
const http_status_enum_js_1 = require("./http-status.enum.js");
exports.httpStatusCodeToErrors = {
    [http_status_enum_js_1.HttpStatus.BAD_REQUEST]: error_class_js_1.BadRequestError,
    [http_status_enum_js_1.HttpStatus.UNAUTHORIZED]: error_class_js_1.UnauthorizedError,
    [http_status_enum_js_1.HttpStatus.FORBIDDEN]: error_class_js_1.ForbiddenError,
    [http_status_enum_js_1.HttpStatus.NOT_FOUND]: error_class_js_1.NotFoundError,
    [http_status_enum_js_1.HttpStatus.CONFLICT]: error_class_js_1.ConflictError,
    [http_status_enum_js_1.HttpStatus.INTERNAL_SERVER_ERROR]: error_class_js_1.InternalServerError,
    [http_status_enum_js_1.HttpStatus.PAYMENT_REQUIRED]: error_class_js_1.PaymentRequiredError,
    [http_status_enum_js_1.HttpStatus.METHOD_NOT_ALLOWED]: error_class_js_1.MethodNotAllowedError,
    [http_status_enum_js_1.HttpStatus.GONE]: error_class_js_1.GoneError,
    [http_status_enum_js_1.HttpStatus.UNSUPPORTED_MEDIA_TYPE]: error_class_js_1.UnsupportedMediaTypeError,
    [http_status_enum_js_1.HttpStatus.UNPROCESSABLE_ENTITY]: error_class_js_1.UnprocessableEntityError,
    [http_status_enum_js_1.HttpStatus.TOO_MANY_REQUESTS]: error_class_js_1.TooManyRequestsError,
    [http_status_enum_js_1.HttpStatus.NOT_IMPLEMENTED]: error_class_js_1.NotImplementedError,
    [http_status_enum_js_1.HttpStatus.BAD_GATEWAY]: error_class_js_1.BadGatewayError,
    [http_status_enum_js_1.HttpStatus.SERVICE_UNAVAILABLE]: error_class_js_1.ServiceUnavailableError,
    [http_status_enum_js_1.HttpStatus.GATEWAY_TIMEOUT]: error_class_js_1.GatewayTimeoutError,
};
//# sourceMappingURL=http-status-code-to-errors.js.map