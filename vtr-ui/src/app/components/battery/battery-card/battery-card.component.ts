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
import { BatteryConditionNote } from 'src/app/data-models/battery/battery-condition-translations.model';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

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
	batteryConditions: BatteryConditionModel[];
	batteryConditionsEnum = BatteryConditionsEnum;
	batteryConditionNotes: BatteryConditionNote[];
	batteryQuality = BatteryQuality;
	isBatteryDetailsBtnDisabled = true;
	// percentageLimitation: Store Limitation Percentage
	percentageLimitation = 60;

	private powerSupplyStatusEventRef: any;
	private remainingPercentageEventRef: any;
	private remainingTimeEventRef: any;

	ngOnInit() {
		this.getBatteryDetailOnCard();

		this.powerSupplyStatusEventRef = this.onPowerSupplyStatusEvent.bind(this);
		this.remainingPercentageEventRef = this.onRemainingPercentageEvent.bind(this);
		this.remainingTimeEventRef = this.onRemainingTimeEvent.bind(this);

		this.shellServices.registerEvent(EventTypes.pwrPowerSupplyStatusEvent, this.powerSupplyStatusEventRef);
		this.shellServices.registerEvent(EventTypes.pwrRemainingPercentageEvent, this.remainingPercentageEventRef);
		this.shellServices.registerEvent(EventTypes.pwrRemainingTimeEvent, this.remainingTimeEventRef);
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
				this.isBatteryDetailsBtnDisabled =
					this.batteryGauge.isPowerDriverMissing || this.batteryInfo.length === 0;
				this.updateBatteryDetails();
				this.getBatteryCondition();
			}).catch(error => {
				console.error('getBatteryDetails error', error);
			});
	}

	public updateBatteryDetails() {
		let batteryHealth = 0;
		if (this.batteryInfo !== undefined && this.batteryInfo.length !== 0
			&& this.batteryInfo[0].batteryHealth !== undefined) {
			batteryHealth = this.batteryInfo[0].batteryHealth;
		}
		this.batteryIndicator.batteryHealth = this.batteryIndicator.getBatteryHealth(batteryHealth);
		this.batteryIndicator.percent = this.batteryGauge.percentage;
		this.batteryIndicator.charging = this.batteryGauge.isAttached;
		this.batteryIndicator.convertMin(this.batteryGauge.time);
		this.batteryIndicator.timeText = this.batteryGauge.timeType;
		this.batteryIndicator.expressCharging = this.batteryGauge.isExpressCharging;
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
		const batteryConditions = [];
		let batteryHealth = 0;
		if (this.batteryInfo !== undefined && this.batteryInfo.length !== 0
			&& this.batteryInfo[0].batteryHealth !== undefined) {
			batteryHealth = this.batteryInfo[0].batteryHealth;
		}
		const isThinkpad = this.commonService.getLocalStorageValue(LocalStorageKey.MachineType) === 1;
		if (isThinkpad && batteryHealth === 1 || batteryHealth === 2) {
			batteryHealth = BatteryConditionsEnum.StoreLimitation;
		}
		batteryConditions.push(new BatteryConditionModel(batteryHealth,
			this.batteryQuality[this.batteryIndicator.batteryHealth]));
		this.batteryInfo[0].batteryCondition.forEach((condition) => {
			switch (condition.toLocaleLowerCase()) {
				case 'normal':
					batteryConditions.push(new BatteryConditionModel(BatteryConditionsEnum.Normal,
						BatteryQuality.Fair));
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
					batteryConditions.push(new BatteryConditionModel(BatteryConditionsEnum.PermanentError, BatteryQuality.Fair));
					break;
				case 'hardwareauthenticationerror':
					batteryConditions.push(new BatteryConditionModel(BatteryConditionsEnum.HardwareAuthenticationError, BatteryQuality.Fair));
					break;
			}
		});
		if (this.batteryGauge.isPowerDriverMissing) {
			batteryConditions.push(new BatteryConditionModel(BatteryConditionsEnum.MissingDriver, BatteryQuality.Poor));
		}
		if (this.batteryGauge.acAdapterStatus.toLocaleLowerCase() === 'limited') {
			batteryConditions.push(new BatteryConditionModel(BatteryConditionsEnum.LimitedACAdapterSupport, BatteryQuality.Fair));
		}
		if (this.batteryGauge.acAdapterStatus.toLocaleLowerCase() === 'notsupported') {
			batteryConditions.push(new BatteryConditionModel(BatteryConditionsEnum.NotSupportACAdapter, BatteryQuality.Poor));
		}

		this.batteryConditions = batteryConditions;
		console.log('Battery conditions length', this.batteryConditions.length);
		this.batteryConditionNotes = [];
		this.batteryConditions.forEach((batteryCondition) => {
			console.log('Condition', batteryCondition.condition);
			const translation = batteryCondition.getBatteryCondition(batteryCondition.condition);
			console.log('Translation==>', translation);
			if (translation !== undefined) {
				this.batteryConditionNotes.push(translation);
			}
		});
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
	}
}
