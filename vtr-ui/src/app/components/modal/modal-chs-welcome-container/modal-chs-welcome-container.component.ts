import {
	Component,
	OnInit,
	Input,
	HostListener
} from '@angular/core';
import {
	NgbActiveModal, NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import {
	CommonService
} from 'src/app/services/common/common.service';
import * as phoenix from '@lenovo/tan-client-bridge';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { EventTypes, WinRT } from '@lenovo/tan-client-bridge';
import * as Phoenix from '@lenovo/tan-client-bridge';
import { ModalLenovoIdComponent } from '../modal-lenovo-id/modal-lenovo-id.component';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { HomeSecurityMockService } from 'src/app/services/home-security/home-security.service';

@Component({
	selector: 'vtr-modal-chs-welcome-container',
	templateUrl: './modal-chs-welcome-container.component.html',
	styleUrls: ['./modal-chs-welcome-container.component.scss']
})
export class ModalChsWelcomeContainerComponent implements OnInit {
	containerPage: number;
	switchPage: number = 1;
	isLenovoIdLogin: boolean = false; // mock data
	url = 'ms-settings:privacy-location';
	showPageFour = false;
	hasSystemPermissionShowed: boolean;
	isLocationServiceOn: boolean;
	chs: Phoenix.ConnectedHomeSecurity;
	permission: any;
	disabled = false;
	constructor(
		public activeModal: NgbActiveModal,
		public homeSecurityMockService: HomeSecurityMockService,
		private vantageShellService: VantageShellService,
		private commonService: CommonService,
		public modalService: NgbModal
	) {
		this.chs = homeSecurityMockService.getConnectedHomeSecurity();
		this.permission = vantageShellService.getPermission();
	}

	@HostListener('window: focus')
	onFocus(): void {
		this.refreshPage();
	}

	ngOnInit() {
		this.refreshPage();
		this.chs.on(EventTypes.chsHasSystemPermissionShowedEvent, (data) => {
			this.hasSystemPermissionShowed = data;
			if (data) {
				this.permission.requestPermission('geoLocatorStatus').then((status) => {
					this.isLocationServiceOn = status;
				});
			}
		});

		this.chs.on(EventTypes.wsIsLocationServiceOnEvent, (data) => {
			this.isLocationServiceOn = data;
			if (this.switchPage === 4) {
				this.showPageFour = true;
			} else {
				this.showPageFour = !this.isLocationServiceOn;
			}
		});

		this.chs.on(EventTypes.chsEvent, (chsData) => {
			if (chsData.account.lenovoId) {
				this.isLenovoIdLogin = chsData.account.lenovoId.loggedIn;
			}
		});
	}

	refreshPage() {
		if (this.switchPage === 4) {
			this.showPageFour = true;
		}
		this.permission.getSystemPermissionShowed().then((response: boolean) => {
			this.hasSystemPermissionShowed = response;
			if (response) {
				this.permission.requestPermission('geoLocatorStatus').then((status) => {
					this.isLocationServiceOn = status;
				});
			}
		});
		this.isLenovoIdLogin = this.chs.account.lenovoId.loggedIn;
	}

	closeModal() {
		this.activeModal.close('close');
	}

	next(switchPage, isLenovoIdLogin, isLocationServiceOn) {
		if (switchPage === 1) {
			this.switchPage = 2;
		} else if (switchPage === 2) {
			if (isLenovoIdLogin) {
				this.disabled = true;
				this.chs.account.createAccount().then((trial: boolean) => {
					if (trial) {
						this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityWelcomeComplete, true);
					}
					if (isLocationServiceOn && trial) {
						this.disabled = false;
						this.closeModal();
					} else {
						this.switchPage = 4;
						this.showPageFour = true;
					}
				});
			} else {
				this.switchPage = 3;
			}
		} else if (switchPage === 3) {
			this.disabled = true;
			this.chs.account.createAccount().then((trial: boolean) => {
				if (trial) {
					this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityWelcomeComplete, true);
				}
				if (isLocationServiceOn && trial) {
					this.disabled = false;
					this.closeModal();
				} else {
					this.switchPage = 4;
					this.showPageFour = true;
				}
			});

		} else if (switchPage === 4) {
			this.closeModal();
		}
	}

	prev(switchPage) {
		if (switchPage > 0) {
			this.switchPage = switchPage - 1;
		}
	}

	public openLocation($event: any) {
		this.permission.getIsDevicePermissionOn().then((response) => {
			if (response && !this.hasSystemPermissionShowed) {
				this.permission.requestPermission('geoLocatorStatus').then((status) => {
					this.isLocationServiceOn = status;
				});
			} else {
				WinRT.launchUri(this.url);
				this.permission.requestPermission('geoLocatorStatus').then((status) => {
					this.isLocationServiceOn = status;
				});
			}
		});
	}

	openLenovoId() {
		this.modalService.open(ModalLenovoIdComponent, {
			backdrop: 'static',
			centered: true,
			windowClass: 'lenovo-id-modal-size'
		});
	}
}
