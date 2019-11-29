import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoggerService } from '../logger/logger.service';

@Injectable({
	providedIn: 'root'
})
export class RouteHandlerService {
	constructor(
		private router: Router,
		private logger: LoggerService
	) {
		if (window.history.length === 1) {
			this.logger.debug('*** RouteHandlerService: its protocol launch');
			this.router.navigate(['/'], { queryParams: { redirectTo: encodeURI(this.router.url) } });
		}
	}
}
