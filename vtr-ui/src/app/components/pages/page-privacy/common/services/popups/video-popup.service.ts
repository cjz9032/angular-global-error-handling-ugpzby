import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class VideoPopupService {
	public isPopupOpen = false;
	public popupOpenStateUpdated = new EventEmitter();
	public videoUrl = '';

	constructor() {
	}

	setPopupContent(videoUrl) {
	  this.videoUrl = videoUrl;
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