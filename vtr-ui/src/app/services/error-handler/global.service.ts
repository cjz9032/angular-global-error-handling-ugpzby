import { ErrorHandler, Injectable } from '@angular/core';
import { LoggerService } from '../logger/logger.service';

@Injectable({
	providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {
	constructor(private logger: LoggerService) { }

	handleError(error) {
		const errorMessage = JSON.stringify({ message: error.message, stackTrace: error.stack });
		this.logger.error('GlobalErrorHandler: uncaught exception', errorMessage);
		console.error('GlobalErrorHandler: uncaught exception', errorMessage);

	}
}
