import { EventEmitter, Injectable } from '@angular/core';
import { of } from 'rxjs';
import { delay, share } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class ServerCommunicationService {
	onGetLenovoId = new EventEmitter();

	getLenovoId() {
		setTimeout(() => {
			this.onGetLenovoId.emit({emails: ['john_doe@lenovo.com']});
		}, 200);
	}

	getInstalledBrowser() {
		const installedBrowsers = ['chrome', 'firefox', 'edge'];
		return of({
			type: 'getInstalledBrowser',
			status: 0,
			payload: {installed_browsers: installedBrowsers}
		}).pipe(
			share(),
			delay(100),
		);
	}

	getTrackersChrome() {
	}

	getTrackersEdge() {
	}

	getTrackersFirefox() {
	}
}
