import {
	Component,
	OnInit,
	NgZone,
	OnDestroy
} from '@angular/core';
import {
	HomeSecurityHomeGroup
} from '../../../data-models/home-security/home-security-home-group.model';
import {
	HomeSecurityMemberGroup
} from '../../../data-models/home-security/home-security-member-group.model';
import {
	SecurityAdvisor
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
	showWelcome = this.showWelcome ? this.showWelcome : 0;

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
		this.createMockData();
	}

	private createMockData() {
		this.notifications = {items: []};
		this.notifications.items.push(new WidgetItem({id: '1', status: 0, title: 'placeholder1', detail: 'placeholder1'}, this.translateService));
		this.notifications.items.push(new WidgetItem({id: '1', status: 0, title: 'placeholder2', detail: 'placeholder2'}, this.translateService));
		this.notifications.items.push(new WidgetItem({id: '1', status: 0, title: 'placeholder3', detail: 'placeholder3'}, this.translateService));
		this.account = this.homeSecurityMockService.account;
	}

	ngOnInit() {
		this.commonService.setSessionStorageValue(SessionStorageKey.HomeProtectionInCHSPage, 'true');
		const showW = this.commonService.getLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityShowWelcome);
		if (this.commonService.getSessionStorageValue(SessionStorageKey.HomeProtectionInCHSPage) === 'true') {
			if (this.modalService.hasOpenModals()) {
				return;
			}
			this.ngZone.run(() => {
				this.modalService.open(ModalChsWelcomeContainerComponent, {
					backdrop: 'static',
					size: 'lg',
					centered: true,
					windowClass: 'Welcome-container-Modal'
				});
				this.showWelcome = (showW ? showW : 0) + 1;
				this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityShowWelcome, this.showWelcome);
			});
		}
	}

	ngOnDestroy() {
		this.commonService.setSessionStorageValue(SessionStorageKey.HomeProtectionInCHSPage, 'false');
	}
}
