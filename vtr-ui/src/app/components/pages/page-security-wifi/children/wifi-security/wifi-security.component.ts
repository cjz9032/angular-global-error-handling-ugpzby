import {
	Component,
	OnInit,
	Input
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
	BaseComponent
} from '../../../../base/base.component';
import {
	CommonService
} from 'src/app/services/common/common.service';
import {
	DeviceService
} from 'src/app/services/device/device.service';
import {
	SessionStorageKey
} from 'src/app/enums/session-storage-key-enum';
import {
	DialogService
} from 'src/app/services/dialog/dialog.service';
import { LocalInfoService } from 'src/app/services/local-info/local-info.service';

@Component({
	selector: 'wifi-security',
	templateUrl: './wifi-security.component.html',
	styleUrls: ['./wifi-security.component.scss']
})
export class WifiSecurityComponent extends BaseComponent implements OnInit {
	@Input() data: WifiHomeViewModel;
	@Input() isShowHistory: string;
	@Input() showChs = false;
	isShowMore = true; // less info, more info
	isShowMoreLink = true; // show more link
	region = 'us';
	language = 'en';
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
		public	deviceService: DeviceService,
		private localInfoService: LocalInfoService,
		private dialogService: DialogService
	) {
		super();
	}

	ngOnInit() {
		this.localInfoService.getLocalInfo().then(result => {
			this.region = result.GEO;
			this.language = result.Lang;
		}).catch(e => {
			this.region = 'us';
			this.language = 'en';
		});
		if (!this.showChs || this.isShowHistory === 'false') {
			this.isShowMore = false;
		}
		this.data.wifiSecurity.on('cancelClick', () => {
			this.cancelClick = true;
		}).on('cancelClickFinish', () => {
			this.cancelClick = false;
		});
	}

	enableWifiSecurity(): void {
		if (this.data && this.data.wifiSecurity) {
			this.data.wifiSecurity.enableWifiSecurity().then((res) => {
				if (res === true) {
					this.data.isLWSEnabled = true;
				} else {
					this.data.isLWSEnabled = false;
				}
			}, (error) => {
				this.dialogService.wifiSecurityLocationDialog(this.data.wifiSecurity);
			});
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
		setTimeout(() => { document.getElementById('modal-threat-locator').parentElement.parentElement.parentElement.parentElement.focus(); }, 0);
		threatLocatorModal.result.then(() => {
			this.locatorButtonDisable = false;
		}).catch(() => {
			this.locatorButtonDisable = false;
		});
	}
}
