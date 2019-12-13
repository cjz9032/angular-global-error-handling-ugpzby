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
import { Subscription, EMPTY } from 'rxjs';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { BatteryGaugeReset } from 'src/app/data-models/device/battery-gauge-reset.model';

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
	batteryConditionsEnum = BatteryConditionsEnum;
	batteryConditionNotes: string[];
	batteryStatus = BatteryStatus;
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
	public acAdapterInfoParams: any;
	public param: any;
	remainingPercentages: number[];
	notificationSubscription: Subscription;
	shortAcErrNote = true;
	isModalShown = false;
	isWinRTLoading = true;

	constructor(
		private modalService: NgbModal,
		public batteryService: BatteryDetailService,
		public shellServices: VantageShellService,
		private commonService: CommonService,
		private cd: ChangeDetectorRef,
		private logger: LoggerService,
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

	ngOnInit() {
		// temp
		this.updateMainBatteryTime();
		this.batteryIndicator.charging = this.getAcAttachedStatus();
		this.isLoading = false;
		try {
			const conditions = JSON.parse(window.localStorage.getItem('batteryCondition'));
			if (Array.isArray(conditions) && conditions.length > 0) {
				conditions.forEach((condition: BatteryConditionModel, index) => {
					conditions[index] = new BatteryConditionModel(condition.condition, condition.conditionStatus);
				});
				this.batteryConditions = conditions;
			}
		} catch (e) {
			console.log(e);
		}
		this.setConditionTips();
		this.isWinRTLoading = false;

		// temp
		this.activatedRoute.queryParamMap.subscribe((params: ParamMap) => {
			// this.logger.info('BatteryCardComponent.ngOnInit: Query Params', params);
			if (params.has('batterydetail') && !this.isModalShown) {
				const showBatteryDetail = this.activatedRoute.snapshot.queryParams.batterydetail;
				this.getBatteryDetails(showBatteryDetail);
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

		this.getBatteryDetailOnCard();

		this.notificationSubscription = this.commonService.notification.subscribe((response: AppNotification) => {
			this.onNotification(response);
		});
	}

	onPowerSupplyStatusEvent(info: any) {
		this.setBatteryCard(info, 'onPowerSupplyStatusEvent');
	}

	onRemainingPercentageEvent(info: any) {
		this.setBatteryCard(info, 'onRemainingPercentageEvent');
	}

	onRemainingTimeEvent(info: any) {
		this.setBatteryCard(info, 'onRemainingTimeEvent');
	}

	onPowerBatteryGaugeResetEvent(gaugeResetInfo: BatteryGaugeReset[]) {
		this.logger.info('onPowerBatteryGaugeResetEvent: Information', gaugeResetInfo);
		this.batteryService.gaugeResetInfo = gaugeResetInfo;
		this.batteryService.isGaugeResetRunning = gaugeResetInfo && (gaugeResetInfo.length > 0 && gaugeResetInfo[0].isResetRunning) || (gaugeResetInfo.length > 1 && gaugeResetInfo[1].isResetRunning);
	}

	public getBatteryDetailOnCard() {
		try {
			if (this.batteryService.isShellAvailable) {
				this.getBatteryDetails(false);
				this.batteryService.startMonitor(this.setBatteryCard.bind(this));
			}
		} catch (error) {
			this.logger.error('getBatteryDetailOnCard: ' + error.message);
			return EMPTY;
		}
	}

	setBatteryCard(response, methodName = 'Battery Info') {
		if (response) {
			this.logger.info(methodName + ' : ', response);
			console.log(methodName + ' : ', response);
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
			if (notification.type === ChargeThresholdInformation.ChargeThresholdInfo) {
				this.batteryIndicator.isChargeThresholdOn = notification.payload;
			}
			if (notification.type === 'AirplaneModeStatus') {
				this.batteryIndicator.isAirplaneMode = notification.payload;
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
			this.batteryHealth = this.batteryInfo[0].batteryHealth;
			// this.batteryIndicator.batteryNotDetected = this.batteryHealth === 4;
			this.batteryService.isAcAttached = this.batteryGauge.isAttached;
			this.batteryService.remainingPercentages = this.remainingPercentages;
		} else {
			this.batteryIndicator.batteryNotDetected = false;
		}

		this.batteryService.isEmDriverInstalled = this.batteryGauge.isEmDriverInstalled;
		this.batteryService.isPowerDriverMissing = this.batteryGauge.isPowerDriverMissing;
		this.commonService.sendNotification('IsPowerDriverMissing', this.batteryService.isPowerDriverMissing);
		this.commonService.sendNotification('IsEmDriverInstalled', this.batteryService.isEmDriverInstalled);

		this.batteryIndicator.percent = this.batteryGauge.percentage;
		this.batteryIndicator.charging = this.batteryGauge.isAttached;
		this.batteryIndicator.convertMin(this.batteryGauge.time);
		this.batteryIndicator.timeText = this.batteryGauge.timeType;
		this.batteryIndicator.expressCharging = this.batteryGauge.isExpressCharging;

		if (this.batteryGauge.isAttached && this.batteryGauge.acWattage && this.batteryGauge.acAdapterType) {
			const adapterType = this.batteryGauge.acAdapterType.toLocaleLowerCase() === 'legacy' ? 'ac' : 'USB-C';
			this.acAdapterInfoParams = { acWattage: this.batteryGauge.acWattage, acAdapterType: adapterType };
		}

		this.getBatteryCondition();
	}

	/**
	 * shows a battery details modal
	 * @param content: battery Information
	 */
	public showDetailModal(content: any): void {
		this.isModalShown = true;
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
					this.isModalShown = false;
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

		if (this.batteryService.isPowerDriverMissing) {
			batteryConditions.push(new BatteryConditionModel(BatteryConditionsEnum.MissingDriver, BatteryStatus.Poor));
		}

		if (!this.batteryService.isEmDriverInstalled) {
			batteryConditions.push(new BatteryConditionModel(BatteryConditionsEnum.EmDriverInstalled, BatteryStatus.Poor));
		}
		if (this.batteryInfo && this.batteryInfo.length > 0) {

			healthCondition = this.batteryHealth;
			this.batteryConditionStatus = this.getConditionState(this.batteryHealth);

			if (isThinkPad) {
				if (this.batteryHealth === 1 || this.batteryHealth === 2) {
					healthCondition = BatteryConditionsEnum.StoreLimitation;
					const percentLimit = (this.batteryInfo[0].fullChargeCapacity / this.batteryInfo[0].designCapacity) * 100;
					this.param = { value: parseFloat(percentLimit.toFixed(1)) };
				}
			}
			if (this.batteryHealth === 4) {
				if (this.batteryInfo.length > 1 && isThinkPad) {
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

		if (!(this.batteryIndicator.batteryNotDetected || this.batteryService.isPowerDriverMissing)) {

			// AcAdapter conditions hidden for IdeaPad & IdeaCenter machines
			if (isThinkPad && this.batteryGauge.acAdapterStatus) {
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
		}

		this.batteryConditions = batteryConditions;
		this.logger.info('Battery Conditions ====>', this.batteryConditions);
		console.log('Battery Health: ', this.batteryHealth, 'Battery Conditions: ', JSON.stringify(this.batteryConditions));
		this.commonService.sendNotification(BatteryInformation.BatteryInfo, { detail: this.batteryInfo, indicator: this.batteryIndicator, conditions: this.batteryConditions });

		this.setConditionTips();

		if (this.cd !== null && this.cd !== undefined &&
			!(this.cd as ViewRef).destroyed) {
			this.cd.detectChanges();
		}

		// temp cache battery condition
		window.localStorage.setItem('batteryCondition', JSON.stringify(this.batteryConditions));
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
	}

	ngOnDestroy() {
		if (this.batteryService.isShellAvailable) {
			this.logger.info('STOP MONITOR');
			this.batteryService.stopMonitor();
		}
		this.shellServices.unRegisterEvent(EventTypes.pwrPowerSupplyStatusEvent, this.powerSupplyStatusEventRef);
		this.shellServices.unRegisterEvent(EventTypes.pwrRemainingPercentageEvent, this.remainingPercentageEventRef);
		this.shellServices.unRegisterEvent(EventTypes.pwrRemainingTimeEvent, this.remainingTimeEventRef);
		this.shellServices.unRegisterEvent(EventTypes.pwrBatteryGaugeResetEvent, this.powerBatteryGaugeResetEventRef);

		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
	}
	/*
		@HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
			this.closeModal();
		} */

}
