import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'vtr-widget-device-update',
	templateUrl: './widget-device-update.component.html',
	styleUrls: ['./widget-device-update.component.scss']
})
export class WidgetDeviceUpdateComponent implements OnInit {
	@Input() title: string = this.title || '';
	@Input() subTitle1: string = this.subTitle1 || '';
	@Input() subTitle2: string = this.subTitle2 || '';
	@Input() checkForUpdates: string = this.checkForUpdates || '';
	@Input() installationHistory: any[];
	showProgress: boolean;
	cancelCheck = "Cancel Check";
	checkingForUpdates = "Checking for updates";
	complete = "complete";
	progressValue = "80%";
	constructor() { }

	ngOnInit() {
		this.showProgress = false;
	}
	showUpdates() {
		this.showProgress = true;

	}
	cancelUpdates() {
		this.showProgress = false;
	}
}
