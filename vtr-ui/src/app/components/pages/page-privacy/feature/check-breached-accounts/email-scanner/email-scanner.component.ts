import { Component, Input } from '@angular/core';

@Component({
	selector: 'vtr-email-scanner',
	templateUrl: './email-scanner.component.html',
	styleUrls: ['./email-scanner.component.scss'],
})

export class EmailScannerComponent {
	@Input() userEmail: string;
	@Input() emailWasScanned = false;
}
