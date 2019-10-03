import { Component, OnInit, OnDestroy } from '@angular/core';
import { BatteryGaugeReset } from 'src/app/data-models/device/battery-gauge-reset.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalBatteryChargeThresholdComponent } from 'src/app/components/modal/modal-battery-charge-threshold/modal-battery-charge-threshold.component';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { EventTypes } from '@lenovo/tan-client-bridge';
import { PowerService } from 'src/app/services/power/power.service';
import { CommonService } from 'src/app/services/common/common.service';
import { Subscription } from 'rxjs';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';

@Component({
	selector: 'vtr-battery-gauge-reset',
	templateUrl: './battery-gauge-reset.component.html',
	styleUrls: ['./battery-gauge-reset.component.scss']
})
export class BatteryGaugeResetComponent implements OnInit, OnDestroy {

	gaugeResetCapability: boolean;
	batteryGaugeResetInfo: BatteryGaugeReset[] = [];
	// private powerBatteryGaugeResetEventRef: any;
	notificationSubscription: Subscription;
	progressText: string;
	remainingPercentages: number[];
	FCCParams: any[];
	btnLabelText: string[] = [];
	stageParams: any;
	resetBtnDisabled: boolean[];

	constructor(public shellService: VantageShellService, public modalService: NgbModal, public powerService: PowerService, public commonService: CommonService) { }

	ngOnInit() {
		this.initBatteryGaugeResetInfo();
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
		if (notification && notification.type === 'GaugeReset') {
			this.remainingPercentages = notification.payload.remainingPercentages;
		}
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

		modalRef.componentInstance.title = 'device.deviceSettings.power.batterySettings.batteryGaugeReset.title';
		modalRef.componentInstance.negativeResponseText = 'device.deviceSettings.power.batterySettings.batteryGaugeReset.popup.cancel';

		if (this.batteryGaugeResetInfo[index].IsResetRunning) {

			modalRef.componentInstance.description1 = 'device.deviceSettings.power.batterySettings.batteryGaugeReset.popup.description3';
			modalRef.componentInstance.description2 = '';
			modalRef.componentInstance.positiveResponseText = 'device.deviceSettings.power.batterySettings.batteryGaugeReset.popup.yes';
		} else {
			modalRef.componentInstance.description1 = 'device.deviceSettings.power.batterySettings.batteryGaugeReset.popup.description1';
			modalRef.componentInstance.description2 = 'device.deviceSettings.power.batterySettings.batteryGaugeReset.popup.description2';
			modalRef.componentInstance.positiveResponseText = 'device.deviceSettings.power.batterySettings.batteryGaugeReset.popup.continue';
		}
		modalRef.result.then(
			result => {
				if (result === 'positive') {
					if (!this.batteryGaugeResetInfo[index].IsResetRunning) {
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

	getResetParameters(barcode, batNumber) {
		const argument = {
			handler: this.getBatteryGaugeResetInfo.bind(this),
			barCode: barcode,
			batteryNumber: batNumber
		};
		return argument;
	}

	startBatteryGaugeReset(index) {
		const gaugeResetInfo = this.batteryGaugeResetInfo[index];
		const argument = this.getResetParameters(gaugeResetInfo.Barcode, gaugeResetInfo.BatteryNum);
		try {
			const response = this.powerService.startBatteryGaugeReset(argument);
			if (response) {
				console.log('start battery reset succeeded', response);
			}
		} catch (error) {
			console.log('start battery reset failed', error);
		}

		// this.batteryGaugeResetInfo[index].IsResetRunning = true;
		// this.batteryGaugeResetInfo[index].Stage = 1;
		// this.batteryGaugeResetInfo[index].StageNum = 3;
		// this.batteryGaugeResetInfo[index].Starttime = (new Date()).toString();
		this.getBatteryGaugeResetInfo(this.batteryGaugeResetInfo);

	}

	stopBatteryGaugeReset(index) {
		const gaugeResetInfo = this.batteryGaugeResetInfo[index];
		const argument = this.getResetParameters(gaugeResetInfo.Barcode, gaugeResetInfo.BatteryNum);
		try {
			const response = this.powerService.stopBatteryGaugeReset(argument);
			if (response) {
				console.log('start battery reset succeeded', response);
			}
		} catch (error) {
			console.log('start battery reset failed', error);
		}

		// this.batteryGaugeResetInfo[index].IsResetRunning = false;
		// this.batteryGaugeResetInfo[index].Stage = 0;
		// this.batteryGaugeResetInfo[index].StageNum = 0;
		// this.batteryGaugeResetInfo[index].LastResetTime = (new Date()).toString();
		// this.batteryGaugeResetInfo[index].ResetErrorLog = 'ERROR_USER_CANCEL';
		this.getBatteryGaugeResetInfo(this.batteryGaugeResetInfo);
	}

	getBatteryGaugeResetInfo(response) {
		this.btnLabelText = [];
		this.FCCParams = [];
		this.batteryGaugeResetInfo = response;
		let resetRunningIndex = -1;
		let count = 0;
		this.batteryGaugeResetInfo.forEach((battery) => {
			this.stageParams = { stage: battery.Stage, stageNum: battery.StageNum };
			this.FCCParams.push({ before: battery.FCCbefore, after: battery.FCCafter });
			if (battery.IsResetRunning) {
				resetRunningIndex = count;
				this.btnLabelText.push('device.deviceSettings.power.batterySettings.batteryGaugeReset.btnLabel.stop');
			} else {
				this.btnLabelText.push('device.deviceSettings.power.batterySettings.batteryGaugeReset.btnLabel.reset');
			}
			count++;
		});

		this.resetBtnDisabled = [];
		for (let i = 0; i < response.length; i++) {
			if (i !== resetRunningIndex && resetRunningIndex !== -1) {
				this.resetBtnDisabled.push(true);
			} else {
				this.resetBtnDisabled.push(false);
			}
		}

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
