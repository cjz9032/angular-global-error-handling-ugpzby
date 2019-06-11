import { Component, OnInit } from '@angular/core';
import { VantageCommunicationService } from '../../services/vantage-communication.service';

@Component({
	selector: 'vtr-support-popup',
	templateUrl: './support-popup.component.html',
	styleUrls: ['./support-popup.scss']
})
export class SupportPopupComponent implements OnInit {

	constructor(private vantageCommunicationService: VantageCommunicationService) {
	}

	ngOnInit() {
	}

	openLenovoSupport() {
		this.vantageCommunicationService.openUri('https://support.lenovo.com');
	}
}
