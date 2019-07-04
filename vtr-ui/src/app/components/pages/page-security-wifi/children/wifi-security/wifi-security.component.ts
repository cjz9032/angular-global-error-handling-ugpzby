import {
	Component,
	OnInit,
	Input,
	NgZone
} from '@angular/core';
import {
	NgbModalRef,
	NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import {
	ModalThreatLocatorComponent
} from 'src/app/components/modal/modal-threat-locator/modal-threat-locator.component';
import {
	WifiHomeViewModel
} from 'src/app/data-models/security-advisor/wifisecurity.model';
import {
	EventTypes
} from '@lenovo/tan-client-bridge';
import {
	BaseComponent
} from '../../../../base/base.component';
import {
	CommonService
} from 'src/app/services/common/common.service';
import {
	RegionService
} from 'src/app/services/region/region.service';
import {
	SessionStorageKey
} from 'src/app/enums/session-storage-key-enum';
import {
	DialogService
} from 'src/app/services/dialog/dialog.service';

@Component({
	selector: 'wifi-security',
	templateUrl: './wifi-security.component.html',
	styleUrls: ['./wifi-security.component.scss']
})
export class WifiSecurityComponent extends BaseComponent implements OnInit {
	@Input() data: WifiHomeViewModel;
	@Input() wifiIsShowMore: string;
	isShowMore = true; // less info, more info
	isShowMoreLink = true; // show more link
	region: string;
	isCollapsed = true;
	isWifiSecurityEnabled = true;
	showAllNetworks = true;
	showMore = false;
	hasMore: boolean;
	switchDisabled = false;
	locatorButtonDisable = false;
	cancelClick = false;

	constructor(
		public modalService: NgbModal,
		private commonService: CommonService,
		public regionService: RegionService,
		private dialogService: DialogService,
		private ngZone: NgZone
	) {
		super();
	}

	ngOnInit() {
		this.regionService.getRegion().subscribe({
			next: x => {
				this.region = x;
			},
			error: err => {
				console.error(err);
				this.region = 'US';
			}
		});
		if (this.wifiIsShowMore === 'false') {
			this.isShowMore = false;
		}

		this.data.wifiSecurity.on('cancelClick', () => {
			this.cancelClick = true;
		}).on('cancelClickFinish', () => {
			this.cancelClick = false;
		});
	}

	enableWifiSecurity(): void {
		try {
			if (this.data.wifiSecurity) {
				this.data.wifiSecurity.enableWifiSecurity().then((res) => {
					if (res === true) {
						this.data.isLWSEnabled = true;
					} else {
						this.data.isLWSEnabled = false;
					}
					this.data.homeProtection.refresh();
				}, (error) => {
					this.dialogService.wifiSecurityLocationDialog(this.data.wifiSecurity);
				});
			}
		} catch {
			throw new Error('wifiSecurity is null');
		}
	}

	disableWifiSecurity(): void {
		try {
			if (this.data.wifiSecurity) {
				this.data.wifiSecurity.disableWifiSecurity().then((res) => {
					if (res === true) {
						this.data.isLWSEnabled = false;
					} else {
						this.data.isLWSEnabled = true;
					}
				});
			}
		} catch {
			throw new Error('wifiSecurity is null');
		}
	}

	onToggleChange($event: any) {
		if (this.commonService.getSessionStorageValue(SessionStorageKey.SecurityWifiSecurityInWifiPage) === true) {
			this.switchDisabled = true;
			if (this.data.isLWSEnabled) {
				this.data.wifiSecurity.disableWifiSecurity().then((res) => {
					if (res === true) {
						this.data.isLWSEnabled = false;
					} else {
						this.data.isLWSEnabled = true;
					}
					this.switchDisabled = false;
				});
			} else {
				this.data.wifiSecurity.enableWifiSecurity().then((res) => {
						if (res === true) {
							this.data.isLWSEnabled = true;
						} else {
							this.data.isLWSEnabled = false;
						}
						this.switchDisabled = false;
					},
					(error) => {
						this.data.isLWSEnabled = false;
						this.dialogService.wifiSecurityLocationDialog(this.data.wifiSecurity);
						this.switchDisabled = false;
					}
				);
			}
		}
	}

	clickShowMore(): boolean {
		const length = this.data.historys.length;
		const all_length = this.data.allHistorys.length;
		if (length === all_length || length === 8) {
			this.data.historys = this.data.allHistorys.slice(0, 4);
			this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityShowHistoryNum, 4);
			this.isShowMoreLink = true;
		} else if (length + 2 >= all_length || length + 2 >= 8) {
			this.data.historys = this.data.allHistorys.slice(0, 8);
			this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityShowHistoryNum, 8);
			this.isShowMoreLink = false;
		} else {
			this.data.historys = this.data.allHistorys.slice(0, length + 2);
			this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityShowHistoryNum, length + 2);
		}
		return false;
	}

	isDisableToggle(): boolean {
		if (this.data.isLWSEnabled === undefined) {
			this.switchDisabled = true;
			return true;
		} else {
			this.switchDisabled = false;
			return false;
		}
	}

	openThreatLocator() {
		if (this.modalService.hasOpenModals()) {
			return;
		}
		this.locatorButtonDisable = true;
		const threatLocatorModal: NgbModalRef = this.modalService.open(ModalThreatLocatorComponent, {
			backdrop: true,
			size: 'lg',
			centered: true,
			windowClass: 'Threat-Locator-Modal'
		});
		threatLocatorModal.result.finally(() => {
			this.locatorButtonDisable = false;
		});
	}
}
