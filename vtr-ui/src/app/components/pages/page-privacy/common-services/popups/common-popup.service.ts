import { Injectable } from '@angular/core';
import { Subject } from "rxjs";
import { filter, tap } from "rxjs/operators";

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

	private subject = new Subject();

	close$(id: string) {
		return this.subject.pipe(
			filter(value => value === id)
		);
	}

	add(popup: PopUpInterface) {
		if (!this.popups[popup.popUpId]) {
			this.popups[popup.popUpId] = popup;
		} else {
			console.error("");
		}
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
			this.subject.next(id)
		}
	}
}
