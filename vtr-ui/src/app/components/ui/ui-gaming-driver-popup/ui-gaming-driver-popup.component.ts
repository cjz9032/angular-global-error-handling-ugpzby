import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'vtr-ui-gaming-driver-popup',
	templateUrl: './ui-gaming-driver-popup.component.html',
	styleUrls: ['./ui-gaming-driver-popup.component.scss'],
})
export class UiGamingDriverPopupComponent implements OnInit {
	@Input() showMePartially: boolean;
	@Output() driverpopval = new EventEmitter<any>();
	@Input() descriptionLabel = 'Gaming driver popup';
	@Input() automationId: string;
	@Input() item: any;
	@Input() popupTitle: any;
	@Input() popupFeatureText: any;
	@Input() strOKbtn: any;
	@Input() isGamingDriverPop: boolean;

	isNowOpened = false;

	constructor(private router: Router) {
		setTimeout(() => {
			this.isNowOpened = true;
		}, 10);
	}

	ngOnInit() {
		if (!this.popupFeatureText || this.popupFeatureText.length < 2) {
			this.popupFeatureText = 'gaming.dashboard.device.legionEdge.driverPopup.text';
		}
		this.focusElement('ui-gaming-driver-popup');
	}
	close() {
		this.showMePartially = !this.showMePartially;
		if (this.isGamingDriverPop) this.driverpopval.emit(false);
		else this.driverpopval.emit(this.item);
		this.focusElement('#main-wrapper');
	}

	clickEnableBtn() {
		this.isGamingDriverPop ? this.systemUpdatePage() : this.close();
	}

	systemUpdatePage() {
		if (this.isGamingDriverPop) this.router.navigate(['device/system-updates']);
	}
	isPopupWindowGetFocus(event) {
		if (event.srcElement.className.indexOf('enable-button') > -1 && this.isGamingDriverPop)
			return;
		if (event.which === 9) {
			setTimeout(() => {
				this.focusElement('ui-gaming-driver-popup');
			}, 2);
		}
	}

	focusElement(selector) {
		const targetElement = document.querySelector(selector) as HTMLElement;
		if (targetElement) {
			targetElement.focus();
		}
	}

	onOutsideClick() {
		if (this.isNowOpened) {
			this.close();
		}
	}
}
