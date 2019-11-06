import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { BatteryGaugeReset } from 'src/app/data-models/device/battery-gauge-reset.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalBatteryChargeThresholdComponent } from 'src/app/components/modal/modal-battery-charge-threshold/modal-battery-charge-threshold.component';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { PowerService } from 'src/app/services/power/power.service';
import { CommonService } from 'src/app/services/common/common.service';
import { Subscription } from 'rxjs';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { BatteryDetailService } from 'src/app/services/battery-detail/battery-detail.service';

@Component({
	selector: 'vtr-battery-gauge-reset',
	templateUrl: './battery-gauge-reset.component.html',
	styleUrls: ['./battery-gauge-reset.component.scss']
})
export class BatteryGaugeResetComponent implements OnInit, OnDestroy {

	@Input() batteryGaugeResetInfo: BatteryGaugeReset[];
	@Input() isACAttached: boolean;
	@Input() remainingPercentages: number[];

	// batteryGaugeResetInfo: BatteryGaugeReset[] = [];
	notificationSubscription: Subscription;
	progressText: string;
	FCCParams: any[];
	btnLabelText: string[] = [];
	stageParams: any;
	resetBtnDisabled: boolean[];
	headings: string[];

	constructor(public shellService: VantageShellService, public modalService: NgbModal, public powerService: PowerService, public commonService: CommonService, public batteryService: BatteryDetailService) { }

	ngOnInit() {
		this.initBatteryGaugeResetInfo();
		this.getBatteryGaugeResetInfo(this.batteryGaugeResetInfo);
		this.notificationSubscription = this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});
	}

	initBatteryGaugeResetInfo() {
		// this.batteryGaugeResetInfo.push(new BatteryGaugeReset());
		// this.batteryGaugeResetInfo.push(new BatteryGaugeReset());
		// this.getBatteryGaugeResetInfo(this.batteryGaugeResetInfo);
	}

	onNotification(notification: AppNotification) {
		// if (notification && notification.type === 'BatteryInfoForGaugeReset') {
		// 	this.remainingPercentages = notification.payload.remainingPercentages;
		// 	this.isACAttached = notification.payload.isACAttached;
		// }
		if (notification && notification.type === 'GaugeResetInfo') {
			this.batteryGaugeResetInfo = notification.payload;
			this.getBatteryGaugeResetInfo(this.batteryGaugeResetInfo);
		}
	}

	onBatteryGaugeReset(index) {
		let modalRef;
		modalRef = this.modalService.open(ModalBatteryChargeThresholdComponent, {
			backdrop: 'static',
			size: 'sm',
			centered: true,
			windowClass: 'Battery-Charge-Threshold-Modal'
		});

		modalRef.componentInstance.title = 'device.deviceSettings.power.batterySettings.gaugeReset.title';
		modalRef.componentInstance.negativeResponseText = 'device.deviceSettings.power.batterySettings.gaugeReset.popup.cancel';

		if (this.batteryGaugeResetInfo[index].isResetRunning) {

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
					if (!this.batteryGaugeResetInfo[index].isResetRunning) {
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
		const gaugeResetInfo = this.batteryGaugeResetInfo[index];
		try {
			const response = await this.powerService.startBatteryGaugeReset(this.updateGaugeResetInfo.bind(this), gaugeResetInfo.barCode, gaugeResetInfo.batteryNum);
			if (response) {
				console.log('start battery reset succeeded', response);
			}
		} catch (error) {
			console.log('start battery reset failed', error);
		}
	}

	async stopBatteryGaugeReset(index) {
		const gaugeResetInfo = this.batteryGaugeResetInfo[index];
		try {
			const response = await this.powerService.stopBatteryGaugeReset(this.updateGaugeResetInfo.bind(this), gaugeResetInfo.barCode, gaugeResetInfo.batteryNum);
			if (response) {
				console.log('start battery reset succeeded', response);
			}
		} catch (error) {
			console.log('start battery reset failed', error);
		}
	}

	getBatteryGaugeResetInfo(response: any[]) {
		const headings = [
			'device.deviceSettings.batteryGauge.details.primary',
			'device.deviceSettings.batteryGauge.details.secondary',
			'device.deviceSettings.batteryGauge.details.tertiary'];

		this.headings = [];
		this.btnLabelText = [];
		this.FCCParams = [];
		this.resetBtnDisabled = [];
		let resetRunningIndex = -1;
		let count = 0;
		if (response && response.length > 0) {
			this.batteryGaugeResetInfo = response;
			this.batteryGaugeResetInfo.forEach((battery) => {

				const heading = response.length > 1 ? headings[count] : 'device.deviceSettings.batteryGauge.subtitle';
				this.headings.push(heading);

				this.stageParams = { stage: battery.stage, stageNum: battery.stageNum };
				this.FCCParams.push({ before: battery.FCCBefore, after: battery.FCCAfter });
				if (battery.isResetRunning) {
					resetRunningIndex = count;
					this.btnLabelText.push('device.deviceSettings.power.batterySettings.gaugeReset.btnLabel.stop');
				} else {
					this.btnLabelText.push('device.deviceSettings.power.batterySettings.gaugeReset.btnLabel.reset');
				}
				count++;
			});

			for (let i = 0; i < response.length; i++) {
				if (i !== resetRunningIndex && resetRunningIndex !== -1) {
					this.resetBtnDisabled.push(true);
				} else {
					this.resetBtnDisabled.push(false);
				}
			}
		}

	}

	updateGaugeResetInfo(value: BatteryGaugeReset) {
		this.batteryGaugeResetInfo[value.batteryNum - 1] = value;
		this.commonService.sendNotification('GaugeResetUpdate', this.batteryGaugeResetInfo);
		this.getBatteryGaugeResetInfo(this.batteryGaugeResetInfo);
	}

	isValid(val: any) {
		if (!val || val === null) {
			return false;
		}
		if (typeof val === 'number' && val === 0) {
			return false;
		}
		if (typeof val === 'string' && val === '') {
			return false;
		}
		return true;
	}

	ngOnDestroy() {
		// this.shellService.unRegisterEvent(EventTypes.pwrBatteryGaugeResetEvent, this.powerBatteryGaugeResetEventRef);
	}

}
