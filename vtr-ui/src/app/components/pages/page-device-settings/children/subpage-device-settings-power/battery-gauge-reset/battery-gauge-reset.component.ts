import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ModalBatteryChargeThresholdComponent } from 'src/app/components/modal/modal-battery-charge-threshold/modal-battery-charge-threshold.component';
import CommonMetricsModel from 'src/app/data-models/common/common-metrics.model';
import { BatteryGaugeReset } from 'src/app/data-models/device/battery-gauge-reset.model';
import { KeyCode } from 'src/app/enums/key-code.enum';
import { BatteryDetailService } from 'src/app/services/battery-detail/battery-detail.service';
import { CommonService } from 'src/app/services/common/common.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { PowerService } from 'src/app/services/power/power.service';

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
	gaugeResetSubscription: Subscription;
	public readonly metricsParent = CommonMetricsModel.ParentDeviceSettings;
	public readonly metricsType = CommonMetricsModel.ItemType;

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
		// receives updated gauge reset info, set in battery-card through batteryService
		this.gaugeResetSubscription = this.batteryService.setGaugeResetSectionSubject.asObservable().subscribe((resp: boolean) => {
			this.setGaugeResetSection();
		});
	}

	ngOnDestroy() {
		if (this.systemTimeFormatSubscription) {
			this.systemTimeFormatSubscription.unsubscribe();
		}
		if (this.gaugeResetSubscription) {
			this.gaugeResetSubscription.unsubscribe();
		}
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

	/**
	 * Callled on click of Reset/Stop Button
	 * @param index number, index of gauge reset info section on UI (0/1)
	 * @param $event event object
	 */
	onBatteryGaugeReset(index, $event) {
		if ($event.type === 'click') {
			this.autoFocusButton = false; // flag to hide focus outline when clicked.
		}
		let modalRef;
		// Open gauge reset popup
		modalRef = this.modalService.open(ModalBatteryChargeThresholdComponent, {
			backdrop: 'static',
			centered: true,
			windowClass: 'Battery-Charge-Threshold-Modal'
		});
		// initialize input properties of modal component
		modalRef.componentInstance.id = 'guageReset';
		modalRef.componentInstance.title = 'device.deviceSettings.power.batterySettings.gaugeReset.title';
		modalRef.componentInstance.negativeResponseText = 'device.deviceSettings.power.batterySettings.gaugeReset.popup.cancel';

		if (this.batteryService.gaugeResetInfo[index].isResetRunning) {
			// description props, positive click button text in in case of Popup for STOP click
			modalRef.componentInstance.description1 = 'device.deviceSettings.power.batterySettings.gaugeReset.popup.description3';
			modalRef.componentInstance.description2 = '';
			modalRef.componentInstance.positiveResponseText = 'device.deviceSettings.power.batterySettings.gaugeReset.popup.yes';
		} else {
			// description props, positive click button text in in case of Popup for RESET click
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

	/**
	 * Starts Battery Gauge Reset of given index
	 * @param index number, index of gauge reset info section on UI (0/1)
	 */
	async startBatteryGaugeReset(index) {
		const gaugeResetInfo = this.batteryService.gaugeResetInfo[index];
		try {
			const response = await this.powerService.startBatteryGaugeReset(this.updateGaugeResetInfo.bind(this), gaugeResetInfo.barCode, gaugeResetInfo.batteryNum);
			this.logger.info('start battery reset succeeded', response);
		} catch (error) {
			this.logger.info('start battery reset failed', error);
		}
	}

	/**
	 * Stops Battery Gauge Reset, of given index
	 * @param index number, index of gauge reset info section on UI (0/1)
	 */
	async stopBatteryGaugeReset(index) {
		const gaugeResetInfo = this.batteryService.gaugeResetInfo[index];
		try {
			const response = await this.powerService.stopBatteryGaugeReset(this.updateGaugeResetInfo.bind(this), gaugeResetInfo.barCode, gaugeResetInfo.batteryNum);
			this.logger.info('start battery reset succeeded', response);
		} catch (error) {
			this.logger.info('start battery reset failed', error);
		}
	}

	/**
	 * sets gauge reset UI, ui props
	 */
	public setGaugeResetSection() {
		let isResetRunning = false;
		const startTimeAbbreviated = [];
		const lastResetTimeAbbreviated = [];
		if (this.batteryService.gaugeResetInfo) {
			this.batteryService.gaugeResetInfo.forEach((battery) => {
				startTimeAbbreviated.push(new Date(battery.startTime).getHours() < 12 ?
					'device.deviceSettings.power.smartStandby.timer.amPms.am' : 'device.deviceSettings.power.smartStandby.timer.amPms.pm');
				lastResetTimeAbbreviated.push(new Date(battery.lastResetTime).getHours() < 12 ? 'device.deviceSettings.power.smartStandby.timer.amPms.am' : 'device.deviceSettings.power.smartStandby.timer.amPms.pm');
				isResetRunning = isResetRunning || battery.isResetRunning;
			});
		}

		this.startTimeAbbreviated = startTimeAbbreviated;
		this.lastResetTimeAbbreviated = lastResetTimeAbbreviated;
		this.batteryService.isGaugeResetRunning = isResetRunning;
	}

	/**
	 * Updates gauge reset info, based on response received
	 * @param value gauge reset info for a single battery
	 */
	updateGaugeResetInfo(value: BatteryGaugeReset) {
		let index = value.batteryNum - 1;
		if (this.batteryService.gaugeResetInfo.length < 2) {
			index = 0;
		}
		this.batteryService.gaugeResetInfo[index] = value;
		this.setGaugeResetSection();
	}

}
