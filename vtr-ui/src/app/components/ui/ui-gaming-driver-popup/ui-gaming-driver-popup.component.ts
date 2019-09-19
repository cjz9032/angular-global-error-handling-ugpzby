import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router'

@Component({
	selector: 'vtr-ui-gaming-driver-popup',
	templateUrl: './ui-gaming-driver-popup.component.html',
	styleUrls: ['./ui-gaming-driver-popup.component.scss']
})
export class UiGamingDriverPopupComponent implements OnInit {
	@Input() showMePartially: boolean;
	@Input() isLightingText: boolean;
	@Input() popupText: any;
	@Output() driverpopval = new EventEmitter<boolean>();
	constructor(private Router: Router) { }

	ngOnInit() {
		if (!this.popupText || this.popupText.length < 2) {
			this.popupText = 'gaming.dashboard.device.legionEdge.driverPopup.text';
		}
	}
	close() {
		this.showMePartially = !this.showMePartially;
		this.driverpopval.emit(false);

	}

	systemUpdatePage() {
		this.Router.navigate(["device/system-updates"]);
	}
	runappKeyup(event) {
		if (event.which == 9) {
			const focusElem = document.getElementById('gaming_driverPopup_close');
			focusElem.focus();
		}
	}
}
