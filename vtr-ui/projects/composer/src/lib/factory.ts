/**
 * A wrapper around the `VantageRpcRequest` constructor.
 *
 * @publicApi
 */
import { Injectable } from '@angular/core';

export interface ComposerResponseOrigin {
    errorcode: number;
    errordesc: string;
    payload: string;
}
/**
 * C# object
 */
export interface VantageRpcClientEx {
    /**
     * A callback registered for receiving data when progress event emit.
     * only register this method when you need to.
     *
     * @see `ComposerRequest.reportProgress`
     */
    onprogress: (payload) => void;
    /**
     * A callback registered for receiving data when complete event emit.
     */
    oncomplete: (response: string) => void;
    /**
     * A callback registered for receiving reason when error event emit.
     */
    onerror;
    /**
     * Fire. Ensure you have registered callback before invoking this method.
     */
    makeRequestAsync(request: string): void;
    /**
     * Cancel.
     */
    cancel(): void;
}
declare var VantageShellExtension;

export abstract class RpcFactory {
    abstract build(): VantageRpcClientEx;
}
/**
 * A factory for `ComposerRpcBackend` that uses the `VantageRpcRequest` API.
 *
 */
@Injectable()
export class VantageRpc implements RpcFactory {
    constructor() {}
    build() { return (new VantageShellExtension.VantageRpcClientEx()) as VantageRpcClientEx; }
}
