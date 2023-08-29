export interface ErrorResponse {
    /** Status code */
    code: number;
    error: string;
    details?: string;
}

export interface VersionInfo {
    version: `${number}.${number}.${number}`;
    deprecated: boolean;
    /** Later to be changed to a more informative thing */
    availableInformation: Array<string>;
}

export enum StatusCode {
    //#region Informational
    Continue = 100,
    SwitchingProtocols = 101,
    Processing = 102,
    //#endregion Informational
    //#region Success
    OK = 200,
    Created = 201,
    Accepted = 202,
    NonAuthoritativeInformation = 203,
    NoContent = 204,
    ResetContent = 205,
    PartialContent = 206,
    MultiStatus = 207,
    AlreadyReported = 208,
    IMUsed = 226,
    //#endregion Success
    //#region Redirection
    MultipleChoices = 300,
    MovedPermanently = 301,
    Found = 302,
    SeeOther = 303,
    NotModified = 304,
    UseProxy = 305,
    TemporaryRedirect = 307,
    PermanentRedirect = 308,
    //#endregion Redirection
    //#region Client Error
    BadRequest = 400,
    Unauthorized = 401,
    PaymentRequired = 402,
    Forbidden = 403,
    NotFound = 404,
    MethodNotAllowed = 405,
    NotAcceptable = 406,
    ProxyAuthenticationRequired = 407,
    RequestTimeout = 408,
    Conflict = 409,
    Gone = 410,
    LengthRequired = 411,
    PreconditionFailed = 412,
    PayloadTooLarge = 413,
    RequestURITooLong = 414,
    UnsupportedMediaType = 415,
    RequestedRangeNotSatisfiable = 416,
    ExpectationFailed = 417,
    Imateapot = 418,
    MisdirectedRequest = 421,
    UnprocessableEntity = 422,
    Locked = 423,
    FailedDependency = 424,
    UpgradeRequired = 426,
    PreconditionRequired = 428,
    TooManyRequests = 429,
    RequestHeaderFieldsTooLarge = 431,
    ConnectionClosedWithoutResponse = 444,
    UnavailableForLegalReasons = 451,
    ClientClosedRequest = 499,
    //#endregion Client Error
    //#region Server Error
    InternalServerError = 500,
    NotImplemented = 501,
    BadGateway = 502,
    ServiceUnavailable = 503,
    GatewayTimeout = 504,
    HTTPVersionNotSupported = 505,
    VariantAlsoNegotiates = 506,
    InsufficientStorage = 507,
    LoopDetected = 508,
    NotExtended = 510,
    NetworkAuthenticationRequired = 511,
    NetworkConnectTimeoutError = 599
    //#endregion Server Error
}

export function IsInformational(code: StatusCode): boolean {
    return Math.floor(code / 100) === 1;
}

export function IsSuccessful(code: StatusCode): boolean {
    return Math.floor(code / 100) === 2;
}

export function IsRedirection(code: StatusCode): boolean {
    return Math.floor(code / 100) === 3;
}

export function IsClientError(code: StatusCode): boolean {
    return Math.floor(code / 100) === 4;
}

export function IsServerError(code: StatusCode): boolean {
    return Math.floor(code / 100) === 5;
}