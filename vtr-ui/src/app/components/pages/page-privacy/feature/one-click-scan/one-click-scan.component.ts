import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { OneClickScanSteps, OneClickScanStepsService } from './services/one-click-scan-steps.service';
import { PermitService } from './services/permit.service';
import { CommonPopupService } from '../../common/services/popups/common-popup.service';

@Component({
	selector: 'vtr-one-click-scan',
	templateUrl: './one-click-scan.component.html',
	styleUrls: ['./one-click-scan.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class OneClickScanComponent implements OnDestroy {
	@Input() popupId: string;

	readonly oneClickScanSteps = OneClickScanSteps;
	currentStep = this.oneClickScanStepsService.getFirstStep();

	constructor(
		private oneClickScanStepsService: OneClickScanStepsService,
		private permitService: PermitService,
		private commonPopupService: CommonPopupService,
	) {	}

	ngOnDestroy() {
		this.resetScan();
	}

	handleAllow(permitValue: boolean, step: OneClickScanSteps) {
		if (permitValue) {
			this.permitService.savePermit(step);
		}

		this.nextStep();
	}

	handleScanAllow(permitValue: boolean) {
		permitValue ? this.nextStep() : this.resetScan();
	}

	getStepForScanning() {
		return this.permitService.getPermits().length === 0 ?
			this.resetScan() :
			this.permitService.getPermits();
	}

	private nextStep() {
		this.currentStep = this.oneClickScanStepsService.nextStep();

		if (this.currentStep === null) {
			this.permitService.setPermit();
			this.resetScan();
		}
	}

	private resetScan() {
		this.permitService.clearPermits();
		this.oneClickScanStepsService.resetStep();
		this.commonPopupService.close(this.popupId);
	}
}
