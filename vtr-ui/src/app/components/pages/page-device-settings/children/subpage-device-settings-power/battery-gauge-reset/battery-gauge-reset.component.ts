import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ModalBatteryChargeThresholdComponent } from 'src/app/components/modal/modal-battery-charge-threshold/modal-battery-charge-threshold.component';
import { BatteryGaugeReset } from 'src/app/data-models/device/battery-gauge-reset.model';
import { BatteryDetailService } from 'src/app/services/battery-detail/battery-detail.service';
import { CommonService } from 'src/app/services/common/common.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { PowerService } from 'src/app/services/power/power.service';
import { KeyCode } from 'src/app/enums/key-code.enum';

@Component({
	selector: 'vtr-battery-gauge-reset',
	templateUrl: './battery-gauge-reset.component.html',
	styleUrls: ['./battery-gauge-reset.component.scss']
})
export class BatteryGaugeResetComponent implements OnInit, OnDestroy {

	headings = [
		'device.deviceSettings.batteryGauge.details.primary',
		'device.deviceSettings.batteryGauge.details.secondary',
		'device.deviceSettings.batteryGauge.details.tertiary'];
	startTimeAbbreviated = [];
	lastResetTimeAbbreviated = [];
	// gaugeResetBtnStatus: boolean[];
	is12HrsFormat = false;
	systemTimeFormatSubscription: Subscription;
	autoFocusButton = false;
	// These following instance variables added for Keyboard navigation to radio button.
	keyCode = Object.freeze({
		TAB: 9,
		RETURN: 13,
		SPACE: 32,
		END: 35,
		HOME: 36,
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40
	});
	constructor(private logger: LoggerService, public modalService: NgbModal, public powerService: PowerService, public batteryService: BatteryDetailService, private commonService: CommonService) { }

	ngOnInit() {
		this.logger.info('Init Gauge Reset Feature', this.batteryService.gaugeResetInfo);
		this.initBatteryGaugeResetInfo();
		this.setGaugeResetSection();
		this.systemTimeFormatSubscription = this.commonService.getSystemTimeFormat().subscribe((value: boolean) => {
			this.is12HrsFormat = value;
		});
	}

	ngOnDestroy() {
		this.systemTimeFormatSubscription.unsubscribe();
	}

	initBatteryGaugeResetInfo() {
		// this.batteryGaugeResetInfo.push(new BatteryGaugeReset());
		// this.batteryGaugeResetInfo.push(new BatteryGaugeReset());
		// this.getBatteryGaugeResetInfo(this.batteryGaugeResetInfo);
	}


	/* @HostListener('window:keydown', ['$event']) */
	onKeyPressBatteryGaugeReset(index, $event: KeyboardEvent) {
		try {
			if ($event.keyCode === KeyCode.SPACE || $event.keyCode === KeyCode.RETURN) {
				this.autoFocusButton = true; // flag to focus monitoring ,highlighting when using keyboard/ narrator for accessibility.
				$event.preventDefault();
				$event.stopPropagation();
				this.onBatteryGaugeReset(index, $event);
			}
		}
		catch (error) {

		}

	}

	onBatteryGaugeReset(index, $event) {
		if ($event.type === 'click') {
			this.autoFocusButton = false; // flag to hide focus outline when clicked.
		}
		let modalRef;
		modalRef = this.modalService.open(ModalBatteryChargeThresholdComponent, {
			backdrop: 'static',
			centered: true,
			windowClass: 'Battery-Charge-Threshold-Modal'
		});

		modalRef.componentInstance.title = 'device.deviceSettings.power.batterySettings.gaugeReset.title';
		modalRef.componentInstance.negativeResponseText = 'device.deviceSettings.power.batterySettings.gaugeReset.popup.cancel';

		if (this.batteryService.gaugeResetInfo[index].isResetRunning) {

			modalRef.componentInstance.description1 = 'device.deviceSettings.power.batterySettings.gaugeReset.popup.description3';
			modalRef.componentInstance.description2 = '';
			modalRef.componentInstance.positiveResponseText = 'device.deviceSettings.power.batterySettings.gaugeReset.popup.yes';
		} else {
			modalRef.componentInstance.description1 = 'device.deviceSettings.power.batterySettings.gaugeReset.popup.description1';
			modalRef.componentInstance.description2 = 'device.deviceSettings.power.batterySettings.gaugeReset.popup.description2';
			modalRef.componentInstance.positiveResponseText = 'device.deviceSettings.power.batterySettings.gaugeReset.popup.continue';
		}
		const activeElement = document.activeElement as HTMLElement;
		modalRef.result.then(
			result => {
				if (result === 'positive') {
					if (!this.batteryService.gaugeResetInfo[index].isResetRunning) {
						this.startBatteryGaugeReset(index);
					} else {
						this.stopBatteryGaugeReset(index);
					}
					this.modalService.dismissAll();
				}
				else {
					if (this.autoFocusButton) {
						activeElement.focus();
					}

				}
			},
			reason => {
			}
		);
	}

	async startBatteryGaugeReset(index) {
		const gaugeResetInfo = this.batteryService.gaugeResetInfo[index];
		try {
			const response = await this.powerService.startBatteryGaugeReset(this.updateGaugeResetInfo.bind(this), gaugeResetInfo.barCode, gaugeResetInfo.batteryNum);
			this.logger.info('start battery reset succeeded', response);
		} catch (error) {
			this.logger.info('start battery reset failed', error);
		}
	}

	async stopBatteryGaugeReset(index) {
		const gaugeResetInfo = this.batteryService.gaugeResetInfo[index];
		try {
			const response = await this.powerService.stopBatteryGaugeReset(this.updateGaugeResetInfo.bind(this), gaugeResetInfo.barCode, gaugeResetInfo.batteryNum);
			this.logger.info('start battery reset succeeded', response);
		} catch (error) {
			this.logger.info('start battery reset failed', error);
		}
	}


	public setGaugeResetSection() {
		let isResetRunning = false;
		const startTimeAbbreviated = [];
		const lastResetTimeAbbreviated = [];
		// const gaugeResetBtnStatus = [];
		if (this.batteryService.gaugeResetInfo) {
			this.batteryService.gaugeResetInfo.forEach((battery) => {
				startTimeAbbreviated.push(new Date(battery.startTime).getHours() < 12 ?
					'device.deviceSettings.power.smartStandby.timer.amPms.am' : 'device.deviceSettings.power.smartStandby.timer.amPms.pm');
				lastResetTimeAbbreviated.push(new Date(battery.lastResetTime).getHours() < 12 ? 'device.deviceSettings.power.smartStandby.timer.amPms.am' : 'device.deviceSettings.power.smartStandby.timer.amPms.pm');
				isResetRunning = isResetRunning || battery.isResetRunning;
			});
		}

		// gauge reset btn status in case of dual battery
		// if (this.batteryService.gaugeResetInfo && this.batteryService.gaugeResetInfo.length > 1) {
		// 	if (isResetRunning) {
		// 		this.batteryService.gaugeResetInfo.forEach((battery) => {
		// 			gaugeResetBtnStatus.push(!battery.isResetRunning);
		// 		});
		// 	} else {
		// 		gaugeResetBtnStatus.push(false);
		// 		gaugeResetBtnStatus.push(false);
		// 	}
		// }

		// this.gaugeResetBtnStatus = gaugeResetBtnStatus;


		this.startTimeAbbreviated = startTimeAbbreviated;
		this.lastResetTimeAbbreviated = lastResetTimeAbbreviated;
		this.batteryService.isGaugeResetRunning = isResetRunning;
	}

	updateGaugeResetInfo(value: BatteryGaugeReset) {
		let index = value.batteryNum - 1;
		if (this.batteryService.gaugeResetInfo.length < 2) {
			index = 0;
		}
		this.batteryService.gaugeResetInfo[index] = value;
		this.setGaugeResetSection();
	}

	// isValid(val: any) {
	// 	if (!val || val === null) {
	// 		return false;
	// 	}
	// 	if (typeof val === 'number' && val === 0) {
	// 		return false;
	// 	}
	// 	if (typeof val === 'string' && val === '') {
	// 		return false;
	// 	}
	// 	return true;
	// }

}
