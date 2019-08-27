import { ErrorHandler, Injectable } from '@angular/core';
import { LoggerService } from '../logger/logger.service';

@Injectable({
	providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {
	constructor(private logger: LoggerService) { }

	handleError(error) {
		// log error with error message
		this.logger.error('GlobalErrorHandler: uncaught exception', error.message);
		console.error('GlobalErrorHandler: uncaught exception', error);
	}
}
