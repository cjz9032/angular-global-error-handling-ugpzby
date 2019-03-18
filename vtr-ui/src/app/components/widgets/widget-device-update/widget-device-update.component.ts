import { Component, Input, OnInit, NgZone, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'vtr-widget-device-update',
	templateUrl: './widget-device-update.component.html',
	styleUrls: ['./widget-device-update.component.scss']
})
export class WidgetDeviceUpdateComponent implements OnInit {
	@Input() title: string = this.title || '';
	@Input() subTitle1: string = this.subTitle1 || '';
	@Input() subTitle2: string = this.subTitle2 || '';
	@Input() buttonText = '';
	@Input() installationHistory: any[];
	@Input() percent = 0;
	@Input() showProgress = false;
	@Input() isUpdateDownloading = false;
	@Input() downloadingUpdateText = 'Downloading updates';
	@Input() downloadingPercent = 0;
	@Input() installingUpdateText = 'Installing updates';
	@Input() installingPercent = 0;

	@Output() checkForUpdate = new EventEmitter();
	@Output() cancelUpdateCheck = new EventEmitter();

	cancelCheck = 'Cancel Check';
	checkingForUpdates = 'Checking for updates';
	complete = 'complete';
	public progressValue = 0;
	public downloadingIcon = 'spinner';
	public installingIcon = 'spinner';

	constructor() { }

	ngOnInit() {
		// this.showProgress = false;
	}
	onCheckForUpdates() {
		// this.showProgress = true;
		this.checkForUpdate.emit();
	}

	cancelUpdates() {
		// this.showProgress = false;
		this.cancelUpdateCheck.emit();
	}
}
