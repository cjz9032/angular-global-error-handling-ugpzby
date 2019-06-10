import { Component, OnInit, OnDestroy, OnChanges, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BatteryDetailService } from 'src/app/services/battery-detail/battery-detail.service';
import BatteryDetail from 'src/app/data-models/battery/battery-detail.model';
import { BatteryChargeStatus } from 'src/app/enums/battery-charge-status.enum';
import BatteryIndicator from 'src/app/data-models/battery/battery-indicator.model';
import { CommonService } from 'src/app/services/common/common.service';
import { BatteryInformation } from 'src/app/enums/battery-information.enum';
import { EventTypes } from '@lenovo/tan-client-bridge';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { ViewRef_ } from '@angular/core/src/view';
import BatteryGaugeDetail from 'src/app/data-models/battery/battery-gauge-detail-model';
import { BatteryConditionsEnum, BatteryQuality } from 'src/app/enums/battery-conditions.enum';
import { BatteryConditionModel } from 'src/app/data-models/battery/battery-conditions.model';
import { BatteryConditionTranslation } from 'src/app/data-models/battery/battery-condition-translations.model';

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
		private commonService: CommonService,
		private cd: ChangeDetectorRef) {
	}
	batteryInfo: BatteryDetail[];
	batteryGauge: BatteryGaugeDetail;
	batteryCardTimer: any;
	batteryIndicator = new BatteryIndicator();
	flag = true;
	batteryCondition: BatteryConditionModel;
	batteryConditionsEnum = BatteryConditionsEnum;
	batteryConditionTranslation: BatteryConditionTranslation;
	batteryQuality = BatteryQuality;

	// percentageLimitation: Store Limitation Percentage
	percentageLimitation = 60;

	ngOnInit() {
		this.getBatteryDetailOnCard();

		this.shellServices.registerEvent(EventTypes.pwrPowerSupplyStatusEvent, this.onPowerSupplyStatusEvent.bind(this));
		this.shellServices.registerEvent(EventTypes.pwrRemainingPercentageEvent, this.onRemainingPercentageEvent.bind(this));
		this.shellServices.registerEvent(EventTypes.pwrRemainingTimeEvent, this.onRemainingTimeEvent.bind(this));
	}

	onPowerSupplyStatusEvent(info: any) {
		console.log('onPowerSupplyStatusEvent: ', info);
		if (info) {
			this.batteryInfo = info.batteryInformation;
			this.batteryGauge = info.batteryIndicatorInfo;
			this.updateBatteryDetails();
		}
	}

	onRemainingPercentageEvent(info: any) {
		console.log('onRemainingPercentageEvent: ', info);
		if (info) {
			this.batteryInfo = info.batteryInformation;
			this.batteryGauge = info.batteryIndicatorInfo;
			this.updateBatteryDetails();
		}
	}

	onRemainingTimeEvent(info: any) {
		console.log('onRemainingTimeEvent: ', info);
		if (info) {
			this.batteryInfo = info.batteryInformation;
			this.batteryGauge = info.batteryIndicatorInfo;
			this.updateBatteryDetails();
		}
	}

	public getBatteryDetailOnCard() {
		try {
			if (this.batteryService.isShellAvailable) {
				this.getBatteryDetails();

				this.batteryCardTimer = setInterval(() => {
					console.log('Trying after 30 seconds');
					this.getBatteryDetails();
				}, 30000);
			}
		} catch (error) {
			console.error('getBatteryDetailOnCard: ' + error.message);
		}
	}

	private getBatteryDetails() {
		this.batteryService.getBatteryDetail()
			.then((response: any) => {
				console.log('getBatteryDetails', response);
				this.batteryInfo = response;
				this.batteryInfo = response.batteryInformation;
				this.batteryGauge = response.batteryIndicatorInfo;
				this.getBatteryCondition();
				this.updateBatteryDetails();
			}).catch(error => {
				console.error('getBatteryDetails error', error);
			});
	}

	public updateBatteryDetails() {
		this.batteryIndicator.percent = this.batteryGauge.percentage;
		this.batteryIndicator.charging = this.batteryGauge.isAttached;
		this.batteryIndicator.convertMin(this.batteryGauge.time);
		this.batteryIndicator.timeText = this.batteryGauge.timeType;
		this.batteryIndicator.expressCharging = this.batteryInfo[0].isExpressCharging;
		this.batteryIndicator.voltageError = this.batteryInfo[0].isVoltageError;
		this.commonService.sendNotification(BatteryInformation.BatteryInfo, { detail: this.batteryInfo, gauge: this.batteryGauge });
		if (this.cd !== null && this.cd !== undefined &&
			!(this.cd as ViewRef_).destroyed) {
				this.cd.detectChanges();
			}
	}

	public showDetailModal(content: any): void {
		this.modalService
			.open(content, {
				backdrop: 'static',
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

	public getBatteryCondition() {
		// server api call to fetch battery conditions
		let batteryHealth = -1;
		this.batteryInfo.forEach((battery) => {
			if (battery.batteryHealth > batteryHealth) {
				batteryHealth = battery.batteryHealth;
			}
		});
		switch (batteryHealth) {
			case 3:
				batteryHealth = 1;
				break;
			case 4:
				batteryHealth = 2;
				break;
			case 5:
				batteryHealth = 2;
				break;
		}
		this.batteryCondition = new BatteryConditionModel(batteryHealth, 2);
		this.batteryConditionTranslation = this.batteryCondition.getBatteryCondition(this.batteryConditionsEnum[this.batteryCondition.condition]);
	}

	reInitValue() {
		this.flag = false;
		// this.getBatteryDetailOnCard();
	}
	ngOnDestroy() {
		clearTimeout(this.batteryCardTimer);
		this.shellServices.unRegisterEvent(EventTypes.pwrPowerSupplyStatusEvent, this.onPowerSupplyStatusEvent);
		this.shellServices.unRegisterEvent(EventTypes.pwrRemainingPercentageEvent, this.onRemainingPercentageEvent);
		this.shellServices.unRegisterEvent(EventTypes.pwrRemainingTimeEvent, this.onRemainingPercentageEvent);
	}
}
