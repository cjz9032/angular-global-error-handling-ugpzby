import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { AccessTokenService } from '../../../common/services/access-token.service';
import { EmailScannerService } from '../services/email-scanner.service';
import { instanceDestroyed } from '../../../utils/custom-rxjs-operators/instance-destroyed';

@Component({
	selector: 'vtr-email-scanner',
	templateUrl: './email-scanner.component.html',
	styleUrls: ['./email-scanner.component.scss']
})
export class EmailScannerComponent implements OnInit, OnDestroy {
	userEmail = '';
	emailWasScanned = this.accessTokenService.accessTokenIsExist$;

	// Static Data for html
	firstEmailScanData = {
		title: 'Check for breached accounts',
	};
	nextEmailScanData = {
		title: 'We didn’t find any breached accounts',
	};

	constructor(
		private emailScannerService: EmailScannerService,
		private accessTokenService: AccessTokenService,
	) {
	}

	ngOnInit() {
		this.emailScannerService.userEmailToShow$
			.pipe(
				takeUntil(instanceDestroyed(this))
			)
			.subscribe((userEmail) => {
				this.userEmail = userEmail;
			});
	}

	ngOnDestroy() {
	}

}
