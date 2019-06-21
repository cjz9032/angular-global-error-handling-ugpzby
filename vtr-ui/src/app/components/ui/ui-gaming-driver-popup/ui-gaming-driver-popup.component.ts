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
	@Output() driverpopval = new EventEmitter<boolean>();
	constructor(private Router: Router) { }

	ngOnInit() {
	}
	close() {
		this.showMePartially = !this.showMePartially;
		this.driverpopval.emit(false);

	}

	systemUpdatePage() {
		this.Router.navigate(["device/system-updates"]);
	}

}
