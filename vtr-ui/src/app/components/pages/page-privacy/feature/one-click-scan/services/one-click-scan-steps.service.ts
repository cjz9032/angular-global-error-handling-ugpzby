import { EventEmitter, Injectable } from '@angular/core';

export interface Permit {
	allow: EventEmitter<boolean>;
	allowEmitter();
	disallowEmitter();
}

export enum OneClickScanSteps {
	PERMIT_TRACKERS_AND_PASSWORD = 'Permit analyse trackers and get password from browser',
	VERIFY_EMAIL = 'Verify email',
	SCAN = 'Scan tour'
}

@Injectable({
	providedIn: 'root'
})
export class OneClickScanStepsService {
	oneClickScanSteps = this.getStepsMap();

	constructor() {
	}

	getFirstStep() {
		return this.activateStep(0);
	}

	nextStep() {
		const nextStepIndex = this.oneClickScanSteps.findIndex((step) => !step.wasShow);
		return nextStepIndex > 0 ? this.activateStep(nextStepIndex) : null;
	}

	resetStep() {
		this.oneClickScanSteps = this.getStepsMap();
	}

	private getStepsMap() {
		return Object.keys(OneClickScanSteps).map((step, index, array) => ({
				step: OneClickScanSteps[step],
				wasShow: false,
				index,
				length: array.length
		}));
	}

	private activateStep(index) {
		this.oneClickScanSteps[index].wasShow = true;
		return this.oneClickScanSteps[index];
	}
}
