"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHttpStatusDescription = exports.HttpStatusCodes = void 0;
const http_status_enum_js_1 = require("@node-yalc/errors/http-status.enum.js");
const axios_1 = require("axios");
exports.HttpStatusCodes = {
    ...http_status_enum_js_1.HttpStatus,
    ...axios_1.HttpStatusCode,
};
const httpStatusDescriptions = {
    [http_status_enum_js_1.HttpStatus.CONTINUE]: '100: Request received, server awaiting further info.',
    [http_status_enum_js_1.HttpStatus.SWITCHING_PROTOCOLS]: '101: Client asked server to switch protocols.',
    [http_status_enum_js_1.HttpStatus.PROCESSING]: '102: Server processing request, no response yet.',
    [http_status_enum_js_1.HttpStatus.OK]: '200: Request successful and response provided.',
    [http_status_enum_js_1.HttpStatus.CREATED]: '201: Request completed, and resource created.',
    [http_status_enum_js_1.HttpStatus.ACCEPTED]: '202: Request accepted but processing not complete.',
    [http_status_enum_js_1.HttpStatus.NON_AUTHORITATIVE_INFORMATION]: '203: Info from another source returned.',
    [http_status_enum_js_1.HttpStatus.NO_CONTENT]: '204: Request succeeded with no content to send.',
    [http_status_enum_js_1.HttpStatus.RESET_CONTENT]: '205: Client should reset document view.',
    [http_status_enum_js_1.HttpStatus.PARTIAL_CONTENT]: '206: Partial resource returned due to range header.',
    [http_status_enum_js_1.HttpStatus.MOVED_PERMANENTLY]: '301: Resource moved permanently.',
    [http_status_enum_js_1.HttpStatus.FOUND]: '302: Resource temporarily moved, use given URI.',
    [http_status_enum_js_1.HttpStatus.SEE_OTHER]: '303: Response found elsewhere, use GET for that.',
    [http_status_enum_js_1.HttpStatus.NOT_MODIFIED]: '304: Resource not modified since last request.',
    [http_status_enum_js_1.HttpStatus.TEMPORARY_REDIRECT]: '307: Resource temporarily moved, but use same method.',
    [http_status_enum_js_1.HttpStatus.PERMANENT_REDIRECT]: '308: Resource moved permanently, use same method.',
    [http_status_enum_js_1.HttpStatus.BAD_REQUEST]: "400: Server couldn't understand request due to invalid syntax.",
    [http_status_enum_js_1.HttpStatus.UNAUTHORIZED]: '401: Authentication needed for request.',
    [http_status_enum_js_1.HttpStatus.PAYMENT_REQUIRED]: '402: Payment required for this resource.',
    [http_status_enum_js_1.HttpStatus.FORBIDDEN]: '403: Server understood but refuses to authorize.',
    [http_status_enum_js_1.HttpStatus.NOT_FOUND]: "404: Server can't find the requested resource.",
    [http_status_enum_js_1.HttpStatus.METHOD_NOT_ALLOWED]: '405: HTTP method not allowed for resource.',
    [http_status_enum_js_1.HttpStatus.NOT_ACCEPTABLE]: "406: Resource doesn't match criteria.",
    [http_status_enum_js_1.HttpStatus.PROXY_AUTHENTICATION_REQUIRED]: '407: Proxy authentication required.',
    [http_status_enum_js_1.HttpStatus.REQUEST_TIMEOUT]: '408: Server timed out waiting for request.',
    [http_status_enum_js_1.HttpStatus.CONFLICT]: '409: Request conflict with server state.',
    [http_status_enum_js_1.HttpStatus.GONE]: '410: Resource requested is no longer available.',
    [http_status_enum_js_1.HttpStatus.LENGTH_REQUIRED]: '411: Length of request not specified.',
    [http_status_enum_js_1.HttpStatus.PRECONDITION_FAILED]: '412: Precondition for request not met.',
    [http_status_enum_js_1.HttpStatus.PAYLOAD_TOO_LARGE]: '413: Request payload too large.',
    [http_status_enum_js_1.HttpStatus.URI_TOO_LONG]: '414: URI requested is too long.',
    [http_status_enum_js_1.HttpStatus.UNSUPPORTED_MEDIA_TYPE]: '415: Media type not supported.',
    [http_status_enum_js_1.HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE]: '416: Range specified is invalid.',
    [http_status_enum_js_1.HttpStatus.EXPECTATION_FAILED]: "417: Server can't meet request expectation.",
    [http_status_enum_js_1.HttpStatus.I_AM_A_TEAPOT]: "418: I'm a teapot (April Fools joke).",
    [http_status_enum_js_1.HttpStatus.UNPROCESSABLE_ENTITY]: '422: Request understandable, but semantically wrong.',
    [http_status_enum_js_1.HttpStatus.FAILED_DEPENDENCY]: "424: Request failed due to server's previous request.",
    [http_status_enum_js_1.HttpStatus.PRECONDITION_REQUIRED]: '428: Precondition required for request.',
    [http_status_enum_js_1.HttpStatus.TOO_MANY_REQUESTS]: '429: Too many requests from this client.',
    [axios_1.HttpStatusCode.UnavailableForLegalReasons]: '451: Unavailable due to legal reasons.',
    [http_status_enum_js_1.HttpStatus.INTERNAL_SERVER_ERROR]: "500: Server faced an error and can't provide response.",
    [http_status_enum_js_1.HttpStatus.NOT_IMPLEMENTED]: "501: Server doesn't support functionality needed.",
    [http_status_enum_js_1.HttpStatus.BAD_GATEWAY]: '502: Server got invalid response from upstream server.',
    [http_status_enum_js_1.HttpStatus.SERVICE_UNAVAILABLE]: '503: Server not ready to handle request.',
    [http_status_enum_js_1.HttpStatus.GATEWAY_TIMEOUT]: "504: Server didn't get response from another server.",
    [http_status_enum_js_1.HttpStatus.HTTP_VERSION_NOT_SUPPORTED]: "505: Server doesn't support HTTP protocol version.",
};
const getHttpStatusDescription = (status, fallbackDescription = 'Unknown status code') => {
    return httpStatusDescriptions[status] ?? fallbackDescription;
};
exports.getHttpStatusDescription = getHttpStatusDescription;
//# sourceMappingURL=http.helper.js.map