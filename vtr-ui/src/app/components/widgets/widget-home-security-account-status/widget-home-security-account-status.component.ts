import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter
} from '@angular/core';
import { BaseComponent } from '../../base/base.component';

@Component({
	selector: 'vtr-widget-home-security-account-status',
	templateUrl: './widget-home-security-account-status.component.html',
	styleUrls: ['./widget-home-security-account-status.component.scss']
})
export class WidgetHomeSecurityAccountStatusComponent extends BaseComponent implements OnInit {
	@Input() status: string;
	@Input() remainingDays: number;
	@Input() expiredDate: Date = new Date();
	@Output() manageAccount = new EventEmitter<boolean>();
	@Output() upgradeAccount = new EventEmitter<boolean>();
	@Output() startTrial = new EventEmitter<boolean>();

	constructor() {
		super();
	}

	ngOnInit() { }

	emitManageAccount() {
		this.manageAccount.emit();
		this.status = 'localAccount';
	}

	emitUpgradeAccount() {
		this.upgradeAccount.emit();
		this.status = this.status === 'trial' ? 'trialExpired' : 'upgraded';
	}

	emitStartTrial() {
		this.startTrial.emit();
		this.status = 'trial';
	}
}
