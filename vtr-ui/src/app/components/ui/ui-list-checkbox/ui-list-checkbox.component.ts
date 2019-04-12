import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbTooltip, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AvailableUpdateDetail } from 'src/app/data-models/system-update/available-update-detail.model';
import { CommonService } from 'src/app/services/common/common.service';
import { ModalUpdateChangeLogComponent } from '../../modal/modal-update-change-log.component/modal-update-change-log.component';

@Component({
	selector: 'vtr-ui-list-checkbox',
	templateUrl: './ui-list-checkbox.component.html',
	styleUrls: ['./ui-list-checkbox.component.scss']
})

export class UiListCheckboxComponent implements OnInit {

	@Input() items: Array<AvailableUpdateDetail>;
	@Input() isInstallationSuccess = false;
	@Input() isInstallationCompleted = false;
	@Output() readMore = new EventEmitter<any>();
	@Output() ignoreUpdate = new EventEmitter<any>();
	@Output() checkChange = new EventEmitter<any>();

	public manufacturer: string;
	public version: string;
	public installedVersion: string;
	public downloadSize: string;
	public diskSpaceNeeded: string;
	public readMeUrl = '';
	public packageRebootType: string;
	public isReadMeAvailable = false;
	// Random number is used to have unique id of each input field
	randomNumber: number = Math.floor(new Date().valueOf() * Math.random());

	constructor(
		private commonService: CommonService
		, private modalService: NgbModal
	) { }

	ngOnInit() { }

	onCheckChange($event: any) {
		this.checkChange.emit($event);
	}

	onTooltipClick(update: AvailableUpdateDetail, tooltip: NgbTooltip) {
		if (tooltip && !tooltip.isOpen()) {
			this.isReadMeAvailable = false;
			this.manufacturer = update.packageVendor;
			this.version = update.packageVersion;
			this.downloadSize = this.commonService.formatBytes(parseInt(update.packageSize, 10));
			this.diskSpaceNeeded = this.commonService.formatBytes(parseInt(update.diskSpaceRequired, 10));
			this.readMeUrl = update.readmeUrl;
			this.packageRebootType = update.packageRebootType;
			if (this.readMeUrl && this.readMeUrl.length > 0 && this.readMeUrl.startsWith('http', 0)) {
				this.isReadMeAvailable = true;
			}
			if (update.currentInstalledVersion && update.currentInstalledVersion.trim().length === 0) {
				this.installedVersion = 'device.systemUpdates.notInstalled';
			} else if (update.currentInstalledVersion === '0') {
				this.installedVersion = 'device.systemUpdates.notAvailable';
			} else {
				this.installedVersion = update.currentInstalledVersion;
			}
		}
	}

	public onReadMoreClick($event) {
		console.log('onReadMoreClick');
		this.readMore.emit($event);
		// const readMeUrl = 'https://download.lenovo.com/consumer/desktop/lnvusbss.txt';
		const modalRef = this.modalService.open(ModalUpdateChangeLogComponent,
			{
				backdrop: 'static',
				size: 'lg',
				windowClass: 'update-read-more-modal-size',
				centered: true
			});
		modalRef.componentInstance.url = this.readMeUrl;
	}

	public onIgnoreUpdateClick($event) {
		this.ignoreUpdate.emit($event);
	}
}
