import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { EmailScannerService } from '../services/email-scanner.service';
import { takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../../utils/custom-rxjs-operators/instance-destroyed';
import { LoggerService } from 'src/app/services/logger/logger.service';

interface ScanSteps {
	text: string;
	subtext: string;
}

@Component({
	selector: 'vtr-scan-steps',
	templateUrl: './scan-steps.component.html',
	styleUrls: ['./scan-steps.component.scss']
})
export class ScanStepsComponent implements OnInit, OnDestroy {
	@Input() innerIndent: boolean;
	@Input() steps: 'scanSteps' | 'verifyPopUpSteps';

	verifyPopUpSteps: Array<ScanSteps> = [
		{ text: 'Check', subtext: 'your email' },
		{ text: 'Look for our code', subtext: '' },
		{ text: 'Enter it above', subtext: '' }
	];
	scanSteps: Array<ScanSteps> = [
		{ text: 'Enter your email', subtext: 'We’ll search the internet and the dark web for your info.' },
		{ text: 'Verify it’s you', subtext: 'Check your email for a verification code.' },
		{ text: 'See your privacy level', subtext: 'Find out if you’re in control of your privacy online.' }
	];

	constructor(
		private emailScannerService: EmailScannerService,
		private logger: LoggerService) {
	}

	_steps = [];

	ngOnInit() {
		if (this.steps === 'verifyPopUpSteps') {
			this.emailScannerService.userEmail$
				.pipe(
					takeUntil(instanceDestroyed(this))
				)
				.subscribe((userEmail) => {
					this.verifyPopUpSteps[0].subtext = userEmail;
					this.updateSteps();
				});
		} else {
			this.updateSteps();
		}
	}

	ngOnDestroy() {
	}

	updateSteps() {
		if (this[this.steps]) {
			this._steps = this[this.steps];
		} else {
			this.logger.error('invalid param steps in ScanStepsComponent');
		}
	}
}
