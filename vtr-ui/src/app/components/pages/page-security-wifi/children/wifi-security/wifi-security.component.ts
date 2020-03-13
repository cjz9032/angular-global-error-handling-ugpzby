import {
	Component,
	OnInit,
	Input,
	OnDestroy
} from '@angular/core';
import {
	NgbModal
} from '@ng-bootstrap/ng-bootstrap';
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
import { ConfigService } from 'src/app/services/config/config.service';
import { EventTypes } from '@lenovo/tan-client-bridge';

@Component({
	selector: 'wifi-security',
	templateUrl: './wifi-security.component.html',
	styleUrls: ['./wifi-security.component.scss']
})
export class WifiSecurityComponent extends BaseComponent implements OnInit, OnDestroy {
	@Input() data: WifiHomeViewModel;
	@Input() switchDisabled = false;
	isShowMore = true; // less info, more info
	isShowMoreLink = true; // show more link
	isWifiSecurityEnabled = true;
	showAllNetworks = true;
	showMore = false;
	hasMore: boolean;
	locatorButtonDisable = false;
	wsSetStateEventHandler = (res) => {
		if (res === 'finish') {
			this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecuritySetState, 'no');
			this.switchDisabled = false;
		}
	}

	constructor(
		public modalService: NgbModal,
		private commonService: CommonService,
		public	deviceService: DeviceService,
		private dialogService: DialogService,
		private configService: ConfigService
	) {
		super();
	}

	ngOnInit() {
		if (this.configService) {
			this.isShowMore = !this.configService.showCHS;
		}
		if (this.data && this.data.wifiSecurity) {
			this.data.wifiSecurity.on(EventTypes.wsSetStateEvent, this.wsSetStateEventHandler);
		}
	}

	ngOnDestroy() {
		this.data.wifiSecurity.off(EventTypes.wsSetStateEvent, this.wsSetStateEventHandler);
	}

	onToggleChange($event: any) {
		if (this.commonService.getSessionStorageValue(SessionStorageKey.SecurityWifiSecurityInWifiPage) === true) {
			this.switchDisabled = true;
			if (this.data.isLWSEnabled) {
				this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecuritySetState, 'yes');
				this.data.wifiSecurity.disableWifiSecurity();
			} else {
				this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecuritySetState, 'yes');
				this.data.wifiSecurity.enableWifiSecurity().catch(() => {
					this.dialogService.wifiSecurityLocationDialog(this.data.wifiSecurity);
				});
			}
		}
	}

	clickShowMore(): boolean {
		const length = this.data.histories.length;
		const allLength = this.data.allHistories.length;
		if (length === allLength || length === 8) {
			this.data.histories = this.data.allHistories.slice(0, 4);
			this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityShowHistoryNum, 4);
			this.isShowMoreLink = true;
		} else if (length + 2 >= allLength || length + 2 >= 8) {
			this.data.histories = this.data.allHistories.slice(0, 8);
			this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityShowHistoryNum, 8);
			this.isShowMoreLink = false;
		} else {
			this.data.histories = this.data.allHistories.slice(0, length + 2);
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

}
