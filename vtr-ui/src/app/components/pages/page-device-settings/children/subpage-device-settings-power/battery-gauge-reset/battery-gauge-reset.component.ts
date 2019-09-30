import { Component, OnInit } from '@angular/core';
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
export class BatteryGaugeResetComponent implements OnInit {

	gaugeResetCapability: boolean;
	batteryGaugeResetInfo: BatteryGaugeReset[] = [];
	private powerBatteryGaugeResetEvent: any;
	notificationSubscription: Subscription;
	progressText: string;
	remainingPercent: number;
	FCCParams: any;
	btnLabelText: string[] = [];

	constructor(public shellService: VantageShellService, public modalService: NgbModal, public powerService: PowerService, public commonService: CommonService) { }

	ngOnInit() {
		this.powerBatteryGaugeResetEvent = this.onPowerBatteryGaugeResetEvent.bind(this);
		// this.shellService.registerEvent(EventTypes.pwrBatteryGaugeResetEvent, this.powerBatteryGaugeResetEvent);
		this.initBatteryGaugeResetInfo();
		this.notificationSubscription = this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});
	}

	onPowerBatteryGaugeResetEvent(batteryGaugeResetInfo: any) {
		console.log('onPowerBatteryGaugeResetEvent: ', batteryGaugeResetInfo);
		if (batteryGaugeResetInfo) {
			this.batteryGaugeResetInfo = batteryGaugeResetInfo;
		}
	}

	initBatteryGaugeResetInfo() {
		this.batteryGaugeResetInfo.push(new BatteryGaugeReset());
		this.batteryGaugeResetInfo.push(new BatteryGaugeReset());
		this.getBatteryGaugeResetInfo(this.batteryGaugeResetInfo);
	}

	onNotification(notification) {
		if (notification && notification.type === 'GaugeReset') {

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

		if (this.batteryGaugeResetInfo[index].isResetRunning) {

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
					if (this.batteryGaugeResetInfo[index].isResetRunning) {
						this.startBatteryGaugeReset();
					} else {
						this.stopBatteryGaugeReset();
					}


				} else if (result === 'negative') {

				}
			},
			reason => {
			}
		);
	}

	getResetParameters() {
		const argument = {
			handler: this.getBatteryGaugeResetInfo.bind(this),
			barCode: 'AAABBBWW',
			batteryNumber: 1
		};
		return argument;
	}

	startBatteryGaugeReset() {
		const argument = this.getResetParameters();
		try {
			const response = this.powerService.startBatteryGaugeReset(argument);
			if (response) {
				console.log('start battery reset succeeded', response);
			}
		} catch (error) {
			console.log('start battery reset failed', error);
		}
	}

	stopBatteryGaugeReset() {
		const argument = this.getResetParameters();
		try {
			const response = this.powerService.stopBatteryGaugeReset(argument);
			if (response) {
				console.log('start battery reset succeeded', response);
			}
		} catch (error) {
			console.log('start battery reset failed', error);
		}
	}

	getBatteryGaugeResetInfo(response) {
		this.batteryGaugeResetInfo = response;
		this.batteryGaugeResetInfo.forEach((battery) => {
			this.FCCParams = { before: battery.FCCBefore, after: battery.FCCAfter };
			if (battery.isResetRunning) {
				this.btnLabelText.push('device.deviceSettings.power.batterySettings.batteryGaugeReset.btnLabel.stop');
			} else {
				this.btnLabelText.push('device.deviceSettings.power.batterySettings.batteryGaugeReset.btnLabel.reset');
			}
		});
	}

}
