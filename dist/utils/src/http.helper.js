"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHttpStatusDescription = exports.HttpStatusCodes = void 0;
const errors_1 = require("@node-yalc/errors");
const axios_1 = require("axios");
exports.HttpStatusCodes = {
    ...errors_1.HttpStatus,
    ...axios_1.HttpStatusCode,
};
const httpStatusDescriptions = {
    [errors_1.HttpStatus.CONTINUE]: '100: Request received, server awaiting further info.',
    [errors_1.HttpStatus.SWITCHING_PROTOCOLS]: '101: Client asked server to switch protocols.',
    [errors_1.HttpStatus.PROCESSING]: '102: Server processing request, no response yet.',
    [errors_1.HttpStatus.OK]: '200: Request successful and response provided.',
    [errors_1.HttpStatus.CREATED]: '201: Request completed, and resource created.',
    [errors_1.HttpStatus.ACCEPTED]: '202: Request accepted but processing not complete.',
    [errors_1.HttpStatus.NON_AUTHORITATIVE_INFORMATION]: '203: Info from another source returned.',
    [errors_1.HttpStatus.NO_CONTENT]: '204: Request succeeded with no content to send.',
    [errors_1.HttpStatus.RESET_CONTENT]: '205: Client should reset document view.',
    [errors_1.HttpStatus.PARTIAL_CONTENT]: '206: Partial resource returned due to range header.',
    [errors_1.HttpStatus.MOVED_PERMANENTLY]: '301: Resource moved permanently.',
    [errors_1.HttpStatus.FOUND]: '302: Resource temporarily moved, use given URI.',
    [errors_1.HttpStatus.SEE_OTHER]: '303: Response found elsewhere, use GET for that.',
    [errors_1.HttpStatus.NOT_MODIFIED]: '304: Resource not modified since last request.',
    [errors_1.HttpStatus.TEMPORARY_REDIRECT]: '307: Resource temporarily moved, but use same method.',
    [errors_1.HttpStatus.PERMANENT_REDIRECT]: '308: Resource moved permanently, use same method.',
    [errors_1.HttpStatus.BAD_REQUEST]: "400: Server couldn't understand request due to invalid syntax.",
    [errors_1.HttpStatus.UNAUTHORIZED]: '401: Authentication needed for request.',
    [errors_1.HttpStatus.PAYMENT_REQUIRED]: '402: Payment required for this resource.',
    [errors_1.HttpStatus.FORBIDDEN]: '403: Server understood but refuses to authorize.',
    [errors_1.HttpStatus.NOT_FOUND]: "404: Server can't find the requested resource.",
    [errors_1.HttpStatus.METHOD_NOT_ALLOWED]: '405: HTTP method not allowed for resource.',
    [errors_1.HttpStatus.NOT_ACCEPTABLE]: "406: Resource doesn't match criteria.",
    [errors_1.HttpStatus.PROXY_AUTHENTICATION_REQUIRED]: '407: Proxy authentication required.',
    [errors_1.HttpStatus.REQUEST_TIMEOUT]: '408: Server timed out waiting for request.',
    [errors_1.HttpStatus.CONFLICT]: '409: Request conflict with server state.',
    [errors_1.HttpStatus.GONE]: '410: Resource requested is no longer available.',
    [errors_1.HttpStatus.LENGTH_REQUIRED]: '411: Length of request not specified.',
    [errors_1.HttpStatus.PRECONDITION_FAILED]: '412: Precondition for request not met.',
    [errors_1.HttpStatus.PAYLOAD_TOO_LARGE]: '413: Request payload too large.',
    [errors_1.HttpStatus.URI_TOO_LONG]: '414: URI requested is too long.',
    [errors_1.HttpStatus.UNSUPPORTED_MEDIA_TYPE]: '415: Media type not supported.',
    [errors_1.HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE]: '416: Range specified is invalid.',
    [errors_1.HttpStatus.EXPECTATION_FAILED]: "417: Server can't meet request expectation.",
    [errors_1.HttpStatus.I_AM_A_TEAPOT]: "418: I'm a teapot (April Fools joke).",
    [errors_1.HttpStatus.UNPROCESSABLE_ENTITY]: '422: Request understandable, but semantically wrong.',
    [errors_1.HttpStatus.FAILED_DEPENDENCY]: "424: Request failed due to server's previous request.",
    [errors_1.HttpStatus.PRECONDITION_REQUIRED]: '428: Precondition required for request.',
    [errors_1.HttpStatus.TOO_MANY_REQUESTS]: '429: Too many requests from this client.',
    [axios_1.HttpStatusCode.UnavailableForLegalReasons]: '451: Unavailable due to legal reasons.',
    [errors_1.HttpStatus.INTERNAL_SERVER_ERROR]: "500: Server faced an error and can't provide response.",
    [errors_1.HttpStatus.NOT_IMPLEMENTED]: "501: Server doesn't support functionality needed.",
    [errors_1.HttpStatus.BAD_GATEWAY]: '502: Server got invalid response from upstream server.',
    [errors_1.HttpStatus.SERVICE_UNAVAILABLE]: '503: Server not ready to handle request.',
    [errors_1.HttpStatus.GATEWAY_TIMEOUT]: "504: Server didn't get response from another server.",
    [errors_1.HttpStatus.HTTP_VERSION_NOT_SUPPORTED]: "505: Server doesn't support HTTP protocol version.",
};
const getHttpStatusDescription = (status, fallbackDescription = 'Unknown status code') => {
    return httpStatusDescriptions[status] ?? fallbackDescription;
};
exports.getHttpStatusDescription = getHttpStatusDescription;
//# sourceMappingURL=http.helper.js.map