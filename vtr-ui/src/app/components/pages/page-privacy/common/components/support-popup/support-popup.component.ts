import { Component, OnInit } from '@angular/core';
import { VantageCommunicationService } from '../../services/vantage-communication.service';
import { FigleafOverviewService } from '../../services/figleaf-overview.service';
import { take } from 'rxjs/operators';
import { LocalStorageKey } from '../../../../../../enums/local-storage-key.enum';

@Component({
	selector: 'vtr-support-popup',
	templateUrl: './support-popup.component.html',
	styleUrls: ['./support-popup.scss']
})
export class SupportPopupComponent implements OnInit {

	constructor(
		private vantageCommunicationService: VantageCommunicationService,
		private figleafOverviewService: FigleafOverviewService
	) {
	}

	ngOnInit() {
	}

	openLenovoSupport() {
		this.vantageCommunicationService.openUri('https://support.lenovo.com');
	}

	openFigleafSupport() {
		this.figleafOverviewService.figleafStatus$.pipe(
			take(1)
		).subscribe((status) => {
			try {
				const getParams = window.btoa(`appState=${status.licenseType}&appVersion=${status.appVersion || 0}`);
				this.vantageCommunicationService.openUri(`https://figleafapp.com/lv/help/?${getParams}`);
			} catch (error) {
				console.error(error.message);
			}
		});
	}
}
