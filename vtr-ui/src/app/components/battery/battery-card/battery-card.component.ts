import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewRef } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { EventTypes } from '@lenovo/tan-client-bridge';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EMPTY, Subscription } from 'rxjs';
import { BatteryConditionModel } from 'src/app/data-models/battery/battery-conditions.model';
import BatteryDetail from 'src/app/data-models/battery/battery-detail.model';
import BatteryGaugeDetail from 'src/app/data-models/battery/battery-gauge-detail-model';
import BatteryIndicator from 'src/app/data-models/battery/battery-indicator.model';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import CommonMetricsModel from 'src/app/data-models/common/common-metrics.model';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { BatteryGaugeReset } from 'src/app/data-models/device/battery-gauge-reset.model';
import { ChargeThreshold } from 'src/app/data-models/device/charge-threshold.model';
import { BatteryConditionsEnum, BatteryStatus } from 'src/app/enums/battery-conditions.enum';
import { BatteryInformation, ChargeThresholdInformation } from 'src/app/enums/battery-information.enum';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { BatteryDetailService } from 'src/app/services/battery-detail/battery-detail.service';
import { CommonService } from 'src/app/services/common/common.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';

declare var Windows;

@Component({
	selector: 'vtr-battery-card',
	templateUrl: './battery-card.component.html',
	styleUrls: ['./battery-card.component.scss']
})
export class BatteryCardComponent implements OnInit, OnDestroy {

	@ViewChild('batteryDetail', { static: false }) batteryModal: ElementRef<HTMLElement>;
	batteryInfo: BatteryDetail[];
	batteryGauge: BatteryGaugeDetail;
	batteryIndicator = new BatteryIndicator();
	flag = true;
	batteryConditions: BatteryConditionModel[] = [new BatteryConditionModel(BatteryConditionsEnum.Good, BatteryStatus.Good)];
	batteryHealth = 0;
	batteryConditionStatus: string;
	airplanePowerMode = new FeatureStatus(false, false);

	private powerSupplyStatusEventRef: any;
	private remainingPercentageEventRef: any;
	private remainingTimeEventRef: any;
	private powerBatteryGaugeResetEventRef: any;
	private powerBatteryStatusEventRef: any;

	public isLoading = true;
	public acAdapterInfoParams: any;
	public param: any;
	isWinRTLoading = true;
	isUnsupportedBattery = false;
	isThinkPad = false;

	disableBatteryDetails: boolean;

	notificationSubscription: Subscription;
	bctInfoSubscription: Subscription;
	airplaneModeSubscription: Subscription;
	expressChargingSubscription: Subscription;

	activatedRouteSubscription: Subscription;

	public readonly metricsParent = CommonMetricsModel.ParentDeviceSettings;
	public readonly metricsType = CommonMetricsModel.ItemType;

	constructor(
		private modalService: NgbModal,
		public batteryService: BatteryDetailService,
		public shellServices: VantageShellService,
		private commonService: CommonService,
		private cd: ChangeDetectorRef,
		private logger: LoggerService,
		private localCacheService: LocalCacheService,
		private activatedRoute: ActivatedRoute) {
	}

	getMainBatteryInfo() {
		if (typeof Windows !== 'undefined') {
			const power = Windows.System.Power;
			return {
				percentage: power.PowerManager.remainingChargePercent,
				remainingTime: Math.trunc(power.PowerManager.remainingDischargeTime / 60000),
				status: power.PowerManager.batteryStatus
			};
		}
		return {};
	}

	getAcAttachedStatus() {
		if (typeof Windows !== 'undefined') {
			const power = Windows.System.Power;
			return power.PowerManager.powerSupplyStatus !== power.PowerSupplyStatus.notPresent;
		}
		return false;
	}

	updateMainBatteryTime() {
		const maininfo = this.getMainBatteryInfo();
		let time = 0;
		let timetype = '';
		if (maininfo.status === 1) { // BatteryStatus discharging
			// check if value is within valid min range 525600 mins in 1 year
			if (maininfo.remainingTime < 525600) {
				time = maininfo.remainingTime;
				timetype = 'timeRemaining';
			}
		}
		// battery not detected
		if (maininfo.status === 0) {
			this.batteryIndicator.batteryNotDetected = true;
			this.disableBatteryDetails = true;
			this.batteryConditions[0] = new BatteryConditionModel(BatteryConditionsEnum.NotDetected, BatteryStatus.Poor);
			maininfo.percentage = 0;
			this.batteryIndicator.percent = 0;
		}
		this.batteryIndicator.convertMin(time);
		this.batteryIndicator.timeText = timetype;

		if (maininfo.percentage !== 0) {
			this.batteryIndicator.percent = maininfo.percentage;
		}
	}

	private registerBatteryEvents() {
		// triggers when power supply i.e. Adapter connected/disconnected
		this.powerSupplyStatusEventRef = this.onPowerSupplyStatusEvent.bind(this);

		// triggers when updated percentage value is sent
		this.remainingPercentageEventRef = this.onRemainingPercentageEvent.bind(this);

		// triggers when updated time value is sent
		this.remainingTimeEventRef = this.onRemainingTimeEvent.bind(this);

		// triggers when change in gauge reset info
		this.powerBatteryGaugeResetEventRef = this.onPowerBatteryGaugeResetEvent.bind(this);

		// triggers when change in battery count, every 30s
		// this.powerBatteryStatusEventRef = this.onPowerBatteryStatusEvent.bind(this);

		this.shellServices.registerEvent(EventTypes.pwrPowerSupplyStatusEvent, this.powerSupplyStatusEventRef);
		this.shellServices.registerEvent(EventTypes.pwrRemainingPercentageEvent, this.remainingPercentageEventRef);
		this.shellServices.registerEvent(EventTypes.pwrRemainingTimeEvent, this.remainingTimeEventRef);
		this.shellServices.registerEvent(EventTypes.pwrBatteryGaugeResetEvent, this.powerBatteryGaugeResetEventRef);
		// this.shellServices.registerEvent(EventTypes.pwrBatteryStatusEvent, this.powerBatteryStatusEventRef);
	}

	private unRegisterBatteryEvents() {
		this.shellServices.unRegisterEvent(EventTypes.pwrPowerSupplyStatusEvent, this.powerSupplyStatusEventRef);
		this.shellServices.unRegisterEvent(EventTypes.pwrRemainingPercentageEvent, this.remainingPercentageEventRef);
		this.shellServices.unRegisterEvent(EventTypes.pwrRemainingTimeEvent, this.remainingTimeEventRef);
		this.shellServices.unRegisterEvent(EventTypes.pwrBatteryGaugeResetEvent, this.powerBatteryGaugeResetEventRef);
		// this.shellServices.unRegisterEvent(EventTypes.pwrBatteryStatusEvent, this.powerBatteryStatusEventRef);
	}

	ngOnInit() {
		this.isThinkPad = this.localCacheService.getLocalCacheValue(LocalStorageKey.MachineType) === 1;
		this.getBatteryDetailOnCard();

		// temp
		this.updateMainBatteryTime();
		this.batteryIndicator.charging = this.getAcAttachedStatus();
		const conditions = this.localCacheService.getLocalCacheValue(LocalStorageKey.BatteryCondition);
		if (Array.isArray(conditions) && conditions.length > 0) {
			conditions.forEach((condition: BatteryConditionModel, index) => {
				conditions[index] = new BatteryConditionModel(condition.condition, condition.conditionStatus);
			});
			this.batteryConditions = conditions;
		}

		this.isWinRTLoading = false;
		// temp
		this.registerBatteryEvents();

		// to open battery details modal from toolbar
		this.activatedRouteSubscription = this.activatedRoute.queryParamMap.subscribe((params: ParamMap) => {
			if (params.has('batterydetail')) {
				const showBatteryDetail = this.activatedRoute.snapshot.queryParams.batterydetail;
				this.getBatteryDetails(showBatteryDetail);
			}
		});

		this.notificationSubscription = this.commonService.notification.subscribe((response: AppNotification) => {
			this.onNotification(response);
		});

		this.bctInfoSubscription = this.batteryService.getChargeThresholdInfo()
			.subscribe((value: ChargeThreshold[]) => {
				if (value && value.length > 0) {
					this.batteryIndicator.isChargeThresholdOn = value[0].isCapable && value[0].isEnabled;
				} else {
					this.batteryIndicator.isChargeThresholdOn = false;
				}
		});

		this.airplaneModeSubscription = this.batteryService.getAirplaneMode()
			.subscribe((value: FeatureStatus) => {
			this.airplanePowerMode = value;
			this.batteryIndicator.isAirplaneMode = value.available && value.status;
		});

		this.expressChargingSubscription = this.batteryService.getExpressCharging()
			.subscribe((value: FeatureStatus) => {
			this.batteryIndicator.expressCharging = value.available && value.status;
		});
	}

	ngOnDestroy() {
		this.unRegisterBatteryEvents();
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
		if (this.bctInfoSubscription) {
			this.bctInfoSubscription.unsubscribe();
		}
		if (this.airplaneModeSubscription) {
			this.airplaneModeSubscription.unsubscribe();
		}
		if (this.expressChargingSubscription) {
			this.expressChargingSubscription.unsubscribe();
		}
		if (this.activatedRouteSubscription) {
			this.activatedRouteSubscription.unsubscribe();
		}
		this.batteryService.stopMonitor();
	}

	/**
	 * Called when power supply status changes
	 * @param info: Updated battery information
	 */
	onPowerSupplyStatusEvent(info: any) {
		this.setBatteryCard(info, 'onPowerSupplyStatusEvent');
	}

	/**
	 * Called when battery percentage changes
	 * @param info: Updated battery information
	 */
	onRemainingPercentageEvent(info: any) {
		this.setBatteryCard(info, 'onRemainingPercentageEvent');
	}

	/**
	 * Called battery remaining time changes
	 * @param info: Updated battery information
	 */
	onRemainingTimeEvent(info: any) {
		this.setBatteryCard(info, 'onRemainingTimeEvent');
	}

	/**
	 * Called when battery gauge  reset info is updated
	 * @param info: Updated battery information
	 */
	onPowerBatteryGaugeResetEvent(info: BatteryGaugeReset[]) {
		this.logger.info('onPowerBatteryGaugeResetEvent: Information', info);
		let isGaugeResetRunning = false;
		const gaugeResetInfo: BatteryGaugeReset[] = this.commonService.cloneObj(info);
		if (gaugeResetInfo) {
			// Set Global time format of machine
			if (typeof Windows !== 'undefined') {
				const formatter = new Windows.Globalization.DateTimeFormatting.DateTimeFormatter(' shorttime');
				this.commonService.setSystemTimeFormat(formatter.clock === '12HourClock');
			}

			gaugeResetInfo.forEach((battery) => {
				isGaugeResetRunning = isGaugeResetRunning || battery.isResetRunning;
				if (battery.FCCBefore && battery.FCCAfter) {
					if (battery.FCCBefore !== 0 && battery.FCCAfter !== 0) {
						battery.FCCAfter = parseFloat((battery.FCCAfter / 1000).toFixed(2));
						battery.FCCBefore = parseFloat((battery.FCCBefore / 1000).toFixed(2));
					}
				}
			});
			this.batteryService.gaugeResetInfo = gaugeResetInfo;
			this.batteryService.isGaugeResetRunning = isGaugeResetRunning;
			this.batteryService.setGaugeResetSectionSubject.next(true);
		}
	}

	/**
	 * Get battery details to show battery card on first time load
	 */
	public getBatteryDetailOnCard() {
		try {
			if (this.batteryService.isShellAvailable) {
				this.getBatteryDetails(false);
				// Monitor for 30s battery information update
				this.batteryService.startMonitor(this.setBatteryCard.bind(this));
			}
		} catch (error) {
			this.logger.error('getBatteryDetailOnCard: ' + error.message);
			return EMPTY;
		}
	}

	/**
	 * Gets called every 30s or on some event triggers to set ba
	 * @param response battery information
	 * @param methodName name of method it has been called from
	 */
	setBatteryCard(response, methodName = 'Battery Info') {
		if (response) {
			this.logger.info(methodName + ' : ', response);
			this.batteryInfo = response.batteryInformation;
			this.batteryGauge = response.batteryIndicatorInfo;
			this.updateBatteryDetails();
		}
	}

	/**
	 * gets battery details from js bridge
	 */
	public getBatteryDetails(showBatteryDetail) {
		this.logger.info('BatteryCardComponent: getBatteryDetails ==> Before API call');
		this.batteryService.getBatteryDetail()
			.then((response: any) => {
				this.logger.info('BatteryCardComponent: getBatteryDetails ==> After API call');
				this.isLoading = false;
				this.setBatteryCard(response, 'getBatteryDetails');

				if (showBatteryDetail) {
					window.history.replaceState([], '', '');
					this.showDetailModal(this.batteryModal);
				}
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
			switch (notification.type) {
				case ChargeThresholdInformation.ChargeThresholdInfo:
					this.batteryIndicator.isChargeThresholdOn = notification.payload;
					break;
				case 'AirplaneModeStatus':
					this.airplanePowerMode.available = notification.payload.isCapable;
					this.batteryIndicator.isAirplaneMode = notification.payload.isCapable && notification.payload.isEnabled;
					break;
				case 'ExpressChargingStatus':
					this.batteryIndicator.expressCharging = notification.payload.available && notification.payload.status;
					break;
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
		let batteryErrorCount = 0;
		if (this.batteryInfo && this.batteryInfo.length > 0) {
			this.initBatteryInformation();
			const remainingPercentages = [];
			this.batteryInfo.forEach((info) => {
				remainingPercentages.push(info.remainingPercent);
				if (info.chargeStatus === -1 || info.chargeStatus === -2) {
					batteryErrorCount = batteryErrorCount + 1;
				}
			});
			this.batteryHealth = this.batteryInfo[0].batteryHealth;
			this.batteryService.isAcAttached = this.batteryGauge.isAttached;
			this.batteryService.remainingPercentages = remainingPercentages;
			// if true, then machine supports temporary charge mode, used to show tooltip at
			// full charge capacity in Battery Details Popup
			this.batteryService.isTemporaryChargeMode = this.batteryInfo[0].isTemporaryChargeMode;
			// if True, then High Density Battery is supported, and used to show note in
			// BCT confirmation window
			this.batteryService.isDlsPiCapable = this.batteryInfo[0].isDlsPiCapable;
		} else {
			this.batteryIndicator.batteryNotDetected = false;
		}

		const powerDriverStatus = this.batteryGauge.isPowerDriverMissing;
		// boolean indicator to disable/enable battery details button
		this.disableBatteryDetails = powerDriverStatus ||
			this.batteryIndicator.batteryNotDetected || batteryErrorCount === this.batteryInfo.length;

		// Send value of isPowerDriverMissing if it's updated to Power SubPage
		if (powerDriverStatus !== this.batteryService.isPowerDriverMissing) {
			this.batteryService.isPowerDriverMissing = powerDriverStatus;
			this.commonService.sendNotification('IsPowerDriverMissing', this.batteryService.isPowerDriverMissing);
		}

		this.batteryIndicator.percent = this.batteryGauge.percentage;
		this.batteryService.gaugePercent = this.batteryGauge.percentage;

		this.batteryIndicator.charging = this.batteryGauge.isAttached;
		this.batteryIndicator.convertMin(this.batteryGauge.time);
		this.batteryIndicator.timeText = this.batteryGauge.timeType;
		this.batteryIndicator.expressCharging = this.batteryGauge.isExpressCharging;
		// Airplane Power Mode status update through batteryService
		if (this.airplanePowerMode.status !== this.batteryGauge.isAirplaneModeEnabled) {
			this.airplanePowerMode.status = this.batteryGauge.isAirplaneModeEnabled;
			this.batteryService.airplaneModeSubject.next(this.airplanePowerMode);
		}

		this.getBatteryCondition();
	}



	/**
	 * sets a battery condition tip & icon from battery health & battery condition
	 */
	public getBatteryCondition() {
		let healthCondition: number;
		const batteryConditions = [];

		if (this.batteryGauge.isPowerDriverMissing) {
			batteryConditions.push(new BatteryConditionModel(BatteryConditionsEnum.MissingDriver, BatteryStatus.Poor));
		}

		if (this.batteryInfo && this.batteryInfo.length > 0) {

			healthCondition = this.batteryHealth;
			this.batteryConditionStatus = this.getConditionState(this.batteryHealth);

			if (this.isThinkPad) {
				// Store limitation tip for fair & bad condition
				if (this.batteryHealth === 1 || this.batteryHealth === 2) {
					healthCondition = BatteryConditionsEnum.StoreLimitation;
					const percentLimit = (this.batteryInfo[0].fullChargeCapacity / this.batteryInfo[0].designCapacity) * 100;
					this.param = { value: parseFloat(percentLimit.toFixed(1)) };
				}

				// Start Battery not detected or Primary Battery not detected logic
				if (this.batteryHealth === 4) {
					if (this.batteryInfo.length > 1) {
						// In case of dual battery
						if (this.batteryInfo[1].batteryHealth === 4) {
							this.batteryIndicator.batteryNotDetected = true;
							healthCondition = 4;
						} else {
							this.batteryIndicator.batteryNotDetected = false;
							healthCondition = BatteryConditionsEnum.PrimaryNotDetected;
						}
					} else {
						this.batteryIndicator.batteryNotDetected = true;
					}
				} else {
					this.batteryIndicator.batteryNotDetected = false;
				}
				// End Battery not detected or Primary Battery not detected logic
			}

			// Used so that UnsupportedBattery tip will not show more than once
			this.isUnsupportedBattery = false;

			// batteryCondition will always have  batteryCondition = ['normal'] for now, and will only use first case with different value for healthCondition(ie. batteryHealth)
			this.batteryInfo[0].batteryCondition.forEach((condition) => {
				switch (condition.toLocaleLowerCase()) {
					case 'normal':
						batteryConditions.push(new BatteryConditionModel(healthCondition,
							BatteryStatus[this.batteryConditionStatus]));
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
					case 'unsupportedbattery':
						if (!this.isUnsupportedBattery) {
							batteryConditions.push(new BatteryConditionModel(BatteryConditionsEnum.UnsupportedBattery, BatteryStatus.Fair));
							this.isUnsupportedBattery = true;
						}
						break;
				}
			});
		}
		// if isInvalidBattery is true, battery charge threshold is disabled.
		this.batteryService.isInvalidBattery = this.isUnsupportedBattery || this.batteryHealth === 3;

		// Added after batteryCondition code so that tip related to adapter will always be shown at end
		if (!(this.batteryIndicator.batteryNotDetected || this.batteryService.isPowerDriverMissing)) {

			// AcAdapter conditions hidden for IdeaPad & IdeaCenter machines
			if (this.isThinkPad && this.batteryGauge.acAdapterStatus) {
				switch (this.batteryGauge.acAdapterStatus.toLocaleLowerCase()) {
					case 'supported':
						if (this.batteryGauge.isAttached) {
							batteryConditions.push(new BatteryConditionModel(BatteryConditionsEnum.FullACAdapterSupport, BatteryStatus.AcAdapterStatus));
						}
						break;
					case 'limited':
						batteryConditions.push(new BatteryConditionModel(BatteryConditionsEnum.LimitedACAdapterSupport, BatteryStatus.AcAdapterStatus));
						break;
					case 'notsupported':
						batteryConditions.push(new BatteryConditionModel(BatteryConditionsEnum.NotSupportACAdapter, BatteryStatus.AcAdapterStatus));
						break;
				}
			}
			// End adapter conditions code
		}

		this.batteryConditions = batteryConditions;
		this.logger.info('Battery Conditions ====>', this.batteryConditions);

		// Updated battery information is sent to BatteryDetailsComponent
		this.commonService.sendNotification(BatteryInformation.BatteryInfo, { detail: this.batteryInfo, indicator: this.batteryIndicator, conditions: this.batteryConditions });

		// Below code is used to manually trigger the changes in child component (BatteryIndicatorComponent)
		if (this.cd !== null && this.cd !== undefined &&
			!(this.cd as ViewRef).destroyed) {
			this.cd.detectChanges();
		}
		// End code

		// temp cache battery condition
		this.localCacheService.setLocalCacheValue(LocalStorageKey.BatteryCondition, this.batteryConditions);
	}

	/**
	 * shows a battery details modal
	 * @param content: battery Information
	 */
	public showDetailModal(content: any): void {
		this.batteryService.currentOpenModal = 'battery-details';
		if (!this.batteryService.isBatteryModalShown) {
			this.batteryService.isBatteryModalShown = true;
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
						this.batteryService.isBatteryModalShown = false;
					}
				);
		}
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
	}

}
