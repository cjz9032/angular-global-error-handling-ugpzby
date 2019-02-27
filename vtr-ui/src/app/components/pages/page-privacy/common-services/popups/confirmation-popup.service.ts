import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class ConfirmationPopupService {
	public isPopupOpen = false;
	public popupOpenStateUpdated = new EventEmitter();

	constructor() {
	}

	openPopup() {
		this.isPopupOpen = true;
		this.popupOpenStateUpdated.emit(this.isPopupOpen);
	}

	closePopup() {
		this.isPopupOpen = false;
		this.popupOpenStateUpdated.emit(this.isPopupOpen);
	}
}
