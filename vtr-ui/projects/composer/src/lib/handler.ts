import { Observable } from 'rxjs';
import { ComposerRequest } from './request';

export abstract class ComposerHandler {
    abstract handle(req: ComposerRequest<any>): Observable<any>;
}
