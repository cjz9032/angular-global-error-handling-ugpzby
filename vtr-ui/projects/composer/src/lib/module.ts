import { Injectable, Injector, NgModule } from '@angular/core';
import { ComposerClient } from './client';
import { ComposerHandler } from './handler';
import { ComposerRequest } from './request';
import { Observable } from 'rxjs';
import { COMPOSER_INTERCEPTORS, ComposerInterceptorHandler } from './interceptor';
import { ComposerBackend } from './backend';
import { ComposerRpcBackend } from './rpc';
import { RpcFactory, VantageRpc } from './factory';

/**
 * An injectable `ComposerHandler` that applies multiple interceptors
 * to a request before passing it to the given `ComposerBackend`.
 *
 * The interceptors are loaded lazily from the injector, to allow
 * interceptors to themselves inject classes depending indirectly
 * on `ComposerInterceptingHandler` itself.
 * @see `ComposerInterceptor`
 */
@Injectable()
export class ComposerInterceptingHandler implements ComposerHandler {
    private chain: ComposerHandler | null = null;

    constructor(private backend: ComposerBackend, private injector: Injector) {}

    handle(req: ComposerRequest<any>): Observable<any> {
        if (this.chain === null) {
            const interceptors = this.injector.get(COMPOSER_INTERCEPTORS, []);
            this.chain = interceptors.reduceRight(
                (next, interceptor) => new ComposerInterceptorHandler(next, interceptor), this.backend
            );
        }
        return this.chain.handle(req);
    }
}

@NgModule({
    providers: [
        ComposerClient,
        ComposerInterceptingHandler,
        {provide: ComposerHandler, useExisting: ComposerInterceptingHandler},
        ComposerRpcBackend,
        {provide: ComposerBackend, useExisting: ComposerRpcBackend},
        VantageRpc,
        {provide: RpcFactory, useExisting: VantageRpc}
    ]
})
export class ComposerClientModule {
}
