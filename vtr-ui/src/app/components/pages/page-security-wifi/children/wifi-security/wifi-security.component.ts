import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter
} from '@angular/core';
import {
	NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import {
	WifiSecurityService
} from 'src/app/services/security/wifi-security.service';
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
import { ConfigService } from 'src/app/services/config/config.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'wifi-security',
	templateUrl: './wifi-security.component.html',
	styleUrls: ['./wifi-security.component.scss']
})
export class WifiSecurityComponent extends BaseComponent implements OnInit {
	isShowMore = true; // less info, more info
	isShowMoreLink = true; // show more link
	isWifiSecurityEnabled = true;
	showAllNetworks = true;
	showMore = false;
	hasMore: boolean;
	locatorButtonDisable = false;
	@Output() toggleChange = new EventEmitter<void>()

	private _data: WifiSecurityService;

	get data(): WifiSecurityService {
		return this._data;
	}

	@Input()
	set data(val: WifiSecurityService) {
		if (!this._data || val.isLWSEnabled !== this._data.isLWSEnabled) {
			this.switchLabel = `${this.wsNameText} ${val.isLWSEnabled ? this.wsEnabledText : this.wsDisabledText}`;
		}
		this._data = val;
	}

	showMoreText = this.translate.instant('security.wifisecurity.container.showmore');
	showLessText = this.translate.instant('security.wifisecurity.container.showless');

	wsNameText = this.translate.instant('security.wifisecurity.container.name');
	wsEnabledText = this.translate.instant('security.wifisecurity.container.enable');
	wsDisabledText = this.translate.instant('security.wifisecurity.container.disable');
	switchLabel = '';

	networkLevel = [
		'neutral network',
		'abnormal network',
		'highly suspicious network'
	]

	constructor(
		public modalService: NgbModal,
		private commonService: CommonService,
		public	deviceService: DeviceService,
		private configService: ConfigService,
		private translate: TranslateService,
	) {
		super();
	}

	ngOnInit() {
		if (this.configService) {
			this.isShowMore = !this.configService.showCHS;
		}
	}

	noticeToggleChange() {
		this.toggleChange.emit();
	}

	clickShowMore() {
		const length = this.data.histories.filter(item => !!item.visible).length;
		const allLength = this.data.histories.length;
		if (length === allLength || length === 8) {
			this.data.hideHistories(this.data.histories, 4);
			this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityShowHistoryNum, 4);
			this.isShowMoreLink = true;
		} else {
			this.data.hideHistories(this.data.histories, 8);
			this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityShowHistoryNum, 8);
			this.isShowMoreLink = false;
		}
	}
}
