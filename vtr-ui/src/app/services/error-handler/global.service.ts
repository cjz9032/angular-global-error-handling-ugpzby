import { ErrorHandler, Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {

	handleError(error) {
		console.error('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ', error);
	}
}
