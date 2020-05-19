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
	@Input() descriptionLabel = 'Gaming driver popup';
	@Input() automationId: string;
	isNowOpened = false;

	constructor(private router: Router) {
		setTimeout(() => {
			this.isNowOpened = true;
		}, 10);
	 }

	ngOnInit() {
		if (!this.popupText || this.popupText.length < 2) {
			this.popupText = 'gaming.dashboard.device.legionEdge.driverPopup.text';
		}
		this.focusElement('ui-gaming-driver-popup');

	}
	close() {
		this.showMePartially = !this.showMePartially;
		this.driverpopval.emit(false);
		this.focusElement('#main-wrapper');

	}

	systemUpdatePage() {
		this.router.navigate(['device/system-updates']);
	}
	runappKeyup(event) {
		if (event.which === 9) {
			setTimeout(() => {
				this.focusElement('ui-gaming-driver-popup');
			}, 2);
		}
	}

	focusElement(selector) {
		const targetElement = document.querySelector(selector) as HTMLElement;
		if(targetElement){
			targetElement.focus();
		}
	}

	onOutsideClick() {
		if (this.isNowOpened) {
			this.close();
		}
	}
}
