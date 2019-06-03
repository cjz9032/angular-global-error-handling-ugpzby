import {
	Component,
	OnInit,
	NgZone,
	OnDestroy,
	HostListener
} from '@angular/core';
import {
	HomeSecurityHomeGroup
} from '../../../data-models/home-security/home-security-home-group.model';
import {
	HomeSecurityMemberGroup
} from '../../../data-models/home-security/home-security-member-group.model';
import {
	SecurityAdvisor, EventTypes, ConnectedHomeSecurity
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
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalChsWelcomeContainerComponent } from '../../modal/modal-chs-welcome-container/modal-chs-welcome-container.component';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { SecurityService } from 'src/app/services/security/security.service';
import { HomeSecurityMockService } from 'src/app/services/home-security/home-security.service';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';
import { HomeSecurityWelcome } from 'src/app/data-models/home-security/home-securty-welcome.model';

@Component({
	selector: 'vtr-page-connected-home-security',
	templateUrl: './page-connected-home-security.component.html',
	styleUrls: ['./page-connected-home-security.component.scss']
})
export class PageConnectedHomeSecurityComponent implements OnInit, OnDestroy {
	myFamilyMembers: Map < string,
	HomeSecurityMemberGroup > ;
	myHomes: Map < string,
	HomeSecurityHomeGroup > ;
	securityAdvisor: SecurityAdvisor;
	notifications: HomeSecurityNotification;
	account: HomeSecurityAccount;
	pageStatus: HomeSecurityPageStatus;

	welcomeModel: HomeSecurityWelcome;
	connectedHomeSecurity: ConnectedHomeSecurity;
	permission: any;

	constructor(
		private vantageShellService: VantageShellService,
		public  homeSecurityMockService: HomeSecurityMockService,
		private translateService: TranslateService,
		private modalService: NgbModal,
		private commonService: CommonService,
		private securityService: SecurityService,
		private ngZone: NgZone
	) {
		this.securityAdvisor = vantageShellService.getSecurityAdvisor();
		this.connectedHomeSecurity = vantageShellService.getConnectedHomeSecurity();
		this.permission = vantageShellService.getPermission();
		this.createMockData();
		this.welcomeModel = new HomeSecurityWelcome();
	}

	private createMockData() {
		this.notifications = {items: []};
		this.notifications.items.push(new WidgetItem({id: '1', status: 0, title: 'placeholder1', detail: 'placeholder1'}, this.translateService));
		this.notifications.items.push(new WidgetItem({id: '1', status: 0, title: 'placeholder2', detail: 'placeholder2'}, this.translateService));
		this.notifications.items.push(new WidgetItem({id: '1', status: 0, title: 'placeholder3', detail: 'placeholder3'}, this.translateService));
		this.account = this.homeSecurityMockService.account;
	}

	ngOnInit() {
		this.welcomeModel.isLenovoIdLogin = false; // mock data;
		this.commonService.setSessionStorageValue(SessionStorageKey.HomeProtectionInCHSPage, 'true');
		this.welcomeModel.hasSystemPermissionShowed = this.connectedHomeSecurity.hasSystemPermissionShowed;
		if (typeof this.connectedHomeSecurity.hasSystemPermissionShowed === 'boolean') {
			this.openModal();
		}
		this.connectedHomeSecurity.on(EventTypes.hasSystemPermissionShowedEvent, (data) => {
			this.welcomeModel.hasSystemPermissionShowed = data;
			this.openModal();
		});
	}

	ngOnDestroy() {
		this.commonService.setSessionStorageValue(SessionStorageKey.HomeProtectionInCHSPage, 'false');
	}

	@HostListener('window: focus')
	onFocus(): void {
		this.connectedHomeSecurity.refresh();
		this.welcomeModel.hasSystemPermissionShowed = this.connectedHomeSecurity.hasSystemPermissionShowed;
		// this.welcomeModel.hasSystemPermissionShowed = false; // mock data;
		this.welcomeModel.isLenovoIdLogin = false; // mock data;
	}

	openModal() {
		const showW = this.commonService.getLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityShowWelcome, 1);
		if (this.commonService.getSessionStorageValue(SessionStorageKey.HomeProtectionInCHSPage) === 'true') {
			if (this.modalService.hasOpenModals()) {
				return;
			}
			if (showW < 3) {
				if (this.welcomeModel.hasSystemPermissionShowed) {
					this.requireLocationModal();
				} else if (this.welcomeModel.hasSystemPermissionShowed === false) {
					this.notRequireLocationModal();
				}
			} else {
				if (this.welcomeModel.hasSystemPermissionShowed) {
					this.requireLocationModal();
				} else if (this.welcomeModel.hasSystemPermissionShowed === false) {
					this.notRequireLocationModal();
				}
			}
		}
	}

	requireLocationModal() {
		const showW = this.commonService.getLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityShowWelcome, 1);
		this.permission.requestPermission('geoLocatorStatus').then((status) => {
			this.welcomeModel.isLocationServiceOn = status;
			this.getSwitchAndContainerPage(status, this.welcomeModel.isLenovoIdLogin);
			if (showW < 3 || !status) {
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
			welcomeModal.componentInstance.isLenovoIdLogin = false;
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
}
