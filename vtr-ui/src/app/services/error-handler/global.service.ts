import { ErrorHandler, Injectable } from '@angular/core';
import { LoggerService } from '../logger/logger.service';
import { PromiseError } from 'src/app/data-models/common/promise-error.model';
import { ChunkLoadError } from 'src/app/data-models/common/chunk-load-error.model';

@Injectable({
	providedIn: 'root'
})

export class GlobalErrorHandler implements ErrorHandler {
	constructor(private logger: LoggerService) { }

	handleError(error) {
		let errorMessage;
		if (error.stack) {
			errorMessage = JSON.stringify({ message: error.message, stackTrace: error.stack });
		} else {
			errorMessage = JSON.stringify({ message: error });
		}

		if (this.isPromiseError(error) && this.isChunkLoadError(error.rejection)) {
			window.location.reload(true);
		}

		this.logger.error('GlobalErrorHandler: uncaught exception', errorMessage);
		console.error('GlobalErrorHandler: uncaught exception', errorMessage);
	}

	isPromiseError(error: PromiseError | any): error is PromiseError {
		return Boolean(error && (error as PromiseError).rejection);
	}

	isChunkLoadError(error: ChunkLoadError | any): error is ChunkLoadError {
		return Boolean(error && (error as ChunkLoadError).name === 'ChunkLoadError');
	}
}
