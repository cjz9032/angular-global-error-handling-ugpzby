import { Injectable } from '@angular/core';
import { ComposerBackend } from './backend';
import { ComposerResponseOrigin, RpcFactory } from './factory';
import { ComposerRequest } from './request';
import { Observable, Observer } from 'rxjs';
import {
    ComposerDownloadProgressEvent,
    ComposerErrorResponse,
    ComposerEvent,
    ComposerEventType,
    ComposerResponse
} from './response';


/**
 * Uses `VantageRpcContract` to send requests to VantageService or Plugins.
 * @see `ComposerHandler`
 *
 * @publicApi
 */

@Injectable()
export class ComposerRpcBackend implements ComposerBackend {
    constructor(private rpcFactory: RpcFactory) {}

    /**
     * Processes a request and returns a stream of response events.
     * @param req The request object.
     * @returns An observable of the response events.
     */
    handle(req: ComposerRequest<any>): Observable<ComposerEvent<any>> {
        // TODO: transform to stream operators.
        // const rpc = this.rpcFactory.build();
        // const reqBody = req.toString();
        //
        // const completedCallback$ = bindCallback(rpc.oncomplete)();
        // return completedCallback$.pipe();
        function JsonParse<T>(source): T | ComposerErrorResponse | null {
            try {
                return source !== '' ? JSON.parse(source) : null;
            } catch (error) {
                return new ComposerErrorResponse({
                    error,
                    errorCode: 0,
                    contract: req.contract
                });
            }
        }

        return new Observable((observer: Observer<ComposerEvent<any>>) => {
            const rpc = this.rpcFactory.build();

            const reqBody = req.toString();

            rpc.oncomplete = response => {
                const parsedResponse = JsonParse<ComposerResponseOrigin>(response);
                if (!parsedResponse) {
                    // Empty response error
                    observer.error(new ComposerErrorResponse({
                        error: response,
                        description: 'Empty response',
                        errorCode: -1,
                        contract: req.contract
                    }));
                } else if (parsedResponse instanceof ComposerErrorResponse) {
                    // JSON parse error
                    observer.error(parsedResponse);
                } else {
                    let payload: any | null = null;

                    if (typeof parsedResponse.payload !== 'undefined') {
                        payload = parsedResponse.payload;
                    }

                    if (req.responseType === 'json' && typeof payload === 'string') {
                        payload = JsonParse(payload);
                    }

                    if (payload instanceof ComposerErrorResponse) {
                        observer.error(payload);
                    }

                    if (parsedResponse.errorcode === 0) {
                        // payload 是''或null的判断，解析出来的是null
                        observer.next(new ComposerResponse({
                            errorCode: parsedResponse.errorcode,
                            description: parsedResponse.errordesc,
                            contract: req.contract,
                            payload
                        }));
                        observer.complete();
                    } else {
                        observer.error(new ComposerErrorResponse({
                            error: payload,
                            errorCode: parsedResponse.errorcode,
                            description: parsedResponse.errordesc,
                            contract: req.contract || undefined,
                        }));
                    }
                }
            };

            rpc.onerror = reason => {
                observer.error(new ComposerErrorResponse({
                    error: reason,
                    contract: req.contract || undefined
                }));
            };

            if (req.reportProgress) {
                rpc.onprogress = response => {
					const parsedResponse = JsonParse<ComposerResponseOrigin>(response);

					if (parsedResponse instanceof ComposerErrorResponse) {
						// JSON parse error
						observer.error(parsedResponse);
					} else {
						let payload: any | null = null;

						if (typeof parsedResponse.payload !== 'undefined') {
							payload = parsedResponse.payload;
						}

						if (req.responseType === 'json' && typeof payload === 'string') {
							payload = JsonParse(payload);
						}

						if (payload instanceof ComposerErrorResponse) {
							observer.error(payload);
						}

						if (parsedResponse.errorcode === 0) {
							// payload 是''或null的判断，解析出来的是null
							observer.next(new ComposerResponse({
								errorCode: parsedResponse.errorcode,
								description: parsedResponse.errordesc,
								contract: req.contract,
								payload
							}));
						} else {
							observer.error(new ComposerErrorResponse({
								error: payload,
								errorCode: parsedResponse.errorcode,
								description: parsedResponse.errordesc,
								contract: req.contract || undefined,
							}));
						}
					}
                };
            }


            rpc.makeRequestAsync(reqBody);
            observer.next({type: ComposerEventType.Sent});

            return () => {
				rpc.cancel();
            };
        });
    }
}
