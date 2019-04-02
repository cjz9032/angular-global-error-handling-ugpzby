import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BatteryDetailService } from 'src/app/services/battery-detail/battery-detail.service';
import BatteryDetail from 'src/app/data-models/battery/battery-detail.model';
import { BatteryChargeStatus } from 'src/app/enums/battery-charge-status.enum';
import BatteryIndicator from 'src/app/data-models/battery/battery-indicator.model';
import { CommonService } from 'src/app/services/common/common.service';
import { BatteryInformation } from 'src/app/enums/battery-information.enum';
import { EventTypes } from '@lenovo/tan-client-bridge';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
@Component({
	selector: 'vtr-battery-card',
	templateUrl: './battery-card.component.html',
	styleUrls: ['./battery-card.component.scss']
})
export class BatteryCardComponent implements OnInit, OnDestroy {
	constructor(
		private modalService: NgbModal, 
		private batteryService: BatteryDetailService,
		public shellServices: VantageShellService,
		private commonService: CommonService) {
			this.getBatteryDetailOnCard();
		}
	batteryInfo: BatteryDetail[];
	batteryCardTimer: any;
	batteryIndicator = new BatteryIndicator();
	flag = true;
	
	ngOnInit() {
		this.shellServices.registerEvent(EventTypes.pwrPowerSupplyStatusEvent, this.onPowerSupplyStatusEvent.bind(this));
		this.shellServices.registerEvent(EventTypes.pwrRemainingPercentageEvent, this.onRemainingPercentageEvent.bind(this));
		this.shellServices.registerEvent(EventTypes.pwrBatteryStatusEvent, this.onBatteryStatusEvent.bind(this));
	}

	onPowerSupplyStatusEvent(status: any) {
		console.log("onPowerSupplyStatusEvent: ", status);
		if(status) {
			this.batteryInfo[0].chargeStatus = status.isAcAttached ? BatteryChargeStatus.CHARGING.id : BatteryChargeStatus.DISCHARGING.id;
			this.updateBatteryDetails();
		}
	}

	onRemainingPercentageEvent(info: BatteryDetail[]) {
		console.log("onRemainingPercentageEvent: ", info);
		if(info) {
			this.batteryInfo = info
			this.updateBatteryDetails();
		}
	}

	onBatteryStatusEvent(info: BatteryDetail[]) {
		console.log("onBatteryStatusEvent: ", info);
		if(info) {
			this.batteryInfo = info
			this.updateBatteryDetails();
		}
	}

	public getBatteryDetailOnCard() {
		console.log('In getBatteryDetail');
		try {
			if (this.batteryService.isShellAvailable) {
				this.batteryService.getBatteryDetail()
					.then((response: BatteryDetail[]) => {
						console.log('getBatteryDetailOnCard', response);
						this.batteryInfo = response;
						this.updateBatteryDetails();
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

	public updateBatteryDetails() {
		this.batteryInfo[0].mainBatteryPercent = this.batteryService.getMainBatteryPercentage();
		this.batteryIndicator.percent = this.batteryService.getMainBatteryPercentage();
		this.batteryIndicator.charging = this.batteryInfo[0].chargeStatus == BatteryChargeStatus.CHARGING.id;
		this.batteryIndicator.expressCharging = this.batteryInfo[0].isExpressCharging;
		this.batteryIndicator.voltageError = this.batteryInfo[0].isVoltageError;
		this.batteryIndicator.convertMin(this.batteryInfo[0].remainingTime);
		this.commonService.sendNotification(BatteryInformation.BatteryInfo,this.batteryInfo);
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

	reInitValue() {
		this.flag = false;
		this.getBatteryDetailOnCard();
	}
	ngOnDestroy() {
		clearTimeout(this.batteryCardTimer);
		this.shellServices.unRegisterEvent(EventTypes.pwrPowerSupplyStatusEvent);
		this.shellServices.unRegisterEvent(EventTypes.pwrRemainingPercentageEvent);
		this.shellServices.unRegisterEvent(EventTypes.pwrBatteryStatusEvent);
	}
}
