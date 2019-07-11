import { Component, OnInit, OnDestroy, OnChanges, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BatteryDetailService } from 'src/app/services/battery-detail/battery-detail.service';
import BatteryDetail from 'src/app/data-models/battery/battery-detail.model';
import { BatteryChargeStatus } from 'src/app/enums/battery-charge-status.enum';
import BatteryIndicator from 'src/app/data-models/battery/battery-indicator.model';
import { CommonService } from 'src/app/services/common/common.service';
import { BatteryInformation, ChargeThresholdInformation } from 'src/app/enums/battery-information.enum';
import { EventTypes } from '@lenovo/tan-client-bridge';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { ViewRef_ } from '@angular/core/src/view';
import BatteryGaugeDetail from 'src/app/data-models/battery/battery-gauge-detail-model';
import { BatteryConditionsEnum, BatteryQuality } from 'src/app/enums/battery-conditions.enum';
import { BatteryConditionModel } from 'src/app/data-models/battery/battery-conditions.model';
import { BatteryConditionNote } from 'src/app/data-models/battery/battery-condition-translations.model';
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
	batteryConditionNotes: BatteryConditionNote[];
	batteryQuality = BatteryQuality;
	isBatteryDetailsBtnDisabled = true;
	// percentageLimitation: Store Limitation Percentage
	percentageLimitation = 60;
	batteryHealth = 0;
	batteryIndex = 0;
	chargeThresholdInfo: any; // ChargeThresholdInfo
	batteryConditionStatus: string;
	chargeThresholdBatteries: number[];
	private powerSupplyStatusEventRef: any;
	private remainingPercentageEventRef: any;
	private remainingTimeEventRef: any;
	public isLoading = true;

	notificationSubscription: Subscription;

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

				if (this.batteryInfo.length !== 0 && this.batteryInfo[0].fullChargeCapacity !== undefined
					&& this.batteryInfo[0].fullChargeCapacity !== null
					&& this.batteryInfo[0].designCapacity !== undefined && this.batteryInfo[0].designCapacity !== null) {
					const percentLimit = (this.batteryInfo[0].fullChargeCapacity / this.batteryInfo[0].designCapacity) * 100;
					this.percentageLimitation = parseFloat(percentLimit.toFixed(2));
				}

				this.commonService.setLocalStorageValue(LocalStorageKey.BatteryPercentage,
					this.batteryGauge.percentage);
				this.isBatteryDetailsBtnDisabled =
					this.batteryGauge.isPowerDriverMissing || this.batteryInfo.length === 0;
				this.updateBatteryDetails();
				this.getBatteryCondition();
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
					this.chargeThresholdInfo = notification.payload[0];
				}
			}

			// TODO: uncomment in dual battery implementation story

			// const chargeThresholdBatteries = [];
			// console.log('Charge Threshold Info: ', this.chargeThresholdInfo);
			// this.chargeThresholdInfo.forEach((chargeThreshold) => {
			// 	if (chargeThreshold.isCapable && chargeThreshold.isOn) {
			// 		chargeThresholdBatteries.push(chargeThreshold.batteryNum);
			// 	}
			// });
			// this.chargeThresholdBatteries = chargeThresholdBatteries;
		}
	}

	public updateBatteryDetails() {
		if (this.batteryInfo !== undefined && this.batteryInfo.length !== 0) {
			// let batteryIndex = -1;
			const remainingPercentages = [];
			this.batteryInfo.forEach((info) => {
				if (info.batteryHealth === undefined || info.batteryHealth === null) {
					info['batteryHealth'] = 0;
				}
				remainingPercentages.push(info.remainingPercent);
				// if (info.batteryHealth >= this.batteryHealth) {
				// 	this.batteryHealth = info.batteryHealth;
				// 	batteryIndex += 1;
				// }
			});
			this.batteryIndex = 0; // temp set primary battery conditions
			this.commonService.setLocalStorageValue(LocalStorageKey.RemainingPercentages, remainingPercentages);
			this.batteryHealth = this.batteryInfo[0].batteryHealth;
		}
		this.batteryIndicator.percent = this.batteryGauge.percentage;
		this.batteryIndicator.charging = this.batteryGauge.isAttached;
		this.batteryIndicator.convertMin(this.batteryGauge.time);
		this.batteryIndicator.timeText = this.batteryGauge.timeType;

		if (this.batteryGauge.isExpressCharging === undefined || this.batteryGauge.isExpressCharging === null) {
			this.batteryIndicator.expressCharging = false;
		} else {
			this.batteryIndicator.expressCharging = this.batteryGauge.isExpressCharging;
		}

		// if (this.batteryInfo.length > 0 &&
		// 	this.batteryInfo[this.batteryIndex].isVoltageError !== undefined) {
		// 	this.batteryIndicator.voltageError = this.batteryInfo[this.batteryIndex].isVoltageError;
		// } else {
		// 	this.batteryIndicator.voltageError = false;
		// }

		if (this.batteryHealth !== undefined) {
			this.batteryIndicator.batteryNotDetected = this.batteryHealth === 4;
		} else {
			this.batteryIndicator.batteryNotDetected = false;
		}

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
		const batteryConditions = [];
		const isThinkpad = this.commonService.getLocalStorageValue(LocalStorageKey.MachineType) === 1;

		this.batteryConditionStatus = this.getBatteryHealth(this.batteryHealth);
		if (this.batteryInfo.length > 0) {
			if (this.batteryHealth === undefined) {
				this.batteryHealth = 0;
			}
			if (isThinkpad && (this.batteryHealth === 1 || this.batteryHealth === 2)) {
				this.batteryHealth = BatteryConditionsEnum.StoreLimitation;
			}
			if (this.batteryHealth !== 0) {
				batteryConditions.push(new BatteryConditionModel(this.batteryHealth,
					this.batteryQuality[this.batteryConditionStatus]));
			}
			if (this.batteryInfo[this.batteryIndex].batteryCondition.length !== 0 &&
				this.batteryInfo[this.batteryIndex].batteryCondition[0] !== undefined &&
				this.batteryInfo[this.batteryIndex].batteryCondition[0] !== null) {
				this.batteryInfo[this.batteryIndex].batteryCondition.forEach((condition) => {
					if (condition === null || condition === undefined) {
						batteryConditions.push(new BatteryConditionModel(BatteryConditionsEnum.Good,
							BatteryQuality.Good));
					} else {
						switch (condition.toLocaleLowerCase()) {
							case 'normal':
								if (this.batteryHealth === 0) {
									batteryConditions.push(new BatteryConditionModel(BatteryConditionsEnum.Good,
										BatteryQuality.Good));
								}
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
					}
				});
			}
		}

		if (this.batteryGauge.isPowerDriverMissing) {
			batteryConditions.push(new BatteryConditionModel(BatteryConditionsEnum.MissingDriver, BatteryQuality.Poor));
		}

		// if (this.batteryGauge.acAdapterStatus.toLocaleLowerCase() === 'limited') {
		// 	batteryConditions.push(new BatteryConditionModel(BatteryConditionsEnum.LimitedACAdapterSupport, BatteryQuality.AcError));
		// }
		// if (this.batteryGauge.acAdapterStatus.toLocaleLowerCase() === 'notsupported') {
		// 	batteryConditions.push(new BatteryConditionModel(BatteryConditionsEnum.NotSupportACAdapter, BatteryQuality.AcError));
		// }

		this.batteryConditions = batteryConditions;
		console.log('Battery conditions length', this.batteryConditions.length);
		this.batteryConditionNotes = [];
		this.batteryConditions.forEach((batteryCondition) => {
			const translation = batteryCondition.getBatteryCondition(batteryCondition.condition);
			this.batteryConditionNotes.push(translation);
		});
	}

	getBatteryHealth(batteryHealth: number): string {
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
		return BatteryQuality[batteryHealth];
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
