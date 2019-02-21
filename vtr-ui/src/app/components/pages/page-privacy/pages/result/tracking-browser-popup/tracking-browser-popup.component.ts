import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'tracking-browser-popup',
	templateUrl: './tracking-browser-popup.component.html',
	styleUrls: ['./tracking-browser-popup.component.scss'],
})

export class TrackingBrowserPopupComponent {
	@Input() isPopupOpen: boolean;
	@Output() popupClosed = new EventEmitter;

	closePopup() {
		this.popupClosed.emit();
	}
}
