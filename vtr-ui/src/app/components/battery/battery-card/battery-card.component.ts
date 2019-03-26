import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BatteryDetailService } from 'src/app/services/battery-detail/battery-detail.service';
import BatteryDetail from 'src/app/data-models/battery/battery-detail.model';
import { BatteryChargeStatus } from 'src/app/enums/battery-charge-status.enum';
import BatteryIndicator from 'src/app/data-models/battery/battery-indicator.model';
import { CommonService } from 'src/app/services/common/common.service';
import { BatteryInformation } from 'src/app/enums/battery-information.enum';

@Component({
	selector: 'vtr-battery-card',
	templateUrl: './battery-card.component.html',
	styleUrls: ['./battery-card.component.scss']
})
export class BatteryCardComponent implements OnInit, OnDestroy {
	constructor(
		private modalService: NgbModal, 
		private batteryService: BatteryDetailService,
		private commonService: CommonService) {}
	batteryInfo: BatteryDetail[];
	batteryCardTimer: any;
	batteryIndicator = new BatteryIndicator();

	ngOnInit() {
		this.getBatteryDetailOnCard();
	}

	public getBatteryDetailOnCard() {
		console.log('In getBatteryDetail');
		try {
			if (this.batteryService.isShellAvailable) {
				this.batteryService.getBatteryDetail()
					.then((response: BatteryDetail[]) => {
						console.log('getBatteryDetailOnCard', response);
						this.batteryIndicator.percent = response[0].remainingPercent;
						this.batteryIndicator.charging = response[0].chargeStatus == BatteryChargeStatus.CHARGING.id;
						this.batteryIndicator.expressCharging = response[0].isExpressCharging;
						this.batteryIndicator.voltageError = response[0].isVoltageError;
						this.batteryIndicator.convertMin(response[0].remainingTime);
						this.commonService.sendNotification(BatteryInformation.BatteryInfo,response);
						this.batteryCardTimer = setTimeout(() => {
							console.log('Trying after 30 seconds');
							this.getBatteryDetailOnCard();
						}, 30000);
					}).catch(error => {
						console.error('getBatteryDetailOnCard', error);
					});
			}
		} catch (error) {
			console.error("getBatteryDetailOnCard: " + error.message)
		}
	}
	
	public showDetailModal(content: any): void {
		this.modalService
			.open(content, {
				size: 'lg',
				windowClass: 'battery-modal-size'
			})
			.result.then(
				result => {
					// on open
				},
				reason => {
					// on close
				}
			);
	}

	ngOnDestroy() {
		clearTimeout(this.batteryCardTimer);
	}
}
