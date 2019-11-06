import { Component, OnInit, OnDestroy, ChangeDetectorRef, ElementRef, ViewChild, ViewRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BatteryDetailService } from 'src/app/services/battery-detail/battery-detail.service';
import BatteryDetail from 'src/app/data-models/battery/battery-detail.model';
import BatteryIndicator from 'src/app/data-models/battery/battery-indicator.model';
import { CommonService } from 'src/app/services/common/common.service';
import { BatteryInformation, ChargeThresholdInformation } from 'src/app/enums/battery-information.enum';
import { EventTypes } from '@lenovo/tan-client-bridge';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import BatteryGaugeDetail from 'src/app/data-models/battery/battery-gauge-detail-model';
import { BatteryConditionsEnum, BatteryStatus } from 'src/app/enums/battery-conditions.enum';
import { BatteryConditionModel } from 'src/app/data-models/battery/battery-conditions.model';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { Subscription } from 'rxjs/internal/Subscription';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { EMPTY } from 'rxjs';
import { BatteryGaugeReset } from 'src/app/data-models/device/battery-gauge-reset.model';

@Component({
	selector: 'vtr-battery-card',
	templateUrl: './battery-card.component.html',
	styleUrls: ['./battery-card.component.scss']
})
export class BatteryCardComponent implements OnInit, OnDestroy {

	@ViewChild('batteryDetail', { static: false }) batteryModal: ElementRef<HTMLElement>;
	batteryInfo: BatteryDetail[];
	batteryGauge: BatteryGaugeDetail;
	batteryCardTimer: any;
	batteryIndicator = new BatteryIndicator();
	flag = true;
	batteryConditions: BatteryConditionModel[];
	batteryConditionsEnum = BatteryConditionsEnum;
	batteryConditionNotes: string[];
	batteryStatus = BatteryStatus;
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
	private powerBatteryGaugeResetEventRef: any;
	public isLoading = true;
	public thresholdNoteParam: any;
	public storeLimitationNoteParam: any;
	public acAdapterInfoParams: any;
	remainingPercentages: number[];
	notificationSubscription: Subscription;
	shortAcErrNote = true;
	isModalShown: boolean;
	isGaugeResetRunning: boolean;

	constructor(
		private modalService: NgbModal,
		private batteryService: BatteryDetailService,
		public shellServices: VantageShellService,
		private commonService: CommonService,
		private cd: ChangeDetectorRef,
		private logger: LoggerService,
		private activatedRoute: ActivatedRoute) {
	}

	ngOnInit() {
		this.isLoading = true;
		this.activatedRoute.queryParamMap.subscribe((params: ParamMap) => {
			console.log(params);
			if (params.has('batterydetail') && this.isModalShown) {
				this.isModalShown = false;
				this.getBatteryDetails();
			}
		});
		this.powerSupplyStatusEventRef = this.onPowerSupplyStatusEvent.bind(this);
		this.remainingPercentageEventRef = this.onRemainingPercentageEvent.bind(this);
		this.remainingTimeEventRef = this.onRemainingTimeEvent.bind(this);
		this.powerBatteryGaugeResetEventRef = this.onPowerBatteryGaugeResetEvent.bind(this);

		this.shellServices.registerEvent(EventTypes.pwrPowerSupplyStatusEvent, this.powerSupplyStatusEventRef);
		this.shellServices.registerEvent(EventTypes.pwrRemainingPercentageEvent, this.remainingPercentageEventRef);
		this.shellServices.registerEvent(EventTypes.pwrRemainingTimeEvent, this.remainingTimeEventRef);
		this.shellServices.registerEvent(EventTypes.pwrBatteryGaugeResetEvent, this.powerBatteryGaugeResetEventRef);

		this.notificationSubscription = this.commonService.notification.subscribe((response: AppNotification) => {
			this.onNotification(response);
		});
		this.getBatteryDetailOnCard();
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

	onPowerBatteryGaugeResetEvent(batteryGaugeResetInfo: BatteryGaugeReset[]) {
		console.log('onPowerBatteryGaugeResetEvent: Information', batteryGaugeResetInfo);
		if (batteryGaugeResetInfo && batteryGaugeResetInfo.length > 0) {
			this.commonService.sendNotification('GaugeResetInfo', batteryGaugeResetInfo);
			if (batteryGaugeResetInfo[0].isResetRunning || (batteryGaugeResetInfo.length > 1 && batteryGaugeResetInfo[1].isResetRunning)) {
				this.isGaugeResetRunning = true;
			} else {
				this.isGaugeResetRunning = false;
			}
		}
	}

	public getBatteryDetailOnCard() {
		try {
			if (this.batteryService.isShellAvailable) {
				this.getBatteryDetails();
				this.getBatteryDetailsMonitor();
			}
		} catch (error) {
			this.logger.error('getBatteryDetailOnCard: ' + error.message);
			return EMPTY;
		}
	}

	getBatteryDetailsMonitor() {
		console.log('start battery details monitor');
		if (this.batteryService.isShellAvailable) {
			this.batteryService
				.startMonitor(this.setBatteryCard.bind(this))
				.then((value: any) => {
					console.log('battery details response', value);
				}).catch(error => {
					this.logger.error('battery details error', error.message);
					return EMPTY;
				});
		}
	}

	setBatteryCard(response) {
		console.log('Battery Info', response);
		this.batteryInfo = response.batteryInformation;
		this.batteryGauge = response.batteryIndicatorInfo;
		this.updateBatteryDetails();

		const showBatteryDetail = this.activatedRoute.snapshot.queryParams.batterydetail;
		if (showBatteryDetail && !this.isModalShown) {
			this.showDetailModal(this.batteryModal);
			this.isModalShown = true;
		}
	}

	/**
	 * gets battery details from js bridge
	 */
	public getBatteryDetails() {
		this.batteryService.getBatteryDetail()
			.then((response: any) => {
				console.log('getBatteryDetails', response);
				this.isLoading = false;
				this.setBatteryCard(response);
			}).catch(error => {
				this.logger.error('getBatteryDetails error', error.message);
				return EMPTY;
			});
	}

	/**
	 * gets changed values at charge threshold section && Airplane Mode section
	 * @param notification: AppNotification for change in chargeThreshold
	 */
	onNotification(notification: AppNotification) {
		if (notification) {
			if (notification.type === ChargeThresholdInformation.ChargeThresholdInfo) {
				this.chargeThresholdInfo = notification.payload;
				if (this.chargeThresholdInfo !== undefined && this.chargeThresholdInfo.isOn) {
					this.thresholdNoteParam = { value: this.chargeThresholdInfo.stopValue1 };
				}
				this.sendThresholdWarning();
			}
			if (notification.type === 'AirplaneModeStatus') {
				this.batteryIndicator.isAirplaneMode = notification.payload;
			}
			if (notification.type === 'GaugeResetUpdate') {
				this.onPowerBatteryGaugeResetEvent(notification.payload);
			}
		}
	}

	public initBatteryInformation() {
		this.batteryGauge.isExpressCharging = this.batteryGauge.isExpressCharging || false;
		this.batteryGauge.percentage = this.batteryGauge.percentage || 0;
		this.batteryInfo[0].batteryHealth = this.batteryInfo[0].batteryHealth || 0;
		if (!(this.batteryInfo[0].batteryCondition && this.batteryInfo[0].batteryCondition.length > 0)) {
			this.batteryInfo[0].batteryCondition = ['Normal'];
		}
		this.batteryInfo[0].fullChargeCapacity = this.batteryInfo[0].fullChargeCapacity || 0;
		this.batteryInfo[0].designCapacity = this.batteryInfo[0].designCapacity || 0;
		this.batteryIndicator.isAirplaneMode = this.batteryIndicator.isAirplaneMode || false;
	}

	public updateBatteryDetails() {

		if (this.batteryInfo && this.batteryInfo.length > 0) {
			this.initBatteryInformation();
			const remainingPercentages = [];
			this.batteryInfo.forEach((info) => {
				remainingPercentages.push(info.remainingPercent);
			});
			this.remainingPercentages = remainingPercentages;
			this.sendThresholdWarning();
			this.batteryHealth = this.batteryInfo[0].batteryHealth;
			this.batteryIndicator.batteryNotDetected = this.batteryHealth === 4;
			this.batteryService.isAcAttached = this.batteryGauge.isAttached;
			this.batteryService.remainingPercentages = this.remainingPercentages;
			// const payload = {
			// 	remainingPercentages: this.remainingPercentages,
			// 	isACAttached: this.batteryGauge.isAttached
			// };
			// this.commonService.sendNotification('BatteryInfoForGaugeReset', payload);
		} else {
			this.batteryIndicator.batteryNotDetected = false;
		}

		this.isBatteryDetailsBtnDisabled = this.batteryGauge.isPowerDriverMissing;
		this.commonService.sendNotification('IsPowerDriverMissing', this.isBatteryDetailsBtnDisabled);
		this.batteryIndicator.percent = this.batteryGauge.percentage;
		this.batteryIndicator.charging = this.batteryGauge.isAttached;
		this.batteryIndicator.convertMin(this.batteryGauge.time);
		this.batteryIndicator.timeText = this.batteryGauge.timeType;
		this.batteryIndicator.expressCharging = this.batteryGauge.isExpressCharging;

		this.getBatteryCondition();
	}

	/**
	 * sends notification to threshold section in case of update in remaining percentages & thresholdInfo
	 * for displaying warning note
	 */
	public sendThresholdWarning() {
		if (this.chargeThresholdInfo && this.remainingPercentages
			&& this.remainingPercentages.length > 0) {
			this.batteryIndicator.isChargeThresholdOn = this.chargeThresholdInfo.isOn;
			if (this.chargeThresholdInfo.isOn) {
				if ((this.chargeThresholdInfo.stopValue1 &&
					this.remainingPercentages[0] &&
					this.remainingPercentages[0] > this.chargeThresholdInfo.stopValue1)
					|| (this.chargeThresholdInfo.stopValue2 &&
						this.remainingPercentages[1] &&
						this.remainingPercentages[1] > this.chargeThresholdInfo.stopValue2)) {
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

	/* showDetailModalOnKDEnter(event: any, content: any) {
		var target = event.target || event.srcElement || event.currentTarget;
		this.showDetailModal(content);
	} */

	/**
	 * sets a battery condition tip & icon from battery health & battery condition
	 */
	public getBatteryCondition() {
		// const machineType = this.commonService.getLocalStorageValue(LocalStorageKey.MachineType);
		let healthCondition: number;
		const batteryConditions = [];
		const isThinkPad = this.commonService.getLocalStorageValue(LocalStorageKey.MachineType) === 1;

		if (this.batteryGauge.isPowerDriverMissing) {
			batteryConditions.push(new BatteryConditionModel(BatteryConditionsEnum.MissingDriver, BatteryStatus.Poor));
		}

		if (this.batteryInfo && this.batteryInfo.length > 0) {

			healthCondition = this.batteryHealth;
			this.batteryConditionStatus = this.getConditionState(this.batteryHealth);

			if (isThinkPad && (this.batteryHealth === 1 || this.batteryHealth === 2)) {
				healthCondition = BatteryConditionsEnum.StoreLimitation;
				const percentLimit = (this.batteryInfo[0].fullChargeCapacity / this.batteryInfo[0].designCapacity) * 100;
				this.storeLimitationNoteParam = { value: parseFloat(percentLimit.toFixed(1)) };
			}
			this.batteryInfo[this.batteryIndex].batteryCondition.forEach((condition) => {
				switch (condition.toLocaleLowerCase()) {
					case 'normal':
						batteryConditions.push(new BatteryConditionModel(healthCondition,
							this.batteryStatus[this.batteryConditionStatus]));
						break;
					case 'hightemperature':
						batteryConditions.push(new BatteryConditionModel(BatteryConditionsEnum.HighTemperature, BatteryStatus.Fair));
						break;
					case 'tricklecharge':
						batteryConditions.push(new BatteryConditionModel(BatteryConditionsEnum.TrickleCharge, BatteryStatus.Fair));
						break;
					case 'overheatedbattery':
						batteryConditions.push(new BatteryConditionModel(BatteryConditionsEnum.OverheatedBattery, BatteryStatus.Fair));
						break;
					case 'permanenterror':
						batteryConditions.push(new BatteryConditionModel(BatteryConditionsEnum.PermanentError, BatteryStatus.Poor));
						break;
					case 'hardwareauthenticationerror':
						batteryConditions.push(new BatteryConditionModel(BatteryConditionsEnum.UnsupportedBattery, BatteryStatus.Fair));
						break;
					case 'nonthinkpadbattery':
						batteryConditions.push(new BatteryConditionModel(BatteryConditionsEnum.UnsupportedBattery, BatteryStatus.Fair));
						break;
					case 'unsupportedbattery':
						batteryConditions.push(new BatteryConditionModel(BatteryConditionsEnum.UnsupportedBattery, BatteryStatus.Fair));
						break;
				}
			});
		}

		if (!(this.batteryIndicator.batteryNotDetected || this.batteryGauge.isPowerDriverMissing)) {

			// AcAdapter conditions hidden for IdeaPad & IdeaCenter machines
			if (isThinkPad) {
				if (this.batteryGauge.acAdapterStatus && this.batteryGauge.acAdapterStatus !== null) {
					if (this.batteryGauge.acAdapterStatus.toLocaleLowerCase() === 'supported' && this.batteryGauge.isAttached) {
						this.batteryGauge.acAdapterType = this.batteryGauge.acAdapterType === 'Legacy' ? 'ac' : 'USB-C';
						this.acAdapterInfoParams = { acWattage: this.batteryGauge.acWattage, acAdapterType: this.batteryGauge.acAdapterType };
						batteryConditions.push(new BatteryConditionModel(BatteryConditionsEnum.FullACAdapterSupport, BatteryStatus.AcAdapterStatus));
					}
					if (this.batteryGauge.acAdapterStatus.toLocaleLowerCase() === 'limited') {
						batteryConditions.push(new BatteryConditionModel(BatteryConditionsEnum.LimitedACAdapterSupport, BatteryStatus.AcAdapterStatus));
					}

					if (this.batteryGauge.acAdapterStatus.toLocaleLowerCase() === 'notsupported') {
						batteryConditions.push(new BatteryConditionModel(BatteryConditionsEnum.NotSupportACAdapter, BatteryStatus.AcAdapterStatus));
					}
				}
			}
		}

		this.batteryConditions = batteryConditions;
		console.log('Battery Conditions ====>', this.batteryConditions);
		this.commonService.sendNotification(BatteryInformation.BatteryInfo, { detail: this.batteryInfo, indicator: this.batteryIndicator, conditions: this.batteryConditions });

		this.setConditionTips();

		if (this.cd !== null && this.cd !== undefined &&
			!(this.cd as ViewRef).destroyed) {
			this.cd.detectChanges();
		}
	}

	setConditionTips() {
		this.batteryConditionNotes = [];
		let count = 0;
		this.batteryConditions.forEach((batteryCondition) => {

			let translation = batteryCondition.getBatteryConditionTip(batteryCondition.condition);
			if (batteryCondition.conditionStatus === this.batteryStatus.AcAdapterStatus && batteryCondition.condition !== this.batteryConditionsEnum.FullACAdapterSupport
				&& !this.shortAcErrNote) {
				translation += 'Detail';
			}
			if (batteryCondition.condition === BatteryConditionsEnum.UnsupportedBattery) {
				if (count === 0) {
					this.batteryConditionNotes.push(translation);
				}
				count++;

			} else {
				this.batteryConditionNotes.push(translation);
			}
		});
	}

	showDetailTip(index: number) {
		this.shortAcErrNote = false;
		this.batteryConditionNotes[index] = this.batteryConditionNotes[index] + 'Detail';
	}

	/**
	 * maps batteryHealth to a condition status Icon(i.e. good, poor,bad, AcError)
	 * @param conditionStatus: batteryHealth
	 * @returns BatteryQuality[conditionStatus]: status of battery for condition icon
	 */
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
		return BatteryStatus[conditionState];
	}

	reInitValue() {
		this.flag = false;
		// this.getBatteryDetailOnCard();
	}

	ngOnDestroy() {
		if (this.batteryService.isShellAvailable) {
			console.log('STOP MONITOR');
			this.batteryService.stopMonitor();
		}
		this.shellServices.unRegisterEvent(EventTypes.pwrPowerSupplyStatusEvent, this.powerSupplyStatusEventRef);
		this.shellServices.unRegisterEvent(EventTypes.pwrRemainingPercentageEvent, this.remainingPercentageEventRef);
		this.shellServices.unRegisterEvent(EventTypes.pwrRemainingTimeEvent, this.remainingTimeEventRef);
		this.notificationSubscription.unsubscribe();
		this.shellServices.unRegisterEvent(EventTypes.pwrBatteryGaugeResetEvent, this.powerBatteryGaugeResetEventRef);
	}
	/*
		@HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
			this.closeModal();
		} */

}
