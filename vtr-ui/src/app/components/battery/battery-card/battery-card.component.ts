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
import { Subscription } from 'rxjs/internal/Subscription';
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
	thresholdNote: any;
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
	public param1: any;
	public param2: any;
	remainingPercentages: number[];
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

	/**
	 * gets battery details from js bridge
	 */
	private getBatteryDetails() {
		this.batteryService.getBatteryDetail()
			.then((response: any) => {
				console.log('getBatteryDetails', response);
				this.isLoading = false;
				this.batteryInfo = response;
				this.batteryInfo = response.batteryInformation;
				this.batteryGauge = response.batteryIndicatorInfo;
				this.updateBatteryDetails();
				this.getBatteryCondition();
			}).catch(error => {
				console.error('getBatteryDetails error', error);
			});
	}

	/**
	 * gets changed values at charge threshold section
	 * @param notification: AppNotification for change in chargeThreshold
	 */
	onNotification(notification: AppNotification) {
		if (notification && notification.type === ChargeThresholdInformation.ChargeThresholdInfo) {
			this.chargeThresholdInfo = notification.payload;
			if (this.chargeThresholdInfo !== undefined && this.chargeThresholdInfo.isOn) {
				this.param1 = { value: this.chargeThresholdInfo.stopValue1 };
			}
			this.sendThresholdWarning();
		}
	}

	/**
	 * initializes a batteryIndicator object for showing battery from batteryInfo
	 */
	public updateBatteryDetails() {

		this.batteryIndicator.percent = this.batteryGauge.percentage;
		this.batteryIndicator.charging = this.batteryGauge.isAttached;
		this.batteryIndicator.convertMin(this.batteryGauge.time);
		this.batteryIndicator.timeText = this.batteryGauge.timeType;

		this.isBatteryDetailsBtnDisabled = this.batteryGauge.isPowerDriverMissing;
		if (this.batteryGauge.isExpressCharging === undefined || this.batteryGauge.isExpressCharging === null) {
			this.batteryIndicator.expressCharging = false;
		} else {
			this.batteryIndicator.expressCharging = this.batteryGauge.isExpressCharging;
		}

		if (this.batteryInfo !== undefined && this.batteryInfo.length > 0) {
			const remainingPercentages = [];
			this.batteryInfo.forEach((info) => {
				if (info.batteryHealth === undefined || info.batteryHealth === null) {
					info.batteryHealth = 0;
				}
				if (info.remainingPercent !== undefined || info.remainingPercent !== null) {
					remainingPercentages.push(info.remainingPercent);
				}
			});
			this.batteryIndex = 0; // temp set primary battery conditions
			if (remainingPercentages.length > 0) {
				this.remainingPercentages = remainingPercentages;
				this.sendThresholdWarning();
			}
			this.batteryHealth = this.batteryInfo[0].batteryHealth;

			this.batteryIndicator.batteryNotDetected = this.batteryHealth === 4;

		} else {
			this.isBatteryDetailsBtnDisabled = true;
		}

		this.commonService.sendNotification(BatteryInformation.BatteryInfo, { detail: this.batteryInfo, gauge: this.batteryGauge });

		if (this.cd !== null && this.cd !== undefined &&
			!(this.cd as ViewRef).destroyed) {
			this.cd.detectChanges();
		}
	}

	/**
	 * sends notification to threshold section in case of update in remaining percentages & thresholdInfo
	 * for displaying warning note
	 */
	private sendThresholdWarning() {
		if (this.chargeThresholdInfo !== undefined && this.remainingPercentages !== undefined
			&& this.remainingPercentages.length > 0) {
			if (this.chargeThresholdInfo.isOn) {
				if (this.chargeThresholdInfo.stopValue1 !== undefined &&
					this.remainingPercentages[0] !== undefined &&
					this.remainingPercentages[0] > this.chargeThresholdInfo.stopValue1) {
					this.commonService.sendNotification('ThresholdWarningNote', true);
				} else if (this.chargeThresholdInfo.stopValue2 !== undefined &&
					this.remainingPercentages[1] !== undefined &&
					this.remainingPercentages[1] > this.chargeThresholdInfo.stopValue2) {
					this.commonService.sendNotification('ThresholdWarningNote', true);
				} else {
					this.commonService.sendNotification('ThresholdWarningNote', false);
				}
			}
		}
	}

	/**
	 * shows a battery details modal
	 * @param content: battery Information
	 */
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

	/**
	 * sets a battery condition tip & icon from battery health & battery condition
	 */
	public getBatteryCondition() {
		const batteryConditions = [];
		const isThinkpad = this.commonService.getLocalStorageValue(LocalStorageKey.MachineType) === 1;

		if (this.batteryInfo && this.batteryInfo.length > 0) {
			if (this.batteryHealth === undefined) {
				this.batteryHealth = 0;
			}
			this.batteryConditionStatus = this.getBatteryConditionStatus(this.batteryHealth);
			if (isThinkpad && (this.batteryHealth === 1 || this.batteryHealth === 2)) {
				this.batteryHealth = BatteryConditionsEnum.StoreLimitation;
				if (this.batteryInfo[0].fullChargeCapacity !== undefined
					&& this.batteryInfo[0].fullChargeCapacity !== null
					&& this.batteryInfo[0].designCapacity !== undefined
					&& this.batteryInfo[0].designCapacity !== null) {

					const percentLimit = (this.batteryInfo[0].fullChargeCapacity / this.batteryInfo[0].designCapacity) * 100;
					this.percentageLimitation = parseFloat(percentLimit.toFixed(1));
					this.param2 = { value: this.percentageLimitation };
				}
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

	/**
	 * maps batteryHealth to a condition status Icon(i.e. good, poor,bad, AcError)
	 * @param conditionStatus: batteryHealth
	 * @returns BatteryQuality[conditionStatus]: status of battery for condition icon
	 */
	getBatteryConditionStatus(conditionStatus: number): string {
		switch (conditionStatus) {
			case 3:
				conditionStatus = 1;
				break;
			case 4:
				conditionStatus = 2;
				break;
			case 5:
				conditionStatus = 2;
				break;
		}
		return BatteryQuality[conditionStatus];
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
