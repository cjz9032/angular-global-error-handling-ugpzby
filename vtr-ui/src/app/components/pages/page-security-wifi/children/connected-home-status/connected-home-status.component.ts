import { Component, Input } from '@angular/core';
import { ConnectedHomeSecurity } from '@lenovo/tan-client-bridge';

@Component({
	selector: 'vtr-connected-home-status',
	templateUrl: './connected-home-status.component.html',
	styleUrls: ['./connected-home-status.component.scss'],
})
export class ConnectedHomeStatusComponent {
	@Input() homeSecurity: ConnectedHomeSecurity;
	constructor() {}
}
