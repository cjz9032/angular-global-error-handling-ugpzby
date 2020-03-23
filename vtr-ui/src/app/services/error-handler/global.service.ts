import { ErrorHandler, Injectable } from '@angular/core';
import { ChunkLoadError } from 'src/app/data-models/common/chunk-load-error.model';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})

export class ChunkLoadErrorHandler implements ErrorHandler {
	constructor() { }

	handleError(error) {
		if (!error) return;

		if (!environment.production) {
			console.error(error);
		}

        if (this.isChunkLoadError(error) || this.isChunkLoadError(error.rejection)) {
			window.location.reload(true);
		}
    }

	isChunkLoadError(error: ChunkLoadError | any): error is ChunkLoadError {
		return Boolean(error && (error as ChunkLoadError).name === 'ChunkLoadError');
	}
}
