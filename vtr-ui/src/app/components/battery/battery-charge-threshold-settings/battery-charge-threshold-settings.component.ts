import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SecureMath } from '@lenovo/tan-client-bridge';
import { ChargeThreshold } from 'src/app/data-models/device/charge-threshold.model';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
	selector: 'vtr-battery-charge-threshold-settings',
	templateUrl: './battery-charge-threshold-settings.component.html',
	styleUrls: ['./battery-charge-threshold-settings.component.scss']
})
export class BatteryChargeThresholdSettingsComponent implements OnInit {

	@Input() title = '';
	@Input() displayNoteOnly = false;
	@Input() showBCTWarningNote: boolean;
	@Input() textId = '';
	@Input() isGaugeResetRunning = false;
	@Input() bctInfo: ChargeThreshold;

	@Output() changeBCTInfo = new EventEmitter<ChargeThreshold>();
	@Output() autoChecked = new EventEmitter<ChargeThreshold>();


	chargeOptions: number[] = [40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
	startAtChargeOptions: number[] = this.chargeOptions.slice(0, this.chargeOptions.length - 1);
	stopAtChargeOptions: number[] = this.chargeOptions.slice(1, this.chargeOptions.length);
	hyphen = '-'
	startAtChargeOption = "startAtChargeOption"

	// Random number is used to have unique id of each input field
	randomNumber: number = Math.floor(new Date().valueOf() * SecureMath.random());

	/** Input fields names */
	startChargeInput = 'startAtCharge';
	stopAtChargeInput = 'stopAtCharge';
	isCheckedAutoInput = 'is-auto-battery-threshold-settings';
	public selectedOptionsData: any = {};

	constructor(private commonService: CommonService) { }

	ngOnInit() { }

	onStartValueChange(startVal: number, button: HTMLElement) {
		const bctInfo = this.commonService.cloneObj(this.bctInfo);
		if (bctInfo.startValue !== startVal) {
			bctInfo.startValue = startVal;
			this.changeBCTInfo.emit(bctInfo);
		}
		button.focus();
	}

	onStopValueChange(stopVal: number, button: HTMLElement) {
		const bctInfo: ChargeThreshold = this.commonService.cloneObj(this.bctInfo);
		if (bctInfo.stopValue !== stopVal) {
			bctInfo.stopValue = stopVal;
			if (bctInfo.checkboxValue) {
				bctInfo.startValue = stopVal - 5;
			}
			this.changeBCTInfo.emit(bctInfo);
		}
		button.focus();
	}

	public toggleAutoChargeSettings($event: boolean) {
		const bctInfo = this.commonService.cloneObj(this.bctInfo);
		bctInfo.checkboxValue = $event;
		if ($event) {
			bctInfo.startValue = this.bctInfo.stopValue - 5;
		}
		this.autoChecked.emit(bctInfo);
	}


}
