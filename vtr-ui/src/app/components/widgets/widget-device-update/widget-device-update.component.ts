import { Component, Input, OnInit, NgZone, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


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
	@Input() isCheckingStatus = false;
	@Input() showProgress = false;
	@Input() isUpdateDownloading = false;
	@Input() isCheckingPluginStatus = true;
	@Input() downloadingPercent = 0;
	@Input() installingPercent = 0;
	@Output() checkForUpdate = new EventEmitter();
	@Output() cancelUpdateCheck = new EventEmitter();
	@Output() cancelUpdateDownload = new EventEmitter();

	public progressValue = 0;
	public downloadingIcon = 'spinner';
	public installingIcon = 'spinner';
	public downloadingUpdateText = 'systemUpdates.banner.downloading';
	public installingTitleText = 'systemUpdates.banner.installingTitle';

	constructor(private translate: TranslateService) {
		this.translateString();
	}

	ngOnInit() { }

	onCheckForUpdates() {
		this.checkForUpdate.emit();
		document.getElementById('system-update-back-btn').focus();
	}

	cancelUpdates() {
		this.cancelUpdateCheck.emit();
	}

	onCancelUpdateDownload() {
		this.cancelUpdateDownload.emit();
	}

	private translateString() {
		this.translate.stream(this.downloadingUpdateText).subscribe((res) => {
			this.downloadingUpdateText = res;
		});
		this.translate.stream(this.installingTitleText).subscribe((res) => {
			this.installingTitleText = res;
		});
	}
}
