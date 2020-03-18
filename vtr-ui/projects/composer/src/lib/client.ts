import { Injectable } from '@angular/core';
import { ComposerHandler } from './handler';
import { Observable, of } from 'rxjs';
import { ComposerRequest } from './request';
import { concatMap, filter, map, tap } from 'rxjs/operators';
import { ComposerEvent, ComposerEventType, ComposerResponse } from './response';

@Injectable()
export class ComposerClient {
    constructor(private handler: ComposerHandler) {}

    /**
     *
     */
    request<T>(options: ComposerRequest<any>): Observable<T>;
    request<T>(options: ComposerRequest<any>): Observable<ComposerEvent<T>> {
        const event$: Observable<ComposerEvent<T>> = of(options)
            .pipe(concatMap((req: ComposerRequest<any>) => this.handler.handle(req)));

        const res$ = event$
            .pipe(filter<ComposerResponse<T>>((event: ComposerEvent<T>) => event instanceof ComposerResponse || event.type === ComposerEventType.DownloadProgress));

        switch (options.observe) {
            case 'body':
                switch (options.responseType) {
                    case 'json':
                    default:
                        // TODO: AnyScript !!!!!!!!!!! Any better way to describe this?
                        return (res$.pipe(map((res: ComposerResponse<T>) => res.payload)) as any);
                }
            case 'response':
                return res$;
            default:
                throw new Error(`Unreachable: unhandled observe type ${options.observe}`);
        }
    }
}
