import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
	// selector: 'app-admin',
	templateUrl: './result.component.html',
	styleUrls: ['./result.component.scss']
})
export class ResultComponent {
	public isPopupOpen: boolean;

	constructor(private _location: Location) {
		this.isPopupOpen = false;
	}

	backClicked() {
		this._location.back();
	}

	closePopUp() {
		this.isPopupOpen = false;
	}

	openPopUp() {
		this.isPopupOpen = true;
	}
}
