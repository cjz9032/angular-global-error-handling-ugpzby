import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbTooltip, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SecureMath } from '@lenovo/tan-client-bridge';

import { AvailableUpdateDetail } from 'src/app/data-models/system-update/available-update-detail.model';
import { CommonService } from 'src/app/services/common/common.service';
import { ModalUpdateChangeLogComponent } from '../../modal/modal-update-change-log.component/modal-update-change-log.component';
import { UpdateInstallSeverity } from 'src/app/enums/update-install-severity.enum';

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
	public isIgnored = false;
	public severity = UpdateInstallSeverity.Optional;
	public packageName: string;
	public packageID: string;
	// Random number is used to have unique id of each input field
	randomNumber: number = Math.floor(new Date().valueOf() * SecureMath.random());

	private notInstalledText = 'systemUpdates.notInstalled';
	private notAvailableText = 'systemUpdates.notAvailable';

	constructor(
		private commonService: CommonService,
		private modalService: NgbModal,
		private translate: TranslateService
	) {
		this.translateString();
	}

	ngOnInit() { }

	onCheckChange($event: any) {
		this.checkChange.emit($event);
	}

	onTooltipClick(update: AvailableUpdateDetail, tooltip: NgbTooltip) {
		if (tooltip && !tooltip.isOpen()) {
			this.packageID = update.packageID;
			this.isIgnored = update.isIgnored;
			this.severity = update.packageSeverity;
			this.packageName = update.packageName;
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

			if (update.currentInstalledVersion === null || update.currentInstalledVersion === undefined) {
				this.installedVersion = this.notInstalledText;
			} else if (update.currentInstalledVersion.trim() === '' || update.currentInstalledVersion.trim().length === 0) {
				this.installedVersion = this.notInstalledText;
			} else if (update.currentInstalledVersion === '0') {
				this.installedVersion = this.notAvailableText;
			} else {
				this.installedVersion = update.currentInstalledVersion;
			}
		}
	}

	public onReadMoreClick($event) {
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

	public onIgnoreUpdateClick(packageName: string, isIgnored: boolean) {
		this.ignoreUpdate.emit({packageName, isIgnored});
	}

	private translateString() {
		this.translate.stream(this.notAvailableText).subscribe((res) => {
			this.notAvailableText = res;
		});
		this.translate.stream(this.notInstalledText).subscribe((res) => {
			this.notInstalledText = res;
		});
	}
}
