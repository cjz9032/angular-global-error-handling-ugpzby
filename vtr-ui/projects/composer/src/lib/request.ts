export type ComposerObserve = 'body' | 'response';

interface ComposerRequestInit {
    reportProgress?: boolean;
    withCredentials?: boolean;
    responseType?: 'json' | 'text';
}

export class ComposerRequest<T> {
    /**
     * The outgoing Composer request contract.
     */
    readonly contract: string;

    /**
     * The outgoing Composer request command
     */
    readonly command: string;

    /**
     * The Contract payload, or `null` if one isn't set.
     *
     * Bodies are not enforced to be immutable, as they can include a reference to any
     * user-defined data type. However, interceptors should take care to preserve
     * idempotence by treating them as such.
     */
    readonly payload: T | null = null;

    /**
     * Whether this request should be made in a way that exposes progress events.
     *
     * Progress events are expensive (change detection runs on each event) and so
     * they should only be requested if the consumer intends to monitor them.
     */
    readonly reportProgress: boolean = false;

    /**
     * Whether this request should be sent with outgoing credentials (cookies).
     */
    readonly withCredentials: boolean = false;

    /**
     * The expected response type of the plugins.
     *
     * This is used to parse the response appropriately before returning it to
     * the requestee.
     */
    readonly responseType: 'json' | 'text' = 'json';

    /**
     * The expected kind of response.
     *
     * This is used to determine appropriately what kind will be return.
     */
    readonly observe: ComposerObserve = 'body';

    constructor(contract: string, command: string, init?: {
        reportProgress?: boolean;
        withCredentials?: boolean;
        responseType?: 'json' | 'text';
    });
    constructor(contract: string, command: string, payload: T | null, init?: {
        reportProgress?: boolean;
        withCredentials?: boolean;
        responseType?: 'json' | 'text';
    });
    constructor(
        contract: string,
        command: string,
        third?: T | {
            reportProgress?: boolean;
            withCredentials?: boolean;
            responseType?: 'json' | 'text';
        } | null,
        fourth?: {
            reportProgress?: boolean;
            withCredentials?: boolean;
            responseType?: 'json' | 'text';
        }
    ){
        this.contract = contract;
        this.command = command;
        // Next, need to figure out which argument holds the HttpRequestInit
        // options, if any.
        let options: ComposerRequestInit | undefined;

        // Check whether a payload argument is expected.
        if (!!fourth) {
            // Payload is the third argument, options are the fourth.
            this.payload = (third !== undefined) ? third as T : null;
            options = fourth;
        } else {
            // No payload required, options are the third argument. The payload stays null.
            options = third as ComposerRequestInit;
        }

        // If options have been passed, interpret them.
        if (options) {
            // Normalize reportProgress and withCredentials.
            this.reportProgress = !!options.reportProgress;
            this.withCredentials = !!options.withCredentials;

            // Override default response type of 'json' if one is provided.
            if (!!options.responseType) {
                this.responseType = options.responseType;
            }
        }
    }

    /**
     * Transform the free-form payload into a serialized format suitable for
     * transmission to the plugin.
     */
    serializePayload(): string | null {
        // If no payload is present, no need to serialize it.
        if (this.payload === null) {
            return null;
        }
        // Check whether the payload is already in a serialized form. If so,
        // it can just be returned directly.
        if (typeof this.payload === 'string') {
            return this.payload;
        }
        // Check whether the body is an object or array, and serialize with JSON if so.
        if (typeof this.payload === 'object' || typeof this.payload === 'boolean' || Array.isArray(this.payload)) {
            return JSON.stringify(this.payload);
        }
        // Fall back on toString() for everything else.
        return (this.payload as any).toString();
    }

    clone(): ComposerRequest<T>;
    clone(update: {
        contract?: string;
        command?: string;
        reportProgress?: boolean;
        withCredentials?: boolean;
        responseType?: 'json' | 'text';
        payload?: T | null;
    }): ComposerRequest<T>;
    clone<V>(update: {
        contract?: string;
        command?: string;
        reportProgress?: boolean;
        withCredentials?: boolean;
        responseType?: 'json' | 'text';
        payload?: V | null;
    }): ComposerRequest<V>;
    clone(update: {
        contract?: string;
        command?: string;
        reportProgress?: boolean;
        withCredentials?: boolean;
        responseType?: 'json' | 'text';
        payload?: any | null;
    } = {}): ComposerRequest<any> {
        // For contract, command, and responseType, take the current value unless
        // it is overridden in the update hash.
        const contract = update.contract || this.contract;
        const command = update.command || this.command;
        const responseType = update.responseType || this.responseType;

        // The payload is somewhat special - a `null` value in update.payload means
        // whatever current body is present is being overridden with an empty
        // payload, whereas an `undefined` value in update.payload implies no
        // override.
        const payload = (update.payload !== undefined) ? update.payload : this.payload;

        // Carefully handle the boolean options to differentiate between
        // `false` and `undefined` in the update args.
        const withCredentials = (update.withCredentials !== undefined) ? update.withCredentials : this.withCredentials;
        const reportProgress = (update.reportProgress !== undefined) ? update.reportProgress : this.reportProgress;

        // Finally, construct the new HttpRequest using the pieces from above.
        return new ComposerRequest(contract, command, payload, {
            reportProgress,
            responseType,
            withCredentials
        });
    }

    toString(): string {
        const contract: ContractModel = {
            contract: this.contract,
            command: this.command
        };
        if (this.payload !== null) {
            contract.payload = JSON.stringify(this.payload);
        }
        return JSON.stringify(contract);
    }
}

export interface ContractModel {
    contract: string;
    command: string;
    payload?: string | object | null;
}
