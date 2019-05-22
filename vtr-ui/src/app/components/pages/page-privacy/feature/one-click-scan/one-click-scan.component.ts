import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { OneClickScanSteps, OneClickScanStepsService } from './services/one-click-scan-steps.service';
import { PermitService } from './services/permit.service';
import { CommonPopupService } from '../../common/services/popups/common-popup.service';

@Component({
	selector: 'vtr-one-click-scan',
	templateUrl: './one-click-scan.component.html',
	styleUrls: ['./one-click-scan.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class OneClickScanComponent {
	@Input() popupId: string;

	readonly oneClickScanSteps = OneClickScanSteps;
	currentStep = this.oneClickScanService.getFirstStep();

	constructor(
		private oneClickScanService: OneClickScanStepsService,
		private permitService: PermitService,
		private commonPopupService: CommonPopupService,
	) {	}

	handlerAllow(permitValue: boolean, step: OneClickScanSteps) {
		if (permitValue) {
			this.permitService.setPermit(permitValue, step);
		}

		this.nextStep();
	}

	private nextStep() {
		this.currentStep = this.oneClickScanService.nextStep();

		if (this.currentStep === null) {
			this.commonPopupService.close(this.popupId);
		}
	}
}
