import {
	Component,
	OnInit,
	AfterViewInit
} from '@angular/core';
import {
	NgbActiveModal
} from '@ng-bootstrap/ng-bootstrap';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { EventTypes, WinRT } from '@lenovo/tan-client-bridge';
import * as Phoenix from '@lenovo/tan-client-bridge';
import { HomeSecurityMockService } from 'src/app/services/home-security/home-security-mock.service';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

@Component({
	selector: 'vtr-modal-chs-welcome-container',
	templateUrl: './modal-chs-welcome-container.component.html',
	styleUrls: ['./modal-chs-welcome-container.component.scss']
})
export class ModalChsWelcomeContainerComponent implements OnInit, AfterViewInit {
	switchPage = 1;
	isLenovoIdLogin: boolean;
	url = 'ms-settings:privacy-location';
	showPageLocation = false;
	hasSystemPermissionShowed: boolean;
	isLocationServiceOn: boolean;
	chs: Phoenix.ConnectedHomeSecurity;
	permission: any;
	metricsParent = 'ConnectedHomeSecurity';
	constructor(
		public activeModal: NgbActiveModal,
		public homeSecurityMockService: HomeSecurityMockService,
		private vantageShellService: VantageShellService,
		private commonService: CommonService
	) {
		this.chs = vantageShellService.getConnectedHomeSecurity();
		if (!this.chs) {
			this.chs = this.homeSecurityMockService.getConnectedHomeSecurity();
		}
		this.permission = vantageShellService.getPermission();
	}

	ngOnInit() {
		switch (this.switchPage) {
			case 2:
				this.showPageLocation = true;
				break;
			default:
				break;
		}

		this.chs.on(EventTypes.wsIsLocationServiceOnEvent, (data) => {
			this.isLocationServiceOn = data;
			if (data && this.switchPage === 2) {
				this.closeModal();
			} else {
				this.showPageLocation = !this.isLocationServiceOn;
			}
		});
	}

	ngAfterViewInit(): void {
		this.refreshPage();
	}

	refreshPage() {
		if (this.hasSystemPermissionShowed) {
			this.permission.requestPermission('geoLocatorStatus').then((status: boolean) => {
				this.isLocationServiceOn = status;
			});
		} else {
			this.permission.getSystemPermissionShowed().then((response: boolean) => {
				this.hasSystemPermissionShowed = response;
				if (!response) { return; }
				this.permission.requestPermission('geoLocatorStatus').then((status: boolean) => {
					this.isLocationServiceOn = status;
				});
			});
		}
	}

	closeModal() {
		this.activeModal.close();
	}

	next() {
		if (this.isLocationServiceOn) {
			this.closeModal();
		} else {
			this.switchPage = 2;
			this.showPageLocation = true;
		}
	}

	public openLocation($event: any) {
		this.permission.isComputerPermissionOn().then((result) => {
			if (result) {
				this.permission.getIsDevicePermissionOn().then((response) => {
					if (response) {
						this.permission.getSystemPermissionShowed().then((res) => {
							this.hasSystemPermissionShowed = res;
							if (res) {
								WinRT.launchUri(this.url);
							}
							this.permission.requestPermission('geoLocatorStatus').then((status) => {
								this.isLocationServiceOn = status;
								if (status) {
									this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityWelcomeComplete, true);
								}
							});
						});
					} else {
						WinRT.launchUri(this.url);
					}
				});
			} else {
				WinRT.launchUri(this.url);
			}
		});
	}
}
