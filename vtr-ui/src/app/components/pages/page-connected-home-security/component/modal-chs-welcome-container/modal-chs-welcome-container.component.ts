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
import { LoggerService } from 'src/app/services/logger/logger.service';

@Component({
	selector: 'vtr-modal-chs-welcome-container',
	templateUrl: './modal-chs-welcome-container.component.html',
	styleUrls: ['./modal-chs-welcome-container.component.scss']
})
export class ModalChsWelcomeContainerComponent implements OnInit, AfterViewInit {
	switchPage = 1;
	url = 'ms-settings:privacy-location';
	showPageLocation = false;
	hasSystemPermissionShowed: boolean;
	isLocationServiceOn: boolean;
	chs: Phoenix.ConnectedHomeSecurity;
	permission: any;
	metricsParent = 'HomeSecurity';
	welcomeDesc = [{
		icon: 'personalDevice',
		desc: 'homeSecurity.tour.welcomeDesc1'
	}, {
		icon: 'places',
		desc: 'homeSecurity.tour.welcomeDesc2'
	}];
	constructor(
		public activeModal: NgbActiveModal,
		public homeSecurityMockService: HomeSecurityMockService,
		private vantageShellService: VantageShellService,
		private commonService: CommonService,
		private logger: LoggerService
	) {	}

	ngOnInit() {
		this.chs = this.vantageShellService.getConnectedHomeSecurity();
		if (!this.chs) {
			this.chs = this.homeSecurityMockService.getConnectedHomeSecurity();
		}
		this.permission = this.vantageShellService.getPermission();

		if (this.switchPage === 2) {
			this.showPageLocation = true;
		}

		this.chs.on(EventTypes.wsIsLocationServiceOnEvent, (data) => {
			this.isLocationServiceOn = data;
			if (data) {
				this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityWelcomeComplete, true);
				if (this.switchPage === 2) {
					this.closeModal();
				}
			} else {
				this.showPageLocation = !this.isLocationServiceOn;
			}
		});
	}

	ngAfterViewInit(): void {
		this.logger.info('chs welcome dialog - ngAfterViewInit');
		this.refreshPage();
	}

	refreshPage() {
		if (this.hasSystemPermissionShowed) {
			this.logger.info('refreshPage, hasSystemPermissionShowed');
			this.requestVantagePermission();
		} else {
			this.logger.info('refreshPage, get system permission showed');
			this.permission.getSystemPermissionShowed().then((response: boolean) => {
				this.logger.info('getSystemPermissionShowed done!', response);
				this.hasSystemPermissionShowed = response;
				if (!response) { return; }
				this.requestVantagePermission();
			});
		}
	}

	closeModal() {
		this.activeModal.close();
	}

	next() {
		this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityWelcomeComplete, true);
		if (this.isLocationServiceOn) {
			this.closeModal();
		} else {
			this.switchPage = 2;
			this.showPageLocation = true;
		}
	}

	public openLocation($event: any) {
		this.closeModal();
		this.permission.isComputerPermissionOn().then((result) => {
			if (result) {
				this.permission.getIsDevicePermissionOn().then((response) => {
					if (response) {
						this.permission.getSystemPermissionShowed().then((res) => {
							this.hasSystemPermissionShowed = res;
							if (res) {
								WinRT.launchUri(this.url);
							}
							this.requestVantagePermission();
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

	requestVantagePermission() {
		this.logger.info('requestVantagePermission!');
		this.permission.requestPermission('geoLocatorStatus').then((status: boolean) => {
			this.logger.info('get geolocation done!', {old: this.isLocationServiceOn, new: status});
			this.isLocationServiceOn = status;
			if (status) {
				this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityWelcomeComplete, true);
			}
		});
	}
}
