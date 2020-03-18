
export enum ComposerEventType {
    /**
     * The request was sent out.
     */
    Sent,

    /**
     * A download progress event was received
     */
    DownloadProgress,


    /**
     * The full response including the body was received.
     */
    Response,

    /**
     * A custom event from an interceptor or a backend.
     */
    User,
}

/**
 * Base interface for progress events.
 *
 * @publicApi
 */
export interface ComposerProgressEvent {
    /**
     * Progress event type is either upload or download.
     */
    type: ComposerEventType.DownloadProgress;

    /**
     * Number of bytes uploaded or downloaded.
     */
    loaded?: number;

    /**
     * Total number of bytes to upload or download. Depending on the request or
     * response, this may not be computable and thus may not be present.
     */
    total?: number;
}

/**
 * A download progress event.
 *
 * @publicApi
 */
export interface ComposerDownloadProgressEvent extends ComposerProgressEvent {
    type: ComposerEventType.DownloadProgress;

    /**
     * The partial response payload as downloaded so far.
     *
     */
    payload?: string;
}

/**
 * An event indicating that the request was sent to the plugins. Useful
 * when a request may be retried multiple times, to distinguish between
 * retries on the final event stream.
 *
 * @publicApi
 */
export interface ComposerSentEvent { type: ComposerEventType.Sent; }

/**
 * A user-defined event.
 *
 * Grouping all custom events under this type ensures they will be handled
 * and forwarded by all implementations of interceptors.
 *
 * @publicApi
 */
export interface ComposerUserEvent<T> { type: ComposerEventType.User; }

/**
 * An error that represents a failed attempt to JSON.parse text coming back
 * from the server.
 *
 * It bundles the Error object with the actual response body that failed to parse.
 *
 *
 */
export interface ComposerJsonParseError {
    error: Error;
    text: string;
}


/**
 * Union type for all possible events on the response stream.
 *
 * Typed according to the expected type of the response.
 *
 * @publicApi
 */
export type ComposerEvent<T> = ComposerSentEvent | ComposerResponse<T> | ComposerProgressEvent | ComposerUserEvent<T>;

export abstract class ComposerResponseBase {
    /**
     * Response error code
     */
    readonly errorCode;

    /**
     * Textual description of response status code.
     *
     * Do not depend on this.
     */
    readonly description: string;

    /**
     * Contract of the resource retrieved, or null if not available
     */
    readonly contract: string | null;

    /**
     * Type of the Response
     */
    readonly type: ComposerEventType.Response;

    protected constructor(
        init: {
            errorCode?: number,
            description?: string,
            contract?: string
        },
        defaultErrorCode: number = 0,
        defaultDescription: string = 'OK'
    ) {
        this.errorCode = init.errorCode !== undefined ? init.errorCode : defaultErrorCode;
        this.description = init.description || defaultDescription;
        this.contract = init.contract || null;
    }
}

/**
 * A full Composer response, including a typed response body (which may be `null`
 * if one was not returned).
 *
 * `ComposerResponse` is a `ComposerEvent` available on the response event
 * stream.
 *
 * @publicApi
 */
export class ComposerResponse<T> extends ComposerResponseBase {
    /**
     * The response payload, or `null` if one was not returned.
     */
    readonly payload: T | null;

    readonly type: ComposerEventType.Response = ComposerEventType.Response;

    constructor(init: {
        payload?: T | null,
        errorCode?: number,
        description?: string,
        contract?: string
    }) {
        super(init);
        this.payload = init.payload !== undefined ? init.payload : null;
    }


    clone(update?: {
        errorCode?: number;
        description?: string;
        contract?: string;
    }): ComposerResponse<T>;
    clone<V>(update: {
        payload?: V | null;
        errorCode?: number;
        description?: string;
        contract?: string
    }): ComposerResponse<V>;
    clone(update: {
        payload?: any | null;
        errorCode?: number;
        description?: string;
        contract?: string
    } = {}): ComposerResponse<any> {
        return new ComposerResponse<any>({
            payload: update.payload !== undefined ? update.payload : this.payload,
            errorCode: update.errorCode !== undefined ? update.errorCode : this.errorCode,
            description: update.description || this.description,
            contract: update.contract || this.contract || undefined
        });
    }
}

/**
 * A response that represents an error or failure, either from a
 * non-successful Composer errorCode, an error while executing the request,
 * or some other failure which occurred during the parsing of the response.
 *
 * Any error returned on the `Observable` response stream will be
 * wrapped in an `ComposerErrorResponse` to provide additional context about
 * the state of the HTTP layer when the error occurred. The error property
 * will contain either a wrapped Error object or the error response returned
 * from the server.
 *
 * @publicApi
 */
export class ComposerErrorResponse extends ComposerResponseBase implements Error {
    readonly name = 'ComposerErrorResponse';
    readonly message: string;
    readonly error: any | null;

    constructor(init: {
        error?: any;
        errorCode?: number;
        description?: string;
        contract?: string;
    }) {
        super(init, -1, 'Unknown Error');
        if (this.errorCode === 0) {
            this.message = `Composer failure during parsing for ${init.contract || '(unknown contract)'}`;
        } else {
            this.message =
                `Composer failure response for ${init.contract || '(unknown contract)'}: ${init.errorCode} ${init.description}`;
        }
        this.error = init.error || null;
    }

}
