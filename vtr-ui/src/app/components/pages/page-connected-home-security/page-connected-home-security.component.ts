import {
	Component,
	OnInit,
	NgZone,
	OnDestroy,
	HostListener,
	EventEmitter
} from '@angular/core';
import {
	EventTypes, ConnectedHomeSecurity, CHSDeviceOverview
} from '@lenovo/tan-client-bridge';
import {
	VantageShellService
} from '../../../services/vantage-shell/vantage-shell.service';
import {
	HomeSecurityAccount
} from 'src/app/data-models/home-security/home-security-account.model';
import {
	HomeSecurityPageStatus
} from 'src/app/data-models/home-security/home-security-page-status.model';
import { HomeSecurityNotification } from 'src/app/data-models/home-security/home-security-notification.model';
import { WidgetItem } from 'src/app/data-models/security-advisor/widget-security-status/widget-item.model';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalChsWelcomeContainerComponent } from '../../modal/modal-chs-welcome-container/modal-chs-welcome-container.component';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { HomeSecurityMockService } from 'src/app/services/home-security/home-security.service';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';
import { HomeSecurityWelcome } from 'src/app/data-models/home-security/home-security-welcome.model';
import { ModalLenovoIdComponent } from 'src/app/components/modal/modal-lenovo-id/modal-lenovo-id.component';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { LenovoIdStatus } from 'src/app/enums/lenovo-id-key.enum';
import { HomeSecurityOverviewMyDevice } from 'src/app/data-models/home-security/home-security-overview-my-device.model';

@Component({
	selector: 'vtr-page-connected-home-security',
	templateUrl: './page-connected-home-security.component.html',
	styleUrls: ['./page-connected-home-security.component.scss']
})
export class PageConnectedHomeSecurityComponent implements OnInit, OnDestroy {
	notifications: HomeSecurityNotification;
	pageStatus: HomeSecurityPageStatus;
	eventEmitter = new EventEmitter();

	welcomeModel: HomeSecurityWelcome;
	connectedHomeSecurity: ConnectedHomeSecurity;
	permission: any;
	homeSecurityOverviewMyDevice: HomeSecurityOverviewMyDevice;
	account: HomeSecurityAccount;

	testStatus = ['lessDevices-secure', 'moreDevices-needAttention', 'noneDevices', 'trialExpired', 'lessDevices-needAttention', 'moreDevices-secure', 'localAccount'];

	constructor(
		vantageShellService: VantageShellService,
		public  homeSecurityMockService: HomeSecurityMockService,
		private translateService: TranslateService,
		private modalService: NgbModal,
		private commonService: CommonService,
		private ngZone: NgZone
	) {
		this.connectedHomeSecurity = homeSecurityMockService.getConnectedHomeSecurity();
		this.permission = vantageShellService.getPermission();
		this.createMockData();
		this.welcomeModel = new HomeSecurityWelcome();
	}

	private createMockData() {
		this.notifications = {items: []};
		this.notifications.items.push(new WidgetItem({id: '2', title: '5 minutes disconnect', iconPath: 'assets/images/qa/svg_icon_qa_backup.svg',
		notificationDetail: 'Antivirus was disabled'}, this.translateService));
		this.notifications.items.push(new WidgetItem({id: '3', title: '10 minutes disconnect', iconPath: 'assets/images/qa/svg_icon_qa_pcbit.svg',
		notificationDetail: 'Antivirus was disabled'}, this.translateService));
		this.notifications.items.push(new WidgetItem({id: '1', title: 'Antivirus was disabled', iconPath: 'assets/images/qa/svg_icon_qa_battery.svg',
		notificationDetail: 'Antivirus was disabled'}, this.translateService));
		this.notifications.items.push(new WidgetItem({id: '1', title: 'Passcode lock disabled 3 hours', iconPath: 'assets/images/qa/svg_icon_qa_tablet.svg',
		notificationDetail: 'Antivirus was disabled'}, this.translateService));
		this.notifications.items.push(new WidgetItem({id: '1', title: '3 hours disconnect', iconPath: 'assets/images/qa/svg_icon_qa_cortana.svg',
		notificationDetail: 'Antivirus was disabled'}, this.translateService));
		this.notifications.items.push(new WidgetItem({id: '1', title: '8 minutes disconnect', iconPath: 'assets/images/qa/svg_icon_qa_battery.svg',
		notificationDetail: 'Antivirus was disabled'}, this.translateService));
		this.notifications.items.push(new WidgetItem({id: '1', title: 'Antivirus was disabled', iconPath: 'assets/images/qa/svg_icon_qa_pcbit.svg',
		notificationDetail: 'Antivirus was disabled'}, this.translateService));
		this.notifications.items.push(new WidgetItem({id: '1', title: 'Passcode lock disabled 3 hours', iconPath: 'assets/images/qa/svg_icon_qa_refresh.svg',
		notificationDetail: 'Antivirus was disabled'}, this.translateService));
	}

	ngOnInit() {
		this.welcomeModel.isLenovoIdLogin = false; // mock data;
		this.commonService.setSessionStorageValue(SessionStorageKey.HomeProtectionInCHSPage, true);
		this.permission.getSystemPermissionShowed().then((response) =>  {
			this.welcomeModel.hasSystemPermissionShowed = response;
			if (typeof this.welcomeModel.hasSystemPermissionShowed === 'boolean') {
				this.openModal();
			}
		});
		this.connectedHomeSecurity.on(EventTypes.chsHasSystemPermissionShowedEvent, (data) => {
			this.welcomeModel.hasSystemPermissionShowed = data;
		});

		this.homeSecurityOverviewMyDevice = new HomeSecurityOverviewMyDevice(this.translateService);
		const cacheHomeDevicePosture = this.commonService.getLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityDevicePostures);
		const cacheHomeDeviceName = this.commonService.getLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityDeviceName);
		const cacheHomeDeviceStatus = this.commonService.getLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityDeviceStatus);
		if (this.connectedHomeSecurity && this.connectedHomeSecurity.overview) {
			if (this.connectedHomeSecurity.overview.devicePostures && this.connectedHomeSecurity.overview.devicePostures.value.length > 0) {
				this.homeSecurityOverviewMyDevice.createHomeDevicePosture(this.connectedHomeSecurity.overview.devicePostures.value);
				this.homeSecurityOverviewMyDevice.creatDeviceStatus(this.connectedHomeSecurity.overview.devicePostures.value);
				this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityDevicePostures, this.homeSecurityOverviewMyDevice.devicePostures);
				this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityDeviceStatus, this.homeSecurityOverviewMyDevice.deviceStatus);
			} else {
				if (cacheHomeDevicePosture) {
					this.homeSecurityOverviewMyDevice.devicePostures = cacheHomeDevicePosture;
				}
				if (cacheHomeDeviceStatus) {
					this.homeSecurityOverviewMyDevice.deviceStatus = cacheHomeDeviceStatus;
				}
			}
			if (this.connectedHomeSecurity.overview.myDevice && this.connectedHomeSecurity.overview.myDevice.name) {
				this.homeSecurityOverviewMyDevice.deviceName = this.connectedHomeSecurity.overview.myDevice.name;
				this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityDeviceName, this.homeSecurityOverviewMyDevice.deviceName);
			} else if (cacheHomeDeviceName) {
				this.homeSecurityOverviewMyDevice.deviceName = cacheHomeDeviceName;
			}
		}
		const cacheAccount = this.commonService.getLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityAccount);
		if (cacheAccount) {
			this.account = cacheAccount;
		}
		if (this.connectedHomeSecurity.account) {
			this.account = new HomeSecurityAccount(this.connectedHomeSecurity.account);
			this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityAccount, this.account);
		}
		this.connectedHomeSecurity.on(EventTypes.chsEvent, (chs: ConnectedHomeSecurity) => {
			if (chs && chs.overview) {
				if (chs.overview.devicePostures && chs.overview.devicePostures.value.length > 0) {
					this.homeSecurityOverviewMyDevice.createHomeDevicePosture(chs.overview.devicePostures.value);
					this.homeSecurityOverviewMyDevice.creatDeviceStatus(chs.overview.devicePostures.value);
					this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityDevicePostures, this.homeSecurityOverviewMyDevice.devicePostures);
					this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityDeviceStatus, this.homeSecurityOverviewMyDevice.deviceStatus);
				}
				if (chs.overview.myDevice && chs.overview.myDevice.name) {
					this.homeSecurityOverviewMyDevice.deviceName = chs.overview.myDevice.name;
					this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityDeviceName, this.homeSecurityOverviewMyDevice.deviceName);
				}
			}
			if (chs.account) {
				this.account = new HomeSecurityAccount(chs.account);
				this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityAccount, this.account);
			}
		});
	}

	ngOnDestroy() {
		this.commonService.setSessionStorageValue(SessionStorageKey.HomeProtectionInCHSPage, false);
	}

	@HostListener('window: focus')
	onFocus(): void {
		this.permission.getSystemPermissionShowed().then(response =>  {
			this.welcomeModel.hasSystemPermissionShowed = response;
		});
		this.welcomeModel.isLenovoIdLogin = false; // mock data;
	}

	openModal() {
		if (this.commonService.getSessionStorageValue(SessionStorageKey.HomeProtectionInCHSPage, true)) {
			if (this.modalService.hasOpenModals()) {
				return;
			}
			if (this.welcomeModel.hasSystemPermissionShowed) {
				this.requireLocationModal();
			} else if (this.welcomeModel.hasSystemPermissionShowed === false) {
				this.notRequireLocationModal();
			}
		}
	}

	requireLocationModal() {
		const showW = this.commonService.getLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityShowWelcome, 1);
		this.permission.requestPermission('geoLocatorStatus').then((status) => {
			this.welcomeModel.isLocationServiceOn = status;
			this.getSwitchAndContainerPage(status, this.welcomeModel.isLenovoIdLogin);
			if (showW < 3 || status === false) {
				this.ngZone.run(() => {
					const welcomeModal = this.modalService.open(ModalChsWelcomeContainerComponent, {
						backdrop: 'static',
						size: 'lg',
						centered: true,
						windowClass: 'Welcome-container-Modal'
					});
					welcomeModal.componentInstance.hasSystemPermissionShowed = this.welcomeModel.hasSystemPermissionShowed;
					welcomeModal.componentInstance.isLocationServiceOn = this.welcomeModel.isLocationServiceOn;
					welcomeModal.componentInstance.isLenovoIdLogin = this.welcomeModel.isLenovoIdLogin;
					welcomeModal.componentInstance.containerPage = this.welcomeModel.containerPage;
					welcomeModal.componentInstance.switchPage = this.welcomeModel.switchPage;
					this.welcomeModel.showWelcome = showW + 1;
					this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityShowWelcome, this.welcomeModel.showWelcome);
				});
			}
		});
	}

	notRequireLocationModal() {
		const showW = this.commonService.getLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityShowWelcome, 1);
		this.getSwitchAndContainerPage(false, this.welcomeModel.isLenovoIdLogin);
		this.ngZone.run(() => {
			const welcomeModal = this.modalService.open(ModalChsWelcomeContainerComponent, {
				backdrop: 'static',
				size: 'lg',
				centered: true,
				windowClass: 'Welcome-container-Modal'
			});
			welcomeModal.componentInstance.hasSystemPermissionShowed = this.welcomeModel.hasSystemPermissionShowed;
			welcomeModal.componentInstance.isLenovoIdLogin = this.welcomeModel.isLenovoIdLogin;
			welcomeModal.componentInstance.containerPage = this.welcomeModel.containerPage;
			welcomeModal.componentInstance.switchPage = this.welcomeModel.switchPage;
			this.welcomeModel.showWelcome = showW + 1;
			this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityShowWelcome, this.welcomeModel.showWelcome);
		});
	}

	getSwitchAndContainerPage(isLocationServiceOn, isLenovoIdLogin) {
		const showW = this.commonService.getLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityShowWelcome, 1);
		if (isLocationServiceOn === false && isLenovoIdLogin === false) {
			this.welcomeModel.containerPage = 4;
		} else if (isLocationServiceOn && isLenovoIdLogin) {
			this.welcomeModel.containerPage = 2;
		} else {
			this.welcomeModel.containerPage = 3;
		}
		if (showW < 3) {
			this.welcomeModel.switchPage = 1;
		} else {
			if (isLocationServiceOn === false) {
				this.welcomeModel.switchPage = 4;
			}
		}
	}

	onStartTrial() {
		if (this.connectedHomeSecurity.account.lenovoId.loggedIn) {
			this.connectedHomeSecurity.account.createAccount();
		} else {
			this.modalService.open(ModalLenovoIdComponent, {
				backdrop: 'static',
				centered: true,
				windowClass: 'lenovo-id-modal-size'
			});
			this.commonService.notification.subscribe((notification: AppNotification) => {
				if (notification && notification.type === LenovoIdStatus.SignedIn) {
					this.connectedHomeSecurity.account.createAccount();
				}
			});
		}
	}

	onManageAccount(feature: string) {
		this.connectedHomeSecurity.account.visitWebConsole(feature);
	}

	onUpgradeAccount() {
		this.connectedHomeSecurity.account.purchase();
	}

	public switchStatus() {
		if (this.testStatus.length === 0) {
			this.testStatus = ['loading', 'lessDevices-secure', 'moreDevices-needAttention', 'noneDevices', 'trialExpired', 'lessDevices-needAttention', 'moreDevices-secure', 'localAccount'];
		}
		this.eventEmitter.emit(this.testStatus.shift());
	}
}
