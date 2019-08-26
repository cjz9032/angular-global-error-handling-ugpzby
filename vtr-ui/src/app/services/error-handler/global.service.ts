import { ErrorHandler, Injectable } from '@angular/core';
import { LoggerService } from '../logger/logger.service';

@Injectable({
	providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {
	constructor(private logger: LoggerService) {

	}

	handleError(error) {
		this.logger.error('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ', error);
	}
}
