import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'vtr-verify-email',
	templateUrl: './verify-email.component.html',
	styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent {
	@Input() breachedAccountsLength = 0;
	@Input() userEmail = '';
	@Input() isFigleafReadyForCommunication = false;
	@Input() scanCounter: number;
	@Input() scanCounterLimit: number;

	@Output() verifyEmailEmit = new EventEmitter<boolean>();

	isShowConfrimation = false;
	isShowEmailBlock = false;

	tryProductText = {
		risk: 'With your email and passwords exposed, others have access to your personal information, which could lead to identity theft and financial fraud.',
		howToFix: 'We recommend you change your passwords for these accounts and make each one unique. Lenovo Privacy Essentials by FigLeaf can do it all for you.',
		riskAfterInstallFigleaf: 'With your email and passwords exposed, others have access to your personal information, which could lead to identity theft and financial fraud.',
		howToFixAfterInstallFigleaf: 'You should change passwords for breached accounts. Open Lenovo Privacy Essentials by FigLeaf and follow the recommendations.'
	};

	verifyEmailClick() {
		this.verifyEmailEmit.emit(true);
		if (!this.isFigleafReadyForCommunication) {
			this.isShowConfrimation = true;
		}
	}

	openInputEmailBlock() {
		this.isShowEmailBlock = true;
	}

	hideEmailBlock() {
		this.isShowEmailBlock = false;
	}
}
