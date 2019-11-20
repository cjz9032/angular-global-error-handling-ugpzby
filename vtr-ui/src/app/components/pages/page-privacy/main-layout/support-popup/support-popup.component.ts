import { Component, OnInit } from '@angular/core';
import { VantageCommunicationService } from '../../common/services/vantage-communication.service';
import { FigleafOverviewService, licenseTypes } from '../../common/services/figleaf-overview.service';
import { switchMap, take } from 'rxjs/operators';
import { CommunicationWithFigleafService } from '../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { from, of } from 'rxjs';
import { DeviceService } from '../../../../../services/device/device.service';

@Component({
	selector: 'vtr-support-popup',
	templateUrl: './support-popup.component.html',
	styleUrls: ['./support-popup.scss']
})
export class SupportPopupComponent implements OnInit {
	private licenseTypes = licenseTypes;

	constructor(
		private vantageCommunicationService: VantageCommunicationService,
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private figleafOverviewService: FigleafOverviewService,
		private deviceService: DeviceService
	) {
	}

	ngOnInit() {
	}

	openLenovoSupport() {
		from(this.deviceService.getMachineInfo()).subscribe((info) => {
			const link = `https://support.lenovo.com/contactus?serialnumber=${info.serialnumber}`;
			this.vantageCommunicationService.openUri(link);
		});
	}

	openFigleafSupport() {
		this.communicationWithFigleafService.isFigleafReadyForCommunication$.pipe(
			switchMap((isReady) => isReady ? this.figleafOverviewService.figleafStatus$ :
					of({licenseType: this.licenseTypes.NonInstalled, appVersion: ''})),
			take(1)
		).subscribe((status) => {
			try {
				const getParams = window.btoa(`appState=${licenseTypes[status.licenseType]}&appVersion=${status.appVersion || 0}`);
				this.vantageCommunicationService.openUri(`https://figleafapp.com/lv/help/?${getParams}`);
			} catch (error) {
				console.error(error.message);
			}
		});
	}
}
