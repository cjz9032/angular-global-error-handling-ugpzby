import { ComposerHandler } from './handler';
import { ComposerRequest } from './request';
import { Observable } from 'rxjs';


/**
 * A final `ComposerHandler` which will dispatch the request via browser Composer APIs to a backend.
 *
 * Interceptors sit between the `ComposerClient` interface and the `ComposerBackend`.
 *
 * When injected, `ComposerBackend` dispatches requests directly to the backend, without going
 * through the interceptor chain.
 *
 * @publicApi
 */
export abstract class ComposerBackend implements ComposerHandler {
    abstract handle(req: ComposerRequest<any>): Observable<any>;
}
