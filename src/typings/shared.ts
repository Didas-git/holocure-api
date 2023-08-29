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