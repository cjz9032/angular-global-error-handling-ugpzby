import { Component, Input } from '@angular/core';

@Component({
	selector: 'vtr-email-scanner',
	templateUrl: './email-scanner.component.html',
	styleUrls: ['./email-scanner.component.scss'],
})

export class EmailScannerComponent {
	@Input() userEmail: string;
	@Input() emailWasScanned = false;

	// Static Data for html
	firstEmailScanData = {
		title: 'Check email for breaches',
	};
	nextEmailScanData = {
		title: 'We didn’t find any breached accounts',
	};
}
