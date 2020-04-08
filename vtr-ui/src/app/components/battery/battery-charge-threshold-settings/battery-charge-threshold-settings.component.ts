import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { SecureMath } from '@lenovo/tan-client-bridge';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
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
	@Input() isDisabled = false;
	@Input() bctInfo: ChargeThreshold = new ChargeThreshold();

	@Output() changeBCTInfo = new EventEmitter<ChargeThreshold>();
	@Output() autoChecked = new EventEmitter<ChargeThreshold>();


	chargeOptions: number[] = [40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
	startAtChargeOptions: number[] = this.chargeOptions.slice(0, this.chargeOptions.length - 1);
	stopAtChargeOptions: number[] = this.chargeOptions.slice(1, this.chargeOptions.length);
	hyphen = '-'
	startAtChargeOption = 'startAtChargeOption';
	stopAtChargeOption = 'stopAtChargeOption';
	option = 'option';
	selected = 'selected';
	off = 'off'
	ddStartAtChargeDescription = this.translate.instant('device.deviceSettings.power.batterySettings.batteryThreshold.options.start');
	ddStopAtChargeDescription = this.translate.instant('device.deviceSettings.power.batterySettings.batteryThreshold.options.stop');


	// Random number is used to have unique id of each input field
	randomNumber: number = Math.floor(new Date().valueOf() * SecureMath.random());

	/** Input fields names */
	startChargeInput = 'startAtCharge';
	stopAtChargeInput = 'stopAtCharge';
	isCheckedAutoInput = 'is-auto-battery-threshold-settings';
	public selectedOptionsData: any = {};
	@ViewChildren(NgbDropdown) dropDowns: QueryList<NgbDropdown>;
	timeOut = 100;
	constructor(private commonService: CommonService, private translate: TranslateService) { }


	ngOnInit() {
		this.translate.stream('device.deviceSettings.power.batterySettings.batteryThreshold.options.start').subscribe((value) => {
			this.ddStartAtChargeDescription = value;
		});

		this.translate.stream('device.deviceSettings.power.batterySettings.batteryThreshold.options.start').subscribe((value) => {
			this.ddStartAtChargeDescription = value;
		});


	}

	onStartValueChange(startVal: number, activeDropdown: NgbDropdown, button: HTMLElement) {
		const bctInfo = this.commonService.cloneObj(this.bctInfo);
		if (bctInfo.startValue !== startVal) {
			bctInfo.startValue = startVal;
			this.changeBCTInfo.emit(bctInfo);
		}
		this.delayButtonFocus(activeDropdown, button);
	}
	// this added to introduce the delay between option selection , and focus back on button to fix issue with narrator reading collapsed twice.
	delayButtonFocus(activeDropdown: NgbDropdown, button: HTMLElement) {
		if (activeDropdown.isOpen()) {
			activeDropdown.close();
		}
		document.body.focus();
		setTimeout(() => {
			button.focus();
		}, this.timeOut);
	}

	onStopValueChange(stopVal: number, activeDropdown: NgbDropdown, button: HTMLElement) {
		const bctInfo: ChargeThreshold = this.commonService.cloneObj(this.bctInfo);
		if (bctInfo.stopValue !== stopVal) {
			bctInfo.stopValue = stopVal;
			if (bctInfo.checkboxValue) {
				bctInfo.startValue = stopVal - 5;
			}
			this.changeBCTInfo.emit(bctInfo);
		}
		this.delayButtonFocus(activeDropdown, button);

	}

	public toggleAutoChargeSettings($event: boolean) {
		const bctInfo = this.commonService.cloneObj(this.bctInfo);
		bctInfo.checkboxValue = $event;
		if ($event) {
			bctInfo.startValue = this.bctInfo.stopValue - 5;
		}
		this.autoChecked.emit(bctInfo);
	}

	closeAllDD() {
		// Close all dropdowns
		this.dropDowns.toArray().forEach(elem => {
			elem.close();
		});
		// Open the dropdown that was clicked on
		// activeDropdown.open();
	}

	closeAllOtherDD(activeDropdown: NgbDropdown) {
		// Close all dropdowns
		// this.activeDropdown = activeDropdown;
		this.dropDowns.toArray().forEach(elem => {
			if (activeDropdown !== elem) {
				elem.close();
			}
		});
	}

	showHideMenuOfItem($event, activeDropdown: NgbDropdown) {
		if (($event.shiftKey && $event.keyCode === 9) || $event.keyCode === 9) {
			const sourceElement = $event.srcElement as HTMLAnchorElement;
			const menuElement = sourceElement.parentElement.parentElement;
			const anchors = Array.from(menuElement.querySelectorAll('[class*=dropdown-item][aria-disabled=false][tabindex]:not([tabindex="-1"])'));
			const currentIndex = anchors.indexOf(sourceElement);
			let nextIndex

			if ($event.shiftKey && $event.keyCode === 9) {
				nextIndex = currentIndex - 1;
				if (nextIndex < 0) {
					activeDropdown.close();
					// this.closeAllDD();
				}
			}

			if ($event.keyCode === 9) {
				nextIndex = currentIndex + 1;
				if (nextIndex >= anchors.length) {
					activeDropdown.close();
					// this.closeAllDD();
				}
			}
		}

	}

	focusOnSelected($event: Event, activeDropdown: NgbDropdown, type, value) {
		// dropdown-toggle will be toggled when pressed on enter
		if (activeDropdown.isOpen()) {
			const focusElement = document.querySelector(`#${this.textId}-${type}-${value}`) as HTMLElement;
			if (focusElement) {
				focusElement.focus();
			}
		}

	}

}
