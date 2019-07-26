import { Component, OnInit, OnDestroy, OnChanges, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BatteryDetailService } from 'src/app/services/battery-detail/battery-detail.service';
import BatteryDetail from 'src/app/data-models/battery/battery-detail.model';
import BatteryIndicator from 'src/app/data-models/battery/battery-indicator.model';
import { CommonService } from 'src/app/services/common/common.service';
import { BatteryInformation, ChargeThresholdInformation } from 'src/app/enums/battery-information.enum';
import { EventTypes } from '@lenovo/tan-client-bridge';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { ViewRef } from '@angular/core';
import BatteryGaugeDetail from 'src/app/data-models/battery/battery-gauge-detail-model';
import { BatteryConditionsEnum, BatteryQuality } from 'src/app/enums/battery-conditions.enum';
import { BatteryConditionModel } from 'src/app/data-models/battery/battery-conditions.model';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { PowerService } from 'src/app/services/power/power.service';
import { Subscription } from 'rxjs';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';

@Component({
	selector: 'vtr-battery-card',
	templateUrl: './battery-card.component.html',
	styleUrls: ['./battery-card.component.scss']
})
export class BatteryCardComponent implements OnInit, OnDestroy {

	batteryInfo: BatteryDetail[];
	batteryGauge: BatteryGaugeDetail;
	batteryCardTimer: any;
	batteryIndicator = new BatteryIndicator();
	flag = true;
	batteryConditions: BatteryConditionModel[];
	batteryConditionsEnum = BatteryConditionsEnum;
	batteryConditionNotes: string[];
	batteryQuality = BatteryQuality;
	isBatteryDetailsBtnDisabled = true;
	// percentageLimitation: Store Limitation Percentage
	percentageLimitation = 60;
	batteryHealth = 0;
	batteryIndex = 0;
	chargeThresholdInfo: any; // ChargeThresholdInfo
	batteryConditionStatus: string;
	private powerSupplyStatusEventRef: any;
	private remainingPercentageEventRef: any;
	private remainingTimeEventRef: any;
	public isLoading = true;
	public param1: any;
	public param2: any;
	notificationSubscription: Subscription;
	shortAcErrNote = true;

	constructor(
		private modalService: NgbModal,
		private batteryService: BatteryDetailService,
		private powerService: PowerService,
		public shellServices: VantageShellService,
		private commonService: CommonService,
		private cd: ChangeDetectorRef) {
	}

	ngOnInit() {
		this.isLoading = true;

		this.getBatteryDetailOnCard();

		this.powerSupplyStatusEventRef = this.onPowerSupplyStatusEvent.bind(this);
		this.remainingPercentageEventRef = this.onRemainingPercentageEvent.bind(this);
		this.remainingTimeEventRef = this.onRemainingTimeEvent.bind(this);

		this.shellServices.registerEvent(EventTypes.pwrPowerSupplyStatusEvent, this.powerSupplyStatusEventRef);
		this.shellServices.registerEvent(EventTypes.pwrRemainingPercentageEvent, this.remainingPercentageEventRef);
		this.shellServices.registerEvent(EventTypes.pwrRemainingTimeEvent, this.remainingTimeEventRef);

		this.notificationSubscription = this.commonService.notification.subscribe((response: AppNotification) => {
			this.onNotification(response);
		});
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
				this.isLoading = false;
				this.batteryInfo = response;
				this.batteryInfo = response.batteryInformation;
				this.batteryGauge = response.batteryIndicatorInfo;
				this.initBatteryInformation();
				this.updateBatteryDetails();
			}).catch(error => {
				console.error('getBatteryDetails error', error);
			});
	}

	onNotification(notification: AppNotification) {
		if (notification && notification.type === ChargeThresholdInformation.ChargeThresholdInfo) {
			const chargeThresholdInfo = notification.payload;
			this.chargeThresholdInfo = chargeThresholdInfo[0];
			if (chargeThresholdInfo.length > 1) {
				if (!chargeThresholdInfo[0].isOn && chargeThresholdInfo[1].isOn) {
					this.chargeThresholdInfo = notification.payload[1];
				}
			}
			if (this.chargeThresholdInfo && this.chargeThresholdInfo.isOn) {
				this.param1 = { value: this.chargeThresholdInfo.stopValue };
			}
		}
	}

	public initBatteryInformation() {
		this.batteryGauge.isExpressCharging = this.batteryGauge.isExpressCharging || false;
		this.batteryGauge.percentage = this.batteryGauge.percentage || 0;
		this.batteryInfo[0].batteryHealth = this.batteryInfo[0].batteryHealth || 0;
		this.batteryInfo[0].batteryCondition = this.batteryInfo[0].batteryCondition || ['Normal'];
		this.batteryInfo[0].fullChargeCapacity = this.batteryInfo[0].fullChargeCapacity || 0;
		this.batteryInfo[0].designCapacity = this.batteryInfo[0].designCapacity || 0;
	}

	public updateBatteryDetails() {
		if (this.batteryInfo && this.batteryInfo.length > 0) {
			this.isBatteryDetailsBtnDisabled = this.batteryGauge.isPowerDriverMissing;
			const remainingPercentages = [];
			this.batteryInfo.forEach((info) => {
				remainingPercentages.push(info.remainingPercent);
			});

			this.commonService.setLocalStorageValue(LocalStorageKey.RemainingPercentages, remainingPercentages);
			this.batteryHealth = this.batteryInfo[0].batteryHealth;
			this.batteryIndicator.batteryNotDetected = this.batteryHealth === 4;
		}

		this.batteryIndicator.percent = this.batteryGauge.percentage;
		this.batteryIndicator.charging = this.batteryGauge.isAttached;
		this.batteryIndicator.convertMin(this.batteryGauge.time);
		this.batteryIndicator.timeText = this.batteryGauge.timeType;
		this.batteryIndicator.expressCharging = this.batteryGauge.isExpressCharging;
		this.getBatteryCondition();
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
		const batteryConditions = [];
		const isThinkpad = this.commonService.getLocalStorageValue(LocalStorageKey.MachineType) === 1;

		if (this.batteryGauge.isPowerDriverMissing) {
			batteryConditions.push(new BatteryConditionModel(BatteryConditionsEnum.MissingDriver, BatteryQuality.Poor));
		}
		if (!(this.batteryIndicator.batteryNotDetected && this.batteryGauge.isPowerDriverMissing)) {
			if (this.batteryGauge.acAdapterStatus.toLocaleLowerCase() === 'limited') {
				batteryConditions.push(new BatteryConditionModel(BatteryConditionsEnum.LimitedACAdapterSupport, BatteryQuality.AcError));
			}

			if (this.batteryGauge.acAdapterStatus.toLocaleLowerCase() === 'notsupported') {
				batteryConditions.push(new BatteryConditionModel(BatteryConditionsEnum.NotSupportACAdapter, BatteryQuality.AcError));
			}
		}

		if (this.batteryInfo && this.batteryInfo.length > 0) {

			if (isThinkpad && (this.batteryHealth === 1 || this.batteryHealth === 2)) {
				this.batteryHealth = BatteryConditionsEnum.StoreLimitation;
				const percentLimit = (this.batteryInfo[0].fullChargeCapacity / this.batteryInfo[0].designCapacity) * 100;
				this.param2 = { value: parseFloat(percentLimit.toFixed(1)) };
			}
			this.batteryConditionStatus = this.getConditionState(this.batteryHealth);

			this.batteryInfo[this.batteryIndex].batteryCondition.forEach((condition) => {
				switch (condition.toLocaleLowerCase()) {
					case 'normal':
						batteryConditions.push(new BatteryConditionModel(this.batteryHealth,
							this.batteryQuality[this.batteryConditionStatus]));
						break;
					case 'hightemperature':
						batteryConditions.push(new BatteryConditionModel(BatteryConditionsEnum.HighTemperature, BatteryQuality.Fair));
						break;
					case 'tricklecharge':
						batteryConditions.push(new BatteryConditionModel(BatteryConditionsEnum.TrickleCharge, BatteryQuality.Fair));
						break;
					case 'overheatedbattery':
						batteryConditions.push(new BatteryConditionModel(BatteryConditionsEnum.OverheatedBattery, BatteryQuality.Fair));
						break;
					case 'permanenterror':
						batteryConditions.push(new BatteryConditionModel(BatteryConditionsEnum.PermanentError, BatteryQuality.Poor));
						break;
					case 'hardwareauthenticationerror':
						batteryConditions.push(new BatteryConditionModel(BatteryConditionsEnum.HardwareAuthenticationError, BatteryQuality.Fair));
						break;
				}
			});
		}

		this.batteryConditions = batteryConditions;

		this.commonService.sendNotification(BatteryInformation.BatteryInfo, { detail: this.batteryInfo, indicator: this.batteryIndicator, conditions: this.batteryConditions });

		console.log('Battery conditions length', this.batteryConditions.length);
		this.batteryConditionNotes = [];
		this.batteryConditions.forEach((batteryCondition) => {
			let translation = batteryCondition.getBatteryConditionTip(batteryCondition.condition);

			if (batteryCondition.conditionStatus === this.batteryQuality.AcError && !this.shortAcErrNote) {
				translation += 'Detail';
			}

			this.batteryConditionNotes.push(translation);
		});

		if (this.cd !== null && this.cd !== undefined &&
			!(this.cd as ViewRef).destroyed) {
			this.cd.detectChanges();
		}
	}

	showDetailTip(index: number) {
		this.shortAcErrNote = false;
		this.batteryConditionNotes[index] = this.batteryConditionNotes[index] + 'Detail';
	}

	getConditionState(conditionState: number): string {
		switch (conditionState) {
			case 3:
				conditionState = 1;
				break;
			case 4:
				conditionState = 2;
				break;
			case 5:
				conditionState = 2;
				break;
		}
		return BatteryQuality[conditionState];
	}

	reInitValue() {
		this.flag = false;
		// this.getBatteryDetailOnCard();
	}

	ngOnDestroy() {
		clearTimeout(this.batteryCardTimer);
		this.shellServices.unRegisterEvent(EventTypes.pwrPowerSupplyStatusEvent, this.powerSupplyStatusEventRef);
		this.shellServices.unRegisterEvent(EventTypes.pwrRemainingPercentageEvent, this.remainingPercentageEventRef);
		this.shellServices.unRegisterEvent(EventTypes.pwrRemainingTimeEvent, this.remainingTimeEventRef);
		this.notificationSubscription.unsubscribe();
	}
}
