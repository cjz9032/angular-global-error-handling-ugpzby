import {
	Component,
	OnInit
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

@Component({
	selector: 'vtr-page-connected-home-security',
	templateUrl: './page-connected-home-security.component.html',
	styleUrls: ['./page-connected-home-security.component.scss']
})
export class PageConnectedHomeSecurityComponent implements OnInit {
	myFamilyMembers: Map < string,
	HomeSecurityMemberGroup > ;
	myHomes: Map < string,
	HomeSecurityHomeGroup > ;
	securityAdvisor: SecurityAdvisor;
	notifications: HomeSecurityNotification;
	account: HomeSecurityAccount;
	pageStatus: HomeSecurityPageStatus;

	constructor(
        private vantageShellService: VantageShellService,
        private translateService: TranslateService
	) {
        this.securityAdvisor = vantageShellService.getSecurityAdvisor();
        this.createMockData();
	}

    private createMockData() {
        this.notifications = {items:[]};
        this.notifications.items.push(new WidgetItem({id:'1',status:0,title:'placeholder1',detail:'placeholder1'}, this.translateService));
        this.notifications.items.push(new WidgetItem({id:'1',status:0,title:'placeholder2',detail:'placeholder2'}, this.translateService));
        this.notifications.items.push(new WidgetItem({id:'1',status:0,title:'placeholder3',detail:'placeholder3'}, this.translateService));
    }

	ngOnInit() {}
}
