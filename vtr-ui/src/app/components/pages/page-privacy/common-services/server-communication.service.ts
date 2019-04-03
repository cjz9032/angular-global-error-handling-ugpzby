import { EventEmitter, Injectable } from '@angular/core';

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
}
