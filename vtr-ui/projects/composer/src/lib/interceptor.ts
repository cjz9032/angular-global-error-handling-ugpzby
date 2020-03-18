import { ComposerRequest } from './request';
import { ComposerHandler } from './handler';
import { Observable } from 'rxjs';
import { Injectable, InjectionToken } from '@angular/core';

export interface ComposerInterceptor {
    /**
     * Identifies and handles a given COMPOSER request.
     * @param req The outgoing request object to handle.
     * @param next The next interceptor in the chain, or the backend
     *             if no interceptors remain in the chain.
     * @returns An observable of the event stream.
     */
    intercept(req: ComposerRequest<any>, next: ComposerHandler): Observable<any>;
}

/**
 * `ComposerHandler` which applies an `ComposerInterceptor` to an `ComposerRequest`.
 */
export class ComposerInterceptorHandler implements ComposerHandler {
    constructor(private next: ComposerHandler, private interceptor: ComposerInterceptor) {}

    handle(req: ComposerRequest<any>): Observable<any> {
        return this.interceptor.intercept(req, this.next);
    }
}

/**
 * A multi-provider token that represents the array of registered
 * `ComposerInterceptor` objects.
 */
export const COMPOSER_INTERCEPTORS = new InjectionToken<ComposerInterceptor[]>('COMPOSER_INTERCEPTORS');

@Injectable()
export class NoopInterceptor implements ComposerInterceptor {
    intercept(req: ComposerRequest<any>, next: ComposerHandler): Observable<any> {
        return next.handle(req);
    }
}
