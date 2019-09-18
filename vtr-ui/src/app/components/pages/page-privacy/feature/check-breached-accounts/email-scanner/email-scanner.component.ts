import { Component, Input } from '@angular/core';

@Component({
	selector: 'vtr-email-scanner',
	templateUrl: './email-scanner.component.html',
	styleUrls: ['./email-scanner.component.scss'],
})

export class EmailScannerComponent {
	@Input() scanCounter: number;
	@Input() emailWasScanned = false;
	scanCounterLimit = 2;

	showEmailScanner() {
		this.emailWasScanned = false;
	}
}
