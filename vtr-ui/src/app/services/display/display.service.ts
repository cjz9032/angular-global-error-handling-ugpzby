import { Injectable, Output, EventEmitter } from '@angular/core';
import { DevService } from '../dev/dev.service';

@Injectable()
export class DisplayService {

	@Output() windowResize: EventEmitter<any> = new EventEmitter();

	loading = 0;
	windowWidth = 0;
	windowHeight = 0;

	constructor(
		private devService: DevService
	) { }

	startLoading() {
		this.devService.writeLog('START LOADING');
		this.loading++;
	}

	endLoading() {
		this.devService.writeLog('END LOADING');
		this.loading--;
		if (this.loading < 0) {
			this.loading = 0;
		}
	}

	clearLoading() {
		this.loading = 0;
	}

	calcSize(service) {
		service.windowWidth = window.outerWidth;
		service.windowHeight = window.outerHeight;
		this.windowResize.emit();
		this.devService.writeLog('CALC SIZE', service.windowWidth, service.windowHeight);
	}

	resizeWindow() {
		const delay = setTimeout(function () {
			window.dispatchEvent(new Event('resize'));
		}, 100);
	}

	windowResizeListener() {
		return this.windowResize;
	}

}
