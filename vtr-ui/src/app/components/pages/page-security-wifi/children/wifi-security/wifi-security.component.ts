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
import { ConfigService } from 'src/app/services/config/config.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'wifi-security',
	templateUrl: './wifi-security.component.html',
	styleUrls: ['./wifi-security.component.scss']
})
export class WifiSecurityComponent extends BaseComponent implements OnInit {
	@Input() data: WifiHomeViewModel;
	isShowMore = true; // less info, more info
	isShowMoreLink = true; // show more link
	isWifiSecurityEnabled = true;
	showAllNetworks = true;
	showMore = false;
	hasMore: boolean;
	locatorButtonDisable = false;
	@Output() toggleChange = new EventEmitter<void>()

	showMoreText = this.translate.instant('security.wifisecurity.container.showmore');
	showLessText = this.translate.instant('security.wifisecurity.container.showless');

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

	clickShowMore(): boolean {
		const length = this.data.histories.length;
		const allLength = this.data.allHistories.length;
		if (length === allLength || length === 8) {
			this.data.histories = this.data.allHistories.slice(0, 4);
			this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityShowHistoryNum, 4);
			this.isShowMoreLink = true;
		} else {
			this.data.histories = this.data.allHistories.slice(0, 8);
			this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityShowHistoryNum, 8);
			this.isShowMoreLink = false;
		}
		return false;
	}
}
