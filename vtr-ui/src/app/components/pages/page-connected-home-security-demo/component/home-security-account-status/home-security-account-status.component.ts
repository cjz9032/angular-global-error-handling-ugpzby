import {
	Component,
	OnInit,
	Input
} from '@angular/core';
import { HomeSecurityAccount } from '../../../../../data-models/home-security-demo/home-security-account.model';
import { HomeSecurityCommon } from '../../../../../data-models/home-security-demo/home-security-common.model';

@Component({
	selector: 'vtr-home-security-account-status-demo',
	templateUrl: './home-security-account-status.component.html',
	styleUrls: ['./home-security-account-status.component.scss']
})
export class HomeSecurityAccountStatusDemoComponent implements OnInit {
	@Input() account: HomeSecurityAccount;
	@Input() common: HomeSecurityCommon;

	constructor() {
	}

	ngOnInit() { }
}
