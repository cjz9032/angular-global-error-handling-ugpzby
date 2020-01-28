import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { BatteryGaugeReset } from 'src/app/data-models/device/battery-gauge-reset.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalBatteryChargeThresholdComponent } from 'src/app/components/modal/modal-battery-charge-threshold/modal-battery-charge-threshold.component';
import { PowerService } from 'src/app/services/power/power.service';
import { BatteryDetailService } from 'src/app/services/battery-detail/battery-detail.service';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Component({
	selector: 'vtr-battery-gauge-reset',
	templateUrl: './battery-gauge-reset.component.html',
	styleUrls: ['./battery-gauge-reset.component.scss']
})
export class BatteryGaugeResetComponent implements OnInit {

	headings = [
		'device.deviceSettings.batteryGauge.details.primary',
		'device.deviceSettings.batteryGauge.details.secondary',
		'device.deviceSettings.batteryGauge.details.tertiary'];
	isStartTimeAmPm = true;
	isLastResetTimeAmPm = true;
	gaugeResetBtnStatus: boolean[];

	constructor(private logger: LoggerService, public modalService: NgbModal, public powerService: PowerService, public batteryService: BatteryDetailService) { }

	ngOnInit() {
		this.logger.info('Init Gauge Reset Feature', this.batteryService.gaugeResetInfo);
		this.initBatteryGaugeResetInfo();
		this.setGaugeResetSection();
	}

	initBatteryGaugeResetInfo() {
		// this.batteryGaugeResetInfo.push(new BatteryGaugeReset());
		// this.batteryGaugeResetInfo.push(new BatteryGaugeReset());
		// this.getBatteryGaugeResetInfo(this.batteryGaugeResetInfo);
	}

	getIsAmPm(time) {
		const date = new Date(time);
		return date.getHours() < 12;
	}

	onBatteryGaugeReset(index) {
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
		modalRef.result.then(
			result => {
				if (result === 'positive') {
					if (!this.batteryService.gaugeResetInfo[index].isResetRunning) {
						this.startBatteryGaugeReset(index);
					} else {
						this.stopBatteryGaugeReset(index);
					}


				} else if (result === 'negative') {

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
			if (response) {
				this.batteryService.isGaugeResetRunning = true;
			}
		} catch (error) {
			this.logger.info('start battery reset failed', error);
		}
	}

	async stopBatteryGaugeReset(index) {
		const gaugeResetInfo = this.batteryService.gaugeResetInfo[index];
		try {
			const response = await this.powerService.stopBatteryGaugeReset(this.updateGaugeResetInfo.bind(this), gaugeResetInfo.barCode, gaugeResetInfo.batteryNum);
			this.logger.info('start battery reset succeeded', response);
			if (response) {
				this.batteryService.isGaugeResetRunning = false;
			}
		} catch (error) {
			this.logger.info('start battery reset failed', error);
		}
	}


	public setGaugeResetSection() {
		let isResetRunning = false;
		const gaugeResetBtnStatus = [];
		if (this.batteryService.gaugeResetInfo) {
			this.batteryService.gaugeResetInfo.forEach((battery) => {
				this.isStartTimeAmPm = new Date(battery.startTime).getHours() < 12;
				this.isLastResetTimeAmPm = new Date(battery.lastResetTime).getHours() < 12;
				isResetRunning = isResetRunning || battery.isResetRunning;
			});
		} else {
			gaugeResetBtnStatus.push(true);
		}
		this.batteryService.isGaugeResetRunning = isResetRunning;
		if (this.batteryService.gaugeResetInfo && this.batteryService.gaugeResetInfo.length > 1) {
			if (isResetRunning) {
				this.batteryService.gaugeResetInfo.forEach((battery) => {
					gaugeResetBtnStatus.push(!battery.isResetRunning);
				});
			} else {
				gaugeResetBtnStatus.push(false);
				gaugeResetBtnStatus.push(false);
			}
		}
		this.gaugeResetBtnStatus = gaugeResetBtnStatus;
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
