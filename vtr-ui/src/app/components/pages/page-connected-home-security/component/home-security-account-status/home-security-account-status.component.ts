import {
	Component,
	OnInit,
	Input
} from '@angular/core';
import { HomeSecurityAccount } from '../../../../../data-models/home-security/home-security-account.model';
import { HomeSecurityCommon } from '../../../../../data-models/home-security/home-security-common.model';

@Component({
	selector: 'vtr-home-security-account-status',
	templateUrl: './home-security-account-status.component.html',
	styleUrls: ['./home-security-account-status.component.scss']
})
export class HomeSecurityAccountStatusComponent implements OnInit {
	@Input() account: HomeSecurityAccount;
	@Input() common: HomeSecurityCommon;

	constructor() {
	}

	ngOnInit() { }
}
