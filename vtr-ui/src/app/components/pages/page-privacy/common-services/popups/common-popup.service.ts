import { Injectable } from '@angular/core';

interface PopUpInterface {
	popUpId: string;

	open(): void;

	close(): void;
}

@Injectable({
	providedIn: 'root'
})
export class CommonPopupService {
	constructor() {
	}

	private popups: { [key: string]: PopUpInterface } = {};

	add(popup: PopUpInterface) {
		this.popups[popup.popUpId] = popup;
	}

	remove(id: string) {
		delete this.popups[id];
	}

	open(id: string) {
		if (this.popups[id]) {
			this.popups[id].open();
		}
	}

	close(id: string) {
		if (this.popups[id]) {
			this.popups[id].close();
		}
	}
}
