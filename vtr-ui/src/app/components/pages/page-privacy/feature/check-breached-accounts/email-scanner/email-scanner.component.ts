import { Component, Input } from '@angular/core';

@Component({
	selector: 'vtr-email-scanner',
	templateUrl: './email-scanner.component.html',
	styleUrls: ['./email-scanner.component.scss'],
})

export class EmailScannerComponent {
	@Input() scanCounter: number;
	@Input() scanCounterLimit: number;
	@Input() emailWasScanned = false;

	showEmailScanner() {
		this.emailWasScanned = false;
	}
}
