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
		document.getElementById('gamingDriverPopup').focus();
		
	}
	close() {
		this.showMePartially = !this.showMePartially;
		this.driverpopval.emit(false);
		document.getElementById('main-wrapper').focus();

	}

	systemUpdatePage() {
		this.router.navigate(['device/system-updates']);
	}
	runappKeyup(event) {
		if (event.which == 9) {
			setTimeout(() => {
				document.getElementById('gaming-driverPopup-close').focus();
			}, 2);
		}
	}
	
	onOutsideClick() {
        if (this.isNowOpened) {
			this.close();
		}
    }
}
