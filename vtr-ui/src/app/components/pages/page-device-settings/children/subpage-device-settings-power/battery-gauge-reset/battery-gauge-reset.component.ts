import { Component, OnInit } from '@angular/core';
import { BatteryGaugeReset } from 'src/app/data-models/device/battery-gauge-reset.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalBatteryChargeThresholdComponent } from 'src/app/components/modal/modal-battery-charge-threshold/modal-battery-charge-threshold.component';

@Component({
	selector: 'vtr-battery-gauge-reset',
	templateUrl: './battery-gauge-reset.component.html',
	styleUrls: ['./battery-gauge-reset.component.scss']
})
export class BatteryGaugeResetComponent implements OnInit {
	batteryGaugeReset: BatteryGaugeReset[] = [];


	constructor(public modalService: NgbModal) { }

	ngOnInit() {
		this.initBatteryGaugeResetInfo();
	}

	initBatteryGaugeResetInfo() {
		this.batteryGaugeReset.push(new BatteryGaugeReset());
		this.batteryGaugeReset.push(new BatteryGaugeReset());
	}

	onBatteryGaugeReset(index) {
		let modalRef;
		let positiveLabel: boolean;
		if (this.batteryGaugeReset[index].status !== 3) {
			modalRef = this.modalService.open(ModalBatteryChargeThresholdComponent, {
				backdrop: 'static',
				size: 'sm',
				centered: true,
				windowClass: 'Battery-Charge-Threshold-Modal'
			});
			modalRef.componentInstance.title = 'device.deviceSettings.power.batterySettings.batteryGaugeReset.title';
			modalRef.componentInstance.negativeResponseText = 'device.deviceSettings.power.batterySettings.batteryGaugeReset.popup.cancel';
			if (this.batteryGaugeReset[index].status === 0 || this.batteryGaugeReset[index].status === 2) {
				modalRef.componentInstance.description1 = 'device.deviceSettings.power.batterySettings.batteryGaugeReset.popup.description1';
				modalRef.componentInstance.description2 = 'device.deviceSettings.power.batterySettings.batteryGaugeReset.popup.description2';
				modalRef.componentInstance.positiveResponseText = 'device.deviceSettings.power.batterySettings.batteryGaugeReset.popup.continue';
				positiveLabel = true;
			}
			if (this.batteryGaugeReset[index].status === 1) {
				modalRef.componentInstance.description1 = 'device.deviceSettings.power.batterySettings.batteryGaugeReset.popup.description3';
				modalRef.componentInstance.description2 = '';
				modalRef.componentInstance.positiveResponseText = 'device.deviceSettings.power.batterySettings.batteryGaugeReset.popup.yes';
				positiveLabel = false;
			}
			modalRef.result.then(
				result => {
					if (result === 'positive') {
						if (positiveLabel) {
							// api call

							if (this.batteryGaugeReset.length === 1) {
								this.batteryGaugeReset[0].status = 1;
							}
							if (this.batteryGaugeReset.length === 2) {
								switch (index) {
									case 0: {
										this.batteryGaugeReset[0].status = 1;
										this.batteryGaugeReset[1].prevStatus = this.batteryGaugeReset[1].status;
										this.batteryGaugeReset[1].status = 3;
										break;
									}
									case 1: {
										this.batteryGaugeReset[1].status = 1;
										this.batteryGaugeReset[0].prevStatus = this.batteryGaugeReset[0].status;
										this.batteryGaugeReset[0].status = 3;
										break;
									}
								}
							}
						} else {
							// api call
							if (this.batteryGaugeReset.length === 1) {
								this.batteryGaugeReset[0].status = 2;
							}
							if (this.batteryGaugeReset.length === 2) {
								switch (index) {
									case 0: {
										this.batteryGaugeReset[0].status = 2;
										this.batteryGaugeReset[1].status = 0;
										break;
									}
									case 1: {
										this.batteryGaugeReset[1].status = 2;
										this.batteryGaugeReset[0].status = 0;
										break;
									}
								}
							}
						}
						this.batteryGaugeReset.forEach((battery) => {
							if (battery.status === 0 || battery.status === 2) {
								battery.btnLabelText = 'Reset';
							}
							if (battery.status === 1) {
								battery.btnLabelText = 'Stop';
							}
						});

					} else if (result === 'negative') {

					}
				},
				reason => {
				}
			);
		}
	}

}
