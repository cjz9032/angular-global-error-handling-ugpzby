import { Component, Input, OnInit, NgZone, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
	selector: 'vtr-widget-device-update',
	templateUrl: './widget-device-update.component.html',
	styleUrls: ['./widget-device-update.component.scss']
})
export class WidgetDeviceUpdateComponent implements OnInit, OnChanges {
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
	@Input() downloadingUpdateText = '';
	@Input() downloadingPercent = 0;
	@Input() installingUpdateText = 'Installing updates';
	@Input() installingPercent = 0;
	@Output() checkForUpdate = new EventEmitter();
	@Output() cancelUpdateCheck = new EventEmitter();
	@Output() cancelUpdateDownload = new EventEmitter();

	public progressValue = 0;
	public downloadingIcon = 'spinner';
	public installingIcon = 'spinner';
	private downloadingText = 'systemUpdates.banner.downloading';

	constructor(private translate: TranslateService) { 
		this.translateString();
	}

	ngOnInit() { }

	ngOnChanges(changes: SimpleChanges) {
		if (changes && changes.downloadingPercent) {
			if (changes.downloadingPercent.currentValue === 100) {
				this.downloadingUpdateText = `${this.downloadingText}`;
			} else {
				this.downloadingUpdateText = this.downloadingText;
			}
		}
	}

	onCheckForUpdates() {
		this.checkForUpdate.emit();
	}

	cancelUpdates() {
		this.cancelUpdateCheck.emit();
	}

	onCancelUpdateDownload() {
		this.cancelUpdateDownload.emit();
	}

	private translateString() {
		this.translate.stream(this.downloadingText).subscribe((res) => {
			this.downloadingText = res;
		});
	}
}
