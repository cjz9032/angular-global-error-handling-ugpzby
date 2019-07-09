import {ErrorHandler, Inject, Injectable} from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {

	handleError(error) {
		console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ', error);
	}
}
