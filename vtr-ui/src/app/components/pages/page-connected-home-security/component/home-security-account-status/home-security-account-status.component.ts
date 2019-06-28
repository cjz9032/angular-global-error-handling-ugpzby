import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter
} from '@angular/core';
import { BaseComponent } from '../../../../base/base.component';

@Component({
	selector: 'vtr-home-security-account-status',
	templateUrl: './home-security-account-status.component.html',
	styleUrls: ['./home-security-account-status.component.scss']
})
export class HomeSecurityAccountStatusComponent extends BaseComponent implements OnInit {
	@Input() status: string;
	@Input() standardTime = new Date();
	@Input() expiredDate: Date = new Date();
	@Output() manageAccount = new EventEmitter<string>();
	@Output() upgradeAccount = new EventEmitter<boolean>();
	@Output() startTrial = new EventEmitter<boolean>();

	constructor() {
		super();
	}

	ngOnInit() { }

	emitManageAccount() {
		this.manageAccount.emit('login');
	}

	emitUpgradeAccount() {
		this.upgradeAccount.emit();
	}

	emitStartTrial() {
		this.startTrial.emit();
	}

	emitVisitProfile() {
		this.manageAccount.emit('profile');
	}
}
