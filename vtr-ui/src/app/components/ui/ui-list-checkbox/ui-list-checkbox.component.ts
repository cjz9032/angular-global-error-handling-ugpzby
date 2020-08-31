import { Component, OnInit, Input, Output, EventEmitter, HostListener, OnDestroy } from '@angular/core';
import { NgbTooltip, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SecureMath } from '@lenovo/tan-client-bridge';

import { AvailableUpdateDetail } from 'src/app/data-models/system-update/available-update-detail.model';
import { CommonService } from 'src/app/services/common/common.service';
import { ModalUpdateChangeLogComponent } from '../../modal/modal-update-change-log.component/modal-update-change-log.component';
import { UpdateInstallSeverity } from 'src/app/enums/update-install-severity.enum';
import { LanguageService} from 'src/app/services/language/language.service';
import { Subscription } from 'rxjs';


@Component({
	selector: 'vtr-ui-list-checkbox',
	templateUrl: './ui-list-checkbox.component.html',
	styleUrls: ['./ui-list-checkbox.component.scss']
})

export class UiListCheckboxComponent implements OnInit, OnDestroy {

	@Input() items: Array<AvailableUpdateDetail>;
	@Input() isInstallationSuccess = false;
	@Input() isInstallationCompleted = false;
	@Output() readMore = new EventEmitter<any>();
	@Output() ignoreUpdate = new EventEmitter<any>();
	@Output() checkChange = new EventEmitter<any>();

	public manufacturer: string;
	public version: string;
	public installedVersion: string;
	public installedVersionStatus = 0;
	public downloadSizes: Array<string>;
	public diskSpaceNeeded: string;
	public readMeUrl = '';
	public packageRebootType: string;
	public isReadMeAvailable = false;
	public isIgnored = false;
	public severity = UpdateInstallSeverity.Optional;
	public packageName: string;
	public packageID: string;
	public selectedColor = 'rgba(73, 127, 253, 0.102)';
	public unselectedColor = '#f5f7f8';
	// Random number is used to have unique id of each input field
	randomNumber: number = Math.floor(new Date().valueOf() * SecureMath.random());

	public notInstalledText = 'systemUpdates.notInstalled';
	public notAvailableText = 'systemUpdates.notAvailable';
	private currentToolTip;
	private currentQuestionMarkID;
	translate1Subscription: Subscription;
	translate2Subscription: Subscription;

	constructor(
		private commonService: CommonService,
		private modalService: NgbModal,
		private translate: TranslateService,
		private languageService: LanguageService
	) {
		this.translateString();
	}

	ngOnInit() {
		this.getDownloadSize();
	 }

	onCheckChange($event: any) {
		this.checkChange.emit($event);
	}

	initSystemUpdateToolTip(update: AvailableUpdateDetail) {
		this.packageID = update.packageID;
		this.isIgnored = update.isIgnored;
		this.severity = update.packageSeverity;
		this.packageName = update.packageName;
		this.isReadMeAvailable = false;
		this.manufacturer = update.packageVendor;
		this.version = update.packageVersion;
		this.diskSpaceNeeded = this.commonService.formatBytes(parseInt(update.diskSpaceRequired, 10));
		this.readMeUrl = update.readmeUrl;
		this.packageRebootType = update.packageRebootType;
		if (this.readMeUrl && this.readMeUrl.length > 0 && this.readMeUrl.startsWith('http', 0)) {
			this.isReadMeAvailable = true;
		}
		this.installedVersion = update.currentInstalledVersion;

		if (update.currentInstalledVersion === null || update.currentInstalledVersion === undefined) {
			this.installedVersionStatus = 1; // notInstalledText;
		} else if (update.currentInstalledVersion.trim() === '' || update.currentInstalledVersion.trim().length === 0) {
			this.installedVersionStatus = 1; // notInstalledText;
		} else if (update.currentInstalledVersion === '0') {
			this.installedVersionStatus = 2; // notAvailableText;
		} else {
			this.installedVersionStatus = 0;
		}
	}

	onTooltipClick(update: AvailableUpdateDetail, tooltip) {
		this.currentQuestionMarkID = document.activeElement.id;
		if (tooltip) {
			if (tooltip.isOpen()) {
				tooltip.close();
			} else{
				this.initSystemUpdateToolTip(update);
				tooltip.open();
				this.currentToolTip = tooltip;
			}
		}
	}

	@HostListener('window:keyup', ['$event'])
	onKeyUp(event: KeyboardEvent) {
		if ((event.shiftKey && event.key === 'Tab') || event.key === 'Tab') {
			const activeId = document.activeElement.id || '';
			this.CloseToolTip(activeId);
		}
	}

	CloseToolTip(activeId){
		if(activeId &&
			activeId.indexOf("su-package-readme-") < 0 &&
			activeId.indexOf("su-ignore-update-") < 0 &&
			activeId.indexOf("su-unignore-update-") < 0 && this.currentToolTip && this.currentToolTip.isOpen()){
				this.currentToolTip.close();
		}
	}


	public onReadMoreClick($event) {
		this.readMore.emit($event);
		// const readMeUrl = 'https://download.lenovo.com/consumer/desktop/lnvusbss.txt';
		const updateModalMetrics = {
			pageName: 'Page.Device.SystemUpdate',
			pageContext: 'Read More',
			closeButton: 'ReadMoreCloseButton',
		};
		const modalRef = this.modalService.open(ModalUpdateChangeLogComponent,
			{
				backdrop: true,
				size: 'lg',
				windowClass: 'update-read-more-modal-size',
				centered: true
			});
		modalRef.componentInstance.url = this.readMeUrl;
		modalRef.componentInstance.updateModalMetrics = updateModalMetrics;
		this.focusOnElement(this.currentQuestionMarkID);
	}

	public onIgnoreUpdateClick(packageName: string, isIgnored: boolean) {
		this.ignoreUpdate.emit({packageName, isIgnored});
	}

	private translateString() {
		this.translate1Subscription = this.translate.stream(this.notAvailableText).subscribe((res) => {
			this.notAvailableText = res;
		});
		this.translate2Subscription = this.translate.stream(this.notInstalledText).subscribe((res) => {
			this.notInstalledText = res;
		});
	}

	private focusOnElement(element) {
		if (element && document.getElementById(element)) {
			document.getElementById(element).focus();
		}
	}

	ngOnDestroy() {
		if (this.translate1Subscription) {
			this.translate1Subscription.unsubscribe();
		}
		if (this.translate2Subscription) {
			this.translate2Subscription.unsubscribe();
		}
	}

	private getDownloadSize() {
		this.items.forEach(item => {
			item.downloadSize = this.commonService.formatBytes(parseInt(item.packageSize, 10));
		});
	}
}
