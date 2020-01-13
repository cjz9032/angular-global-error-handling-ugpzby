import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PowerService } from 'src/app/services/power/power.service';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { EventTypes } from '@lenovo/tan-client-bridge';
import { ChargeThresholdInformation } from 'src/app/enums/battery-information.enum';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { Subscription } from 'rxjs/internal/Subscription';
import { BehaviorSubject, EMPTY, pipe, zip, range, timer, from, combineLatest, of } from 'rxjs';
import { FlipToBootSetStatus } from '../../../../../services/power/flipToBoot.interface';
import {
	FlipToBootCurrentModeEnum,
	FlipToBootErrorCodeEnum,
	FlipToBootSetStatusEnum,
	FlipToBootSupportedEnum
} from '../../../../../services/power/flipToBoot.enum';
import { MetricService } from '../../../../../services/metric/metric.service';
import { AlwaysOnUSBCapability } from 'src/app/data-models/device/always-on-usb.model';
import { BatteryChargeThresholdCapability } from 'src/app/data-models/device/battery-charge-threshold-capability.model';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { RouteHandlerService } from 'src/app/services/route-handler/route-handler.service';
import { BatteryDetailService } from 'src/app/services/battery-detail/battery-detail.service';
import { retryWhen, map, mergeMap, tap, finalize, takeWhile, switchMap, debounce } from 'rxjs/operators';
import { ChargeThreshold } from 'src/app/data-models/device/charge-threshold.model';

enum PowerMode {
	Sleep = 'ChargeFromSleep',
	Shutdown = 'ChargeFromShutdown',
	Disabled = 'Disabled'
}

@Component({
	selector: 'vtr-subpage-device-settings-power',
	templateUrl: './subpage-device-settings-power.component.html',
	styleUrls: ['./subpage-device-settings-power.component.scss']
})
export class SubpageDeviceSettingsPowerComponent implements OnInit, OnDestroy {

	@Input() isCollapsed = true;
	@Input() allowCollapse = true;
	@Input() theme = 'white';

	@Output() toggle = new EventEmitter();

	public machineType: any;
	public isDesktopMachine = true;

	public vantageToolbarStatus = new FeatureStatus(false, true);
	vantageToolbarCache: FeatureStatus;

	public alwaysOnUSBStatus = new FeatureStatus(false, true);
	public usbChargingStatus = new FeatureStatus(false, true);
	public easyResumeStatus = new FeatureStatus(false, true);
	public conservationModeStatus = new FeatureStatus(false, true);
	public expressChargingStatus = new FeatureStatus(false, true);
	public conservationModeLock = false;
	public expressChargingLock = false;

	// Energy Star
	public isEnergyStarProduct = false;
	public energyStarCache: boolean;

	chargeOptions: number[] = [40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
	startAtChargeOptions: number[] = this.chargeOptions.slice(0, this.chargeOptions.length - 1);
	stopAtChargeOptions: number[] = this.chargeOptions.slice(1, this.chargeOptions.length);

	private batteryCountStatusEventRef: any;
	// public responseData: any[] = [];
	public thresholdInfo: ChargeThreshold[];
	public isChargeThresholdAvailable = false;
	public isPrimaryBatteryAvailable = false;
	public isSecondBatteryAvailable = false;
	showBatteryThreshold = false;
	primaryCheckBox = false;
	secondaryCheckBox = false;
	selectedStopAtChargeVal;
	selectedStartAtChargeVal;
	selectedStopAtChargeVal1;
	selectedStartAtChargeVal1;
	public showWarningMsg: boolean;

	notificationSubscription: Subscription;
	toolBarSubscription: Subscription;

	toggleAlwaysOnUsbFlag = false;
	usbChargingCheckboxFlag = false;
	powerMode = PowerMode.Sleep;
	showEasyResumeSection = false;
	toggleEasyResumeStatus = false;

	showAirplanePowerModeSection = false;
	toggleAirplanePowerModeFlag = false;
	airplaneAutoDetection = false;

	usbChargingInBatteryModeStatus = true;
	value = 1;
	alwaysOnUSBCache: AlwaysOnUSBCapability = undefined;
	airplanePowerCache: AlwaysOnUSBCapability = undefined;
	easyResumeCache: FeatureStatus;
	batteryChargeThresholdCache: BatteryChargeThresholdCapability = undefined;
	expressChargingCache: FeatureStatus = undefined;
	conservationModeCache: FeatureStatus = undefined;
	smartStandbyCapability: boolean;
	showPowerSmartSettings = true;
	gaugeResetCapability = false;
	isToolBarSetSuccessed = false;
	isVantageToolbarSetEnd = true;

	isPowerDriverMissing = false;

	toggleFlipToBootStatus = true;
	showFlipToBootSection$: BehaviorSubject<boolean> = new BehaviorSubject(false);

	isBatterySectionAvailable = false;
	isPowerSectionAvailable = false;
	isPowerPageAvailable = false;
	gotoLinks = ['smartSettings', 'smartStandby', 'battery', 'power', 'other'];

	// remove power smart settings after intelligent cooling code updates
	headerMenuItems = [
		{
			title: 'device.deviceSettings.power.powerSmartSettings.title',
			path: 'smartSettings',
			metricsItem: 'PowerSmartSettings',
			order: 1
		}
	];

	constructor(
		private routeHandler: RouteHandlerService, // logic is added in constructor, no need to call any method
		public powerService: PowerService,
		public batteryService: BatteryDetailService,
		private commonService: CommonService,
		private logger: LoggerService,
		public modalService: NgbModal,
		public shellServices: VantageShellService,
		private metrics: MetricService,
	) {
	}

	ngOnInit() {
		this.initDataFromCache();
		this.isDesktopMachine = this.commonService.getLocalStorageValue(LocalStorageKey.DesktopMachine);
		if (this.isDesktopMachine) {
			// TODO: remove onSetSmartSettingsCapability when intelligent cooling fixed
			this.onSetSmartSettingsCapability(false);
			// this.checkIsPowerPageAvailable(false, 'smartSettings');
			this.checkIsPowerPageAvailable(false, 'smartStandby');
			this.checkIsPowerPageAvailable(false, 'battery');
		}
		this.machineType = this.commonService.getLocalStorageValue(LocalStorageKey.MachineType);
		this.getBatteryAndPowerSettings();
		this.getVantageToolBarStatus();
		this.getEnergyStarCapability();

		this.startMonitor();

		this.shellServices.registerEvent(EventTypes.pwrBatteryStatusEvent, this.batteryCountStatusEventRef);

		console.log('=============Power Subpage ngOnit ===================');
		this.notificationSubscription = this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});
	}

	ngOnDestroy() {
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
		this.stopMonitor();
		this.shellServices.unRegisterEvent(EventTypes.pwrBatteryStatusEvent, this.batteryCountStatusEventRef);
		if (this.toolBarSubscription) {
			this.toolBarSubscription.unsubscribe();
		}
	}

	// ************************** Start Getting Cached Data ****************************
	initDataFromCache() {
		// this.initBatteryLinkFromCache();
		// this.initSmartStandbyLinkFromCache();
		// this.initPowerSmartSettingFromCache();
		this.initAirplanePowerFromCache();
		this.initBatteryChargeThresholdFromCache();
		this.initGaugeResetInfoFromCache();
		this.initExpressChargingFromCache();
		this.initConservationModeFromCache();
		this.initPowerSettingsFromCache();
		this.initOtherSettingsFromCache();
		this.initEnergyStarFromCache();

	}

	// public initPowerSmartSettingFromCache() {
	// 	try {
	// 		const cache = this.commonService.getLocalStorageValue(LocalStorageKey.IntelligentCoolingCapability, undefined);
	// 		if (cache) {
	// 			const showIC = cache.showIC;
	// 			if (showIC === 0) {
	// 				this.hidePowerSmartSetting(true);
	// 			}
	// 		}
	// 	} catch (error) {
	// 		console.log('initPowerSmartSettingFromCache', error);
	// 	}
	// }

	// initBatteryLinkFromCache() {
	// 	const status = this.commonService.getLocalStorageValue(LocalStorageKey.IsBatteryQuickSettingAvailable, true);
	// }

	// initSmartStandbyLinkFromCache() {
	// 	const capability = this.commonService.getLocalStorageValue(LocalStorageKey.SmartStandbyCapability, undefined);
	// 	if (capability !== undefined) {
	// 		this.onSetSmartStandbyCapability(capability.isCapable);
	// 	} else {
	// 		this.onSetSmartStandbyCapability(false);
	// 	}
	// }

	initAirplanePowerFromCache() {
		try {
			this.airplanePowerCache = this.commonService.getLocalStorageValue(LocalStorageKey.AirplanePowerModeCapability, undefined);
			if (this.airplanePowerCache !== undefined) {
				this.showAirplanePowerModeSection = this.airplanePowerCache.toggleState.available;
				this.toggleAirplanePowerModeFlag = this.airplanePowerCache.toggleState.status;
				this.airplaneAutoDetection = this.airplanePowerCache.checkbox.status;
			} else {
				this.airplanePowerCache = new AlwaysOnUSBCapability();
			}
		} catch (error) {
			console.log('initAirplanePowerFromCache', error);
		}
	}

	initBatteryChargeThresholdFromCache() {
		try {
			this.batteryChargeThresholdCache = this.commonService.getLocalStorageValue(LocalStorageKey.BatteryChargeThresholdCapability, undefined);
			if (this.batteryChargeThresholdCache) {
				this.isChargeThresholdAvailable = this.batteryChargeThresholdCache.available;
				this.showBatteryThreshold = this.batteryChargeThresholdCache.toggleStatus;

				this.selectedStartAtChargeVal = this.batteryChargeThresholdCache.startAt1;
				this.selectedStopAtChargeVal = this.batteryChargeThresholdCache.stopAt1;
				this.primaryCheckBox = this.batteryChargeThresholdCache.checkBox1;

				if (this.isSecondBatteryAvailable) {
					this.selectedStartAtChargeVal1 = this.batteryChargeThresholdCache.startAt2;
					this.selectedStopAtChargeVal1 = this.batteryChargeThresholdCache.stopAt2;
					this.secondaryCheckBox = this.batteryChargeThresholdCache.checkBox2;
				}
				this.showWarningMsg = this.batteryChargeThresholdCache.showWarningMsg;

			} else {
				this.batteryChargeThresholdCache = new BatteryChargeThresholdCapability();
			}
		} catch (error) {
			console.log('initBatteryChargeThresholdFromCache', error);
		}
	}

	initGaugeResetInfoFromCache() {
		try {
			this.gaugeResetCapability = this.commonService.getLocalStorageValue(LocalStorageKey.GaugeResetCapability, undefined);
		} catch (error) {
			console.log('initAirplanePowerFromCache', error);
		}
	}

	initExpressChargingFromCache() {
		try {
			this.expressChargingCache = this.commonService.getLocalStorageValue(LocalStorageKey.ExpressChargingCapability, undefined);
			if (this.expressChargingCache !== undefined) {
				this.expressChargingStatus.available = this.expressChargingCache.available;
				this.expressChargingStatus.status = this.expressChargingCache.status;
				this.expressChargingLock = this.expressChargingCache.isLoading;
			} else {
				this.expressChargingCache = new FeatureStatus(false, true, true, false);
			}
		} catch (error) {
			console.log('initExpressChargingFromCache', error);
		}
	}

	initConservationModeFromCache() {
		try {
			this.conservationModeCache = this.commonService.getLocalStorageValue(LocalStorageKey.ConservationModeCapability, undefined);
			if (this.conservationModeCache !== undefined) {
				this.conservationModeStatus.available = this.conservationModeCache.available;
				this.conservationModeStatus.status = this.conservationModeCache.status;
				this.conservationModeLock = this.conservationModeCache.isLoading;
			} else {
				this.conservationModeCache = new FeatureStatus(false, true, true, false);
			}
		} catch (error) {
			console.log('initConservationModeFromCache', error);
		}
	}

	initPowerSettingsFromCache() {
		try {
			this.alwaysOnUSBCache = this.commonService.getLocalStorageValue(LocalStorageKey.AlwaysOnUSBCapability, undefined);
			if (this.alwaysOnUSBCache) {
				this.toggleAlwaysOnUsbFlag = this.alwaysOnUSBCache.toggleState.status;
				this.usbChargingInBatteryModeStatus = this.alwaysOnUSBCache.checkbox.available;
				this.usbChargingCheckboxFlag = this.alwaysOnUSBCache.checkbox.status;
			} else {
				this.alwaysOnUSBCache = new AlwaysOnUSBCapability();
			}

			this.easyResumeCache = this.commonService.getLocalStorageValue(LocalStorageKey.EasyResumeCapability, undefined);
			if (this.easyResumeCache) {
				this.showEasyResumeSection = this.easyResumeCache.available;
				this.toggleEasyResumeStatus = this.easyResumeCache.status;
			} else {
				this.easyResumeCache = new FeatureStatus(false, false);
			}
		} catch (error) {
			console.log('initPowerSettingsFromCache', error);
		}
	}

	initOtherSettingsFromCache() {
		try {
			this.vantageToolbarCache = this.commonService.getLocalStorageValue(LocalStorageKey.VantageToolbarCapability, undefined);
			if (this.vantageToolbarCache) {
				this.vantageToolbarStatus.available = this.vantageToolbarCache.available;
				this.vantageToolbarStatus.status = this.vantageToolbarCache.status;
			} else {
				this.vantageToolbarCache = new FeatureStatus(false, true);
			}
		} catch (error) {
			console.log('initOtherSettingsFromCache', error);
		}
	}

	initEnergyStarFromCache() {
		try {
			this.energyStarCache = this.commonService.getLocalStorageValue(LocalStorageKey.EnergyStarCapability, undefined);
			if (this.energyStarCache !== undefined) {
				this.isEnergyStarProduct = this.energyStarCache;
			} else {
				this.energyStarCache = false;
			}
		} catch (error) {
			console.log('initEnergyStarFromCache', error);
		}
	}
	// ************************** End Getting Cached Data ****************************

	// TODO: remove unused method
	// openContextModal(template: TemplateRef<any>) {
	// 	this.modalService.open(template, {
	// 		windowClass: 'read-more'
	// 	});
	// }

	// closeContextModal() {
	// 	this.modalService.dismissAll();
	// }

	// ************ Start power page Capability Checks *******************
	onSetSmartSettingsCapability(event: boolean) {
		this.showPowerSmartSettings = event;
		this.updateSmartSettingsLinkStatus(this.showPowerSmartSettings);
	}

	onSetSmartStandbyCapability(event: boolean) {
		this.smartStandbyCapability = event;
		this.updateSmartStandbyLinkStatus(this.smartStandbyCapability);
	}

	getBatteryAndPowerSettings() {
		console.log('inside getAndSetAlwaysOnUSBForBrands', this.machineType);

		this.isBatterySectionAvailable = false;
		this.isPowerSectionAvailable = false;

		this.getFlipToBootCapability();
		switch (this.machineType) {
			case 1:
				this.batteryCountStatusEventRef = this.getBatteryStatusEvent.bind(this);
				this.getAirplaneModeCapabilityThinkPad();
				this.getAirplaneModeAutoDetectionOnThinkPad();
				this.getBatteryThresholdInformation();
				this.getGaugeResetCapability();
				this.getAlwaysOnUSBCapabilityThinkPad();
				this.getEasyResumeCapabilityThinkPad();
				break;
			case 0:
				this.getConservationModeStatusIdeaPad();
				this.getRapidChargeModeStatusIdeaPad();
				this.getAlwaysOnUSBStatusIdeaPad();
				this.getUSBChargingInBatteryModeStatusIdeaNoteBook();
				break;
		}
	}

	getVantageToolBarStatus() {
		if (this.powerService.isShellAvailable) {
			this.powerService.getVantageToolBarStatus().then((featureStatus) => {
				this.logger.info('getVantageToolBarStatus.then', featureStatus);
				this.vantageToolbarStatus = featureStatus;
				this.updateOtherSettingsStatus(this.vantageToolbarStatus.available);
			}).catch ((error) => {
				this.logger.error('getVantageToolBarStatus', error.message);
				return EMPTY;
			});
		}
	}

	public getEnergyStarCapability() {
		this.powerService.getEnergyStarCapability()
			.then((response: boolean) => {
				console.log('getEnergyStarCapability.then', response);
				this.isEnergyStarProduct = response;
				this.commonService.setLocalStorageValue(LocalStorageKey.EnergyStarCapability, this.isEnergyStarProduct);
			}).catch(error => {
				console.log('getEnergyStarCapability.error', error.message);
			});
	}
	// ************ End power page Capability Checks *******************


	// ******************** Start Goto Links of diff sections Updates *******************

	// TODO: Update this after changing logic for intelligent cooling part
	updateSmartSettingsLinkStatus(addLink: boolean) {
		this.checkIsPowerPageAvailable(addLink, 'smartSettings');
		this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, 'smartSettings');
	}

	updateSmartStandbyLinkStatus(addLink: boolean) {
		this.checkIsPowerPageAvailable(addLink, 'smartStandby');
		if (addLink) {
			const smartStandByObj = {
				title: 'device.deviceSettings.power.smartStandby.title',
				path: 'smartStandby',
				metricsItem: 'SmartStandby',
				order: 2
			};
			this.commonService.addToObjectsList(this.headerMenuItems, smartStandByObj);
		} else {
			this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, 'smartStandby');
		}
	}

	updateBatteryLinkStatus(addLink: boolean) {
		this.isBatterySectionAvailable = this.isBatterySectionAvailable || addLink;
		this.checkIsPowerPageAvailable(this.isBatterySectionAvailable, 'battery');
		if (this.isBatterySectionAvailable) {
			const batteryObj = {
				title: 'device.deviceSettings.power.batterySettings.title',
				path: 'battery',
				metricsItem: 'BatterySettings',
				order: 3
			};
			this.headerMenuItems = this.commonService.addToObjectsList(this.headerMenuItems, batteryObj);
		} else {
			this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, 'battery');
		}
	}

	updatePowerLinkStatus(addLink: boolean) {
		this.isPowerSectionAvailable = this.isPowerSectionAvailable || addLink;
		this.checkIsPowerPageAvailable(this.isPowerSectionAvailable, 'power');
		if (this.isPowerSectionAvailable) {
			const powerObj = {
				title: 'device.deviceSettings.power.powerSettings.title',
				path: 'power',
				metricsItem: 'PowerSettings',
				order: 4
			};
			this.headerMenuItems = this.commonService.addToObjectsList(this.headerMenuItems, powerObj);
		} else {
			this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, 'power');
		}
	}

	updateOtherSettingsStatus(addLink: boolean) {
		this.checkIsPowerPageAvailable(addLink, 'other');
		if (addLink) {
			const other = {
				title: 'device.deviceSettings.power.otherSettings.title',
				path: 'other',
				metricsItem: 'OtherSettings',
				order: 5
			};
			this.headerMenuItems = this.commonService.addToObjectsList(this.headerMenuItems, other);
		} else {
			this.commonService.removeObjFrom(this.headerMenuItems, 'other');
		}
	}

	checkIsPowerPageAvailable(value: boolean, id: string) {
		// this.isPowerPageAvailable = this.isPowerPageAvailable || value;
		const index: number = this.gotoLinks.indexOf(id);
		if (value) {
			if (index === -1) {
				this.gotoLinks.push(id);
			}
		} else {
			if (index !== -1) {
				this.gotoLinks =  this.gotoLinks.filter((link) => {
					return link !== id;
				});
			}
		}
		if (this.gotoLinks.length === 0 ) {
			this.commonService.setLocalStorageValue(LocalStorageKey.IsPowerPageAvailable, false);
		} else {
			this.commonService.setLocalStorageValue(LocalStorageKey.IsPowerPageAvailable, true);
		}
	}
	// ******************** End Goto Links of diff sections Updates *******************


	onUsbChargingStatusChange() {
		console.log('usb charge state entered');
		this.updatePowerMode();
	}

	onToggleOfAlwaysOnUsb(event) {
		this.toggleAlwaysOnUsbFlag = event.switchValue;
		switch (this.machineType) {
			case 1:
				if (this.toggleAlwaysOnUsbFlag && this.usbChargingCheckboxFlag) {
					this.powerMode = PowerMode.Shutdown;
				} else if (this.toggleAlwaysOnUsbFlag && !this.usbChargingCheckboxFlag) {
					this.powerMode = PowerMode.Sleep;
				} else {
					this.powerMode = PowerMode.Disabled;
				}
				this.setAlwaysOnUSBStatusThinkPad(this.powerMode, this.usbChargingCheckboxFlag);
				console.log('always on usb: thinkpad');
				break;
			case 0:
				this.setAlwaysOnUSBStatusIdeaPad(event);
				console.log('always on usb: ideapad');
				break;
		}
		this.alwaysOnUSBCache.toggleState.status = this.toggleAlwaysOnUsbFlag;
		this.commonService.setLocalStorageValue(LocalStorageKey.AlwaysOnUSBCapability, this.alwaysOnUSBCache);
		setTimeout(() => {
			this.updatePowerMode();
		}, 100);
	}

	onToggleOfEasyResume(event) {
		switch (this.machineType) {
			case 1:
				this.setEasyResumeThinkPad(event);
				console.log('Easy Resume: ThinkPad');
				break;
			case 0:
				console.log('easy resume: ideapad');
				break;
		}
	}

	onToggleOfAirplanePowerMode(event) {
		switch (this.machineType) {
			case 1:
				this.setAirplaneModeThinkPad(event);
				console.log('Airplane Power mOde Set: ThinkPad', event);
				break;
			case 0:
				console.log('Airplane Power mOde Set: ideapad');
				break;
		}
	}

	updatePowerMode() {
		if (this.toggleAlwaysOnUsbFlag && this.usbChargingCheckboxFlag) {
			this.powerMode = PowerMode.Shutdown;
		} else if (this.toggleAlwaysOnUsbFlag && !this.usbChargingCheckboxFlag) {
			this.powerMode = PowerMode.Sleep;
		} else {
			this.powerMode = PowerMode.Disabled;
		}

		switch (this.machineType) {
			case 1:
				console.log('always on usb: thinkpad');
				this.setAlwaysOnUSBStatusThinkPad(this.powerMode, this.usbChargingCheckboxFlag);
				break;
			case 0:
				this.setUSBChargingInBatteryModeStatusIdeaNoteBook(this.usbChargingCheckboxFlag);
				console.log('always on usb: ideapad');
				break;
		}
	}

	// Start ThinkPad
	private getAlwaysOnUSBCapabilityThinkPad() {
		console.log('getAlwaysOnUSBCapabilityThinkPad ');
		if (this.powerService.isShellAvailable) {
			this.powerService.getAlwaysOnUSBCapabilityThinkPad().then((value) => {
				console.log('getAlwaysOnUSBCapabilityThinkPad.then', value);
				this.alwaysOnUSBStatus.available = value;
				this.updatePowerLinkStatus(value);
				if (value) {
					this.getAlwaysOnUSBStatusThinkPad();
				}
			}).catch ((error) => {
				this.logger.error('getAlwaysOnUSBCapabilityThinkPad', error.message);
				this.alwaysOnUSBStatus.available = false;
				return EMPTY;
			});
		}
	}

	private getAlwaysOnUSBStatusThinkPad() {
		try {
			if (this.powerService.isShellAvailable) {
				this.powerService
					.getAlwaysOnUSBStatusThinkPad()
					.then((alwaysOnUsbThinkPad: any) => {
						console.log('getAlwaysOnUSBStatusThinkPad.then', alwaysOnUsbThinkPad);
						this.alwaysOnUSBStatus.status = alwaysOnUsbThinkPad.isEnabled;
						this.usbChargingCheckboxFlag = alwaysOnUsbThinkPad.isChargeFromShutdown;
						this.toggleAlwaysOnUsbFlag = alwaysOnUsbThinkPad.isEnabled;
						this.alwaysOnUSBCache.checkbox.status = this.usbChargingCheckboxFlag;
						this.alwaysOnUSBCache.toggleState.status = this.toggleAlwaysOnUsbFlag;
						this.commonService.setLocalStorageValue(LocalStorageKey.AlwaysOnUSBCapability, this.alwaysOnUSBCache);

					})
					.catch(error => {
						this.logger.error('getAlwaysOnUSBStatusThinkPad', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('getAlwaysOnUSBStatusThinkPad', error.message);
			return EMPTY;
		}
	}
	private getEasyResumeCapabilityThinkPad() {
		if (this.powerService.isShellAvailable) {
			this.powerService.getEasyResumeCapabilityThinkPad().then((value) => {
				console.log('getEasyResumeCapabilityThinkPad.then', value);
				this.updatePowerLinkStatus(value);
				if (value === true) {
					this.showEasyResumeSection = true;
					this.getEasyResumeStatusThinkPad();
				} else {
					this.showEasyResumeSection = false;
				}
				this.easyResumeCache.available = this.showEasyResumeSection;
				this.commonService.setLocalStorageValue(LocalStorageKey.EasyResumeCapability, this.easyResumeCache);
			}).catch ((error) => {
				this.logger.error('getEasyResumeCapabilityThinkPad', error.message);
				return EMPTY;
			});
		}
	}

	private getEasyResumeStatusThinkPad() {
		try {
			if (this.powerService.isShellAvailable) {
				this.powerService
					.getEasyResumeStatusThinkPad()
					.then((value: any) => {
						console.log('getEasyResumeStatusThinkPad.then', value);
						this.toggleEasyResumeStatus = value;
						this.easyResumeCache.status = this.toggleEasyResumeStatus;
						this.commonService.setLocalStorageValue(LocalStorageKey.EasyResumeCapability, this.easyResumeCache);
					})
					.catch(error => {
						this.logger.error('getEasyResumeStatusThinkPad', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('getEasyResumeStatusThinkPad', error.message);
			return EMPTY;
		}
	}

	private setEasyResumeThinkPad(event: any) {
		if (this.powerService.isShellAvailable) {
			this.powerService.setEasyResumeThinkPad(event.switchValue).then((value: boolean) => {
				console.log('setEasyResumeThinkPad.then', event.switchValue);
				if (value) {
					this.getEasyResumeStatusThinkPad();
				}
			}).catch(error => {
				this.logger.error('setEasyResumeThinkPad', error.message);
				return EMPTY;
			});
		}
	}

	private setAlwaysOnUSBStatusThinkPad(event: any, checkboxVal: any) {
		if (this.powerService.isShellAvailable) {
			this.powerService.setAlwaysOnUSBStatusThinkPad(event, checkboxVal).then((value: boolean) => {
				console.log('setAlwaysOnUSBStatusThinkPad.then', value);
				this.getAlwaysOnUSBStatusThinkPad();
			}).catch(error => {
				this.logger.error('setAlwaysOnUSBStatusThinkPad', error.message);
				return EMPTY;
			});
		}
	}
	private getAirplaneModeCapabilityThinkPad() {
		console.log('getAirplaneModeCapabilityThinkPad ');
		if (this.powerService.isShellAvailable) {
			this.powerService.getAirplaneModeCapabilityThinkPad().then((value) => {
				console.log('getAirplaneModeCapabilityThinkPad.then', value);
				this.showAirplanePowerModeSection = value;
				this.updatePowerLinkStatus(this.showAirplanePowerModeSection);
				if (this.showAirplanePowerModeSection) {
					this.getAirplaneModeThinkPad();
				}
				this.airplanePowerCache.toggleState.available = this.showAirplanePowerModeSection;
				this.commonService.setLocalStorageValue(LocalStorageKey.AirplanePowerModeCapability, this.airplanePowerCache);
			}) .catch ((error) => {
				this.logger.error('getAirplaneModeCapabilityThinkPad', error.message);
				this.showAirplanePowerModeSection = false;
				return EMPTY;
			});
		}
	}

	private getAirplaneModeThinkPad() {
		if (this.powerService.isShellAvailable) {
			this.powerService.getAirplaneModeThinkPad().then((airPlanePowerMode: any) => {
				console.log('getAirplaneModeThinkPad.then', airPlanePowerMode);
				this.toggleAirplanePowerModeFlag = airPlanePowerMode;
				this.commonService.sendNotification('AirplaneModeStatus',
					this.toggleAirplanePowerModeFlag);
				this.airplanePowerCache.toggleState.status = this.toggleAirplanePowerModeFlag;
				this.commonService.setLocalStorageValue(LocalStorageKey.AirplanePowerModeCapability, this.airplanePowerCache);
			}).catch(error => {
				this.logger.error('getAirplaneModeThinkPad', error.message);
				return EMPTY;
			});
		}
	}

	private setAirplaneModeThinkPad(event: any) {
		if (this.powerService.isShellAvailable) {
			this.powerService.setAirplaneModeThinkPad(event.switchValue).then((value: boolean) => {
				console.log('setAirplaneModeThinkPad.then', value);
				this.getAirplaneModeThinkPad();
			}).catch(error => {
				this.logger.error('setAirplaneModeThinkPad', error.message);
				return EMPTY;
			});
		}
	}

	private getAirplaneModeAutoDetectionOnThinkPad() {
		if (this.powerService.isShellAvailable) {
			this.powerService.getAirplaneModeAutoDetectionOnThinkPad()
				.then((status: boolean) => {
					console.log('getAirplaneModeAutoDetectionOnThinkPad.then', status);
					this.airplaneAutoDetection = status;
					this.airplanePowerCache.checkbox.status = status;
					this.commonService.setLocalStorageValue(LocalStorageKey.AirplanePowerModeCapability, this.airplanePowerCache);
				})
				.catch(error => {
					this.logger.error('getAirplaneModeAutoDetectionOnThinkPad', error.message);
					return EMPTY;
				});
		}
	}

	private setAirplaneModeAutoDetectionOnThinkPad(status: boolean) {
		if (this.powerService.isShellAvailable) {
			this.powerService.setAirplaneModeAutoDetectionOnThinkPad(status)
				.then((value: boolean) => {
					console.log('setAirplaneModeAutoDetectionOnThinkPad.then', value);
				}).catch(error => {
					this.logger.error('setAirplaneModeAutoDetectionOnThinkPad', error.message);
					return EMPTY;
				});
		}
	}

	onAirplaneAutoModeStatusChange() {
		console.log('onAirplaneAutoModeStatusChange', this.airplaneAutoDetection);
		this.setAirplaneModeAutoDetectionOnThinkPad(this.airplaneAutoDetection);
		this.airplanePowerCache.checkbox.status = this.airplaneAutoDetection;
		this.commonService.setLocalStorageValue(LocalStorageKey.AirplanePowerModeCapability, this.airplanePowerCache);
	}
	// **************************** End ThinkPad ***************************************************

	// Start IdeaNoteBook
	private getAlwaysOnUSBStatusIdeaPad() {
		if (this.powerService.isShellAvailable) {
			this.powerService.getAlwaysOnUSBStatusIdeaNoteBook().then((featureStatus) => {
				console.log('getAlwaysOnUSBStatusIdeaNoteBook.then', featureStatus);
				this.alwaysOnUSBStatus = featureStatus;
				this.updatePowerLinkStatus(this.alwaysOnUSBStatus.available);
				this.toggleAlwaysOnUsbFlag = this.alwaysOnUSBStatus.status;
				this.alwaysOnUSBCache.toggleState.status = this.toggleAlwaysOnUsbFlag;
				this.commonService.setLocalStorageValue(LocalStorageKey.AlwaysOnUSBCapability, this.alwaysOnUSBCache);
			}).catch ((error) => {
				this.logger.error('getAlwaysOnUSBStatusIdeaNoteBook', error.message);
				return EMPTY;
			});
		}
	}

	private getUSBChargingInBatteryModeStatusIdeaNoteBook() {
		if (this.powerService.isShellAvailable) {
			this.powerService.getUSBChargingInBatteryModeStatusIdeaNoteBook()
				.then((featureStatus: FeatureStatus) => {
					console.log('getUSBChargingInBatteryModeStatusIdeaNoteBook.then', featureStatus);
					this.usbChargingStatus = featureStatus;
					this.usbChargingInBatteryModeStatus = featureStatus.available;
					if (this.usbChargingInBatteryModeStatus) {
						this.usbChargingCheckboxFlag = featureStatus.status;
					}
					this.alwaysOnUSBCache.checkbox.available = this.usbChargingInBatteryModeStatus;
					this.alwaysOnUSBCache.checkbox.status = this.usbChargingCheckboxFlag;
					this.commonService.setLocalStorageValue(LocalStorageKey.AlwaysOnUSBCapability, this.alwaysOnUSBCache);
					// if (this.alwaysOnUSBStatus.status) {
					// 	this.toggleAlwaysOnUsbFlag = true;
					// }
				}).catch(error => {
					this.logger.error('getUSBChargingInBatteryModeStatusIdeaNoteBook', error.message);
					return EMPTY;
				});
		}
	}

	private setUSBChargingInBatteryModeStatusIdeaNoteBook(event: any) {
		if (this.powerService.isShellAvailable) {
			this.powerService.setUSBChargingInBatteryModeStatusIdeaNoteBook(event)
				.then((value: boolean) => {
					console.log('setUSBChargingInBatteryModeStatusIdeaNoteBook.then', value);
					setTimeout(() => {
						this.getUSBChargingInBatteryModeStatusIdeaNoteBook();
					}, 50);
				}).catch(error => {
					this.logger.error('setUSBChargingInBatteryModeStatusIdeaNoteBook', error.message);
					return EMPTY;
				});
		}
	}

	private setAlwaysOnUSBStatusIdeaPad(event: any) {
		if (this.powerService.isShellAvailable) {
			this.powerService
				.setAlwaysOnUSBStatusIdeaNoteBook(event.switchValue)
				.then((value: boolean) => {
					console.log('setAlwaysOnUSBStatusIdeaNoteBook.then', value);
					setTimeout(() => {
						this.getAlwaysOnUSBStatusIdeaPad();
					}, 50);
				}).catch(error => {
					this.logger.error('getAlwaysOnUSBStatusIdeaNoteBook', error.message);
					return EMPTY;
				});
		}
	}
	private getConservationModeStatusIdeaPad() {
		if (this.powerService.isShellAvailable) {
			this.powerService.getConservationModeStatusIdeaNoteBook().then((featureStatus) => {
				console.log('getConservationModeStatusIdeaNoteBook.then', featureStatus);
				this.conservationModeStatus = featureStatus;
				this.updateBatteryLinkStatus(this.conservationModeStatus.available);

				this.conservationModeCache = featureStatus;
				this.conservationModeCache.isLoading = this.conservationModeLock;
				this.commonService.setLocalStorageValue(LocalStorageKey.ConservationModeCapability, this.conservationModeCache);
			}).catch ((error) => {
				this.logger.error('getConservationModeStatusIdeaNoteBook', error.message);
				return EMPTY;
			});
		}
	}

	private getRapidChargeModeStatusIdeaPad() {
		if (this.powerService.isShellAvailable) {
			this.powerService.getRapidChargeModeStatusIdeaNoteBook().then((featureStatus) => {
				console.log('getRapidChargeModeStatusIdeaNoteBook.then', featureStatus);
				this.expressChargingStatus = featureStatus;
				this.updateBatteryLinkStatus(this.expressChargingStatus.available);
				this.expressChargingCache = featureStatus;
				this.expressChargingCache.isLoading = this.expressChargingLock;
				this.commonService.setLocalStorageValue(LocalStorageKey.ExpressChargingCapability, this.expressChargingCache);
			}).catch ((error) => {
				this.logger.error('getRapidChargeModeStatusIdeaNoteBook', error.message);
				return EMPTY;
			});
		}
	}

	private async setConservationModeStatusIdeaNoteBook(status: any) {
		try {
			console.log('setConservationModeStatusIdeaNoteBook.then', status);
			if (this.powerService.isShellAvailable) {
				const value = await this.powerService.setConservationModeStatusIdeaNoteBook(status);
				console.log('setConservationModeStatusIdeaNoteBook.then', value);

			}
		} catch (error) {
			this.logger.error('setConservationModeStatusIdeaNoteBook', error.message);
			return EMPTY;
		}
	}


	// removed from conservation mode <br>Note: Express Charging and Conservation mode cannot work at the same time. IF one of the modes is turned on, the other one will be automatically turned off.
	async changeBatteryMode(event, mode) {
		// Code suggested fangtian1@lenovo.com, above commented code is the previous one
		if (mode === 'expressCharging') {
			this.conservationModeLock = true;
			this.expressChargingLock = false;
			if (this.expressChargingStatus.status) { // Close express charge if it's open before
				try {
					// close express charging and change UI appearance
					await this.setRapidChargeModeStatusIdeaNoteBook(false);
					this.expressChargingStatus.status = false;
				} catch (e) {
					// if await failed
					console.log(e.message);
				}
			} else { // Open express charge if it's close before
				if (this.conservationModeStatus.status) { // When conservation mode is open, close it
					try {
						await this.setConservationModeStatusIdeaNoteBook(false);
						this.conservationModeStatus.status = false;
					} catch (e) {
						// return false directly if failed to close conservation mode
						return false;
					}
				}
				try { // open Express charging if close conservation mode successfully
					await this.setRapidChargeModeStatusIdeaNoteBook(true);
					this.expressChargingStatus.status = true;
				} catch (e) {
					// Log?
					console.log(e.message);
				}
			}

			this.expressChargingLock = false;
			this.conservationModeLock = false;
		} else if (mode === 'conservationMode') {
			this.conservationModeLock = false;
			this.expressChargingLock = true;
			if (this.conservationModeStatus.status) { // Close conservation mode if it's open before
				try {
					// close conservation mode and change UI appearance
					await this.setConservationModeStatusIdeaNoteBook(false);
					this.conservationModeStatus.status = false;
				} catch (e) {
					// if await failed
					console.log(e.message);
				}
			} else { // Open conservation mode if it's close before
				if (this.expressChargingStatus.status) { // When express charging is open, close it
					try {
						await this.setRapidChargeModeStatusIdeaNoteBook(false);
						this.expressChargingStatus.status = false;
					} catch (e) {
						// return false directly if failed to close express charging
						return false;
					}
				}
				try { // open conservation mode if close express charging successfully
					await this.setConservationModeStatusIdeaNoteBook(true);
					this.conservationModeStatus.status = true;
				} catch (e) {
					// Log?
					console.log(e.message);
				}
			}

			this.expressChargingLock = false;
			this.conservationModeLock = false;
		}
		this.expressChargingCache.status = this.expressChargingStatus.status;
		this.expressChargingCache.isLoading = this.expressChargingLock;
		this.commonService.setLocalStorageValue(LocalStorageKey.ExpressChargingCapability, this.expressChargingCache);

		this.conservationModeCache.status = this.conservationModeStatus.status;
		this.conservationModeCache.isLoading = this.conservationModeLock;
		this.commonService.setLocalStorageValue(LocalStorageKey.ConservationModeCapability, this.conservationModeCache);
	}

	private async setRapidChargeModeStatusIdeaNoteBook(status) {
		try {
			console.log('setRapidChargeModeStatusIdeaNoteBook.then', status);

			if (this.powerService.isShellAvailable) {
				const value = await this.powerService
					.setRapidChargeModeStatusIdeaNoteBook(status);
				console.log('setRapidChargeModeStatusIdeaNoteBook.then', value);
			}
		} catch (error) {
			this.logger.error('setRapidChargeModeStatusIdeaNoteBook', error.message);
			return EMPTY;
		}
	}
	// End IdeaNoteBook


	// Start Lenovo Vantage ToolBar
	public onVantageToolBarStatusToggle(event: any) {
		console.log('onVantageToolBarStatusToggle', event.switchValue);
		try {
			if (this.powerService.isShellAvailable) {
				this.isVantageToolbarSetEnd = false;
				// for fix van-11383
				function backoff(maxTries, ms) {
					return pipe(
						retryWhen(attempts => zip(range(1, maxTries), attempts)
							.pipe(
								map(([i]) => i * i),
								mergeMap(i => timer(i * ms)),
							)
						),
					);
				}

				const setEvent$ = from(this.powerService.setVantageToolBarStatus(event.switchValue))
					.pipe(
						tap(() => console.log(`powerService.setVantageToolBarStatus - start stream`))
					);

				const retry$ = of([])
					.pipe(
						switchMap(() => this.powerService.getVantageToolBarStatus()),
						map(res => {
							if (res.status !== event.switchValue) {

								throw res;
							} else {
								this.isToolBarSetSuccessed = true;
								this.vantageToolbarStatus = res;
								return res;
							}
						}),
						backoff(3, 200),
						finalize(() => {
							if (this.isToolBarSetSuccessed) {
								this.isToolBarSetSuccessed = false;
							} else {
								this.getVantageToolBarStatus();
							}
							this.isVantageToolbarSetEnd = true;
						})
					);
				const deboEvent$ = retry$.pipe(debounce(() => timer(0)));

				this.toolBarSubscription = combineLatest([setEvent$, deboEvent$]).subscribe(() => console.log(`combineLatest( setEvent$ + deboEvent$ )`)
				);
			}
		} catch (error) {
			this.isVantageToolbarSetEnd = true;
			this.logger.error('getVantageToolBarStatus', error.message);
			return EMPTY;
		}
	}

	public getStartMonitorCallBack(featureStatus: FeatureStatus) {
		console.log('getStartMonitorCallBack', featureStatus, 'isVantageToolbarSetEnd:', this.isVantageToolbarSetEnd);
		if (this.isVantageToolbarSetEnd) {
			this.vantageToolbarStatus = featureStatus;
		}
		this.updateOtherSettingsStatus(this.vantageToolbarStatus.available);
		this.commonService.setLocalStorageValue(LocalStorageKey.VantageToolbarCapability, featureStatus);
	}

	public startMonitor() {
		console.log('start eyecare monitor');
		if (this.powerService.isShellAvailable) {
			this.powerService
				.startMonitor(this.getStartMonitorCallBack.bind(this))
				.then((value: any) => {
					console.log('startmonitor', value);
				}).catch(error => {
					this.logger.error('startmonitor', error.message);
					return EMPTY;
				});

		}
	}

	public stopMonitor() {
		console.log('stop eyecare monitor');
		if (this.powerService.isShellAvailable) {
			this.powerService.stopMonitor();
		}
	}

	// End Lenovo Vantage ToolBar

	// start battery threshold settings
	private getBatteryStatusEvent(response) {
		// console.log('Event response here---------------....>%%%%%%%%%%%?>', response)
		this.setChargeThresholdUI(response);
	}

	isThresholdWarningMsgShown() {
		if (this.batteryService.remainingPercentages && this.batteryService.remainingPercentages.length > 0) {
			this.showWarningMsg = this.batteryService.remainingPercentages[0] > this.selectedStopAtChargeVal;
			if (this.batteryService.remainingPercentages.length > 1 && this.selectedStopAtChargeVal1) {
				this.showWarningMsg = this.showWarningMsg || (this.batteryService.remainingPercentages[0] > this.selectedStopAtChargeVal1);
			}
		}
	}

	setChargeThresholdUI(response) {
		this.thresholdInfo = response || [];
		if (this.thresholdInfo && this.thresholdInfo.length > 0) {
			this.thresholdInfo.forEach((battery) => {
				this.isChargeThresholdAvailable = this.isChargeThresholdAvailable || battery.isCapable;
				switch (battery.batteryNum) {
					case 1:
						this.isPrimaryBatteryAvailable = battery.isCapable;
						this.showBatteryThreshold = this.showBatteryThreshold || battery.isOn;
						this.selectedStartAtChargeVal = battery.startValue - (battery.startValue % 5);
						this.selectedStopAtChargeVal = battery.stopValue - (battery.startValue % 5);
						this.primaryCheckBox = battery.checkBoxValue;
						if ((this.selectedStartAtChargeVal !== battery.startValue) || this.selectedStopAtChargeVal !== battery.stopValue) {
							this.powerService.setChargeThresholdValue(
								{
									batteryNumber: battery.batteryNum,
									startValue: this.selectedStartAtChargeVal,
									stopValue: this.selectedStopAtChargeVal,
									checkBoxValue: this.primaryCheckBox
								}
							);
						}
						break;
					case 2:
						this.isSecondBatteryAvailable = battery.isCapable;
						this.showBatteryThreshold = this.showBatteryThreshold || battery.isOn;
						this.selectedStartAtChargeVal1 = battery.startValue - (battery.startValue % 5);
						this.selectedStopAtChargeVal1 = battery.stopValue - (battery.startValue % 5);
						this.secondaryCheckBox = battery.checkBoxValue;
						if ((this.selectedStartAtChargeVal1 !== battery.startValue) || this.selectedStopAtChargeVal1 !== battery.stopValue) {
							this.powerService.setChargeThresholdValue(
								{
									batteryNumber: battery.batteryNum,
									startValue: this.selectedStartAtChargeVal1,
									stopValue: this.selectedStopAtChargeVal1,
									checkBoxValue: this.secondaryCheckBox
								}
							);
						}
						break;
				}
			});
			this.isThresholdWarningMsgShown();
		} else {
			this.isChargeThresholdAvailable = false;
			this.showBatteryThreshold = false;
		}
		this.updateBatteryLinkStatus(this.isChargeThresholdAvailable);
		this.commonService.sendNotification(ChargeThresholdInformation.ChargeThresholdInfo, this.isChargeThresholdAvailable && this.showBatteryThreshold);

		// cache value
		this.batteryChargeThresholdCache.available = this.isChargeThresholdAvailable;
		this.batteryChargeThresholdCache.toggleStatus = this.showBatteryThreshold;

		this.batteryChargeThresholdCache.isPrimaryBatteryAvailable = this.isPrimaryBatteryAvailable;
		this.batteryChargeThresholdCache.startAt1 = this.selectedStartAtChargeVal;
		this.batteryChargeThresholdCache.stopAt1 = this.selectedStopAtChargeVal;
		this.batteryChargeThresholdCache.checkBox1 = this.primaryCheckBox;

		this.batteryChargeThresholdCache.isSecondBatteryAvailable = this.isSecondBatteryAvailable;
		this.batteryChargeThresholdCache.startAt2 = this.selectedStartAtChargeVal1;
		this.batteryChargeThresholdCache.stopAt2 = this.selectedStopAtChargeVal1;
		this.batteryChargeThresholdCache.checkBox2 = this.secondaryCheckBox;

		this.batteryChargeThresholdCache.showWarningMsg = this.showWarningMsg;

		this.commonService.setLocalStorageValue(LocalStorageKey.BatteryChargeThresholdCapability, this.batteryChargeThresholdCache);
		// end cache
	}

	public getBatteryThresholdInformation() {
		if (this.powerService.isShellAvailable) {
			this.powerService.getChargeThresholdInfo().then((response) => {
				this.setChargeThresholdUI(response);
			}).catch ((error) => {
				this.logger.error('getBatteryThresholdInformation :: error', error.message);
				return EMPTY;
			});
		}
	}

	// public async getBatteryThresholdInformation() {
	// 	if (this.powerService.isShellAvailable) {
	// 		try {
	// 			const res = await this.powerService.getChargeThresholdInfo();
	// 			this.responseData = res || [];
	// 			if (this.responseData && this.responseData.length > 0) {
	// 				this.isChargeThresholdAvailable = this.responseData[0].isCapable;
	// 				this.isPrimaryBatteryAvailable = this.responseData[0].isCapable;
	// 				this.selectedStartAtChargeVal = this.responseData[0].startValue - (this.responseData[0].startValue % 5);
	// 				this.selectedStopAtChargeVal = this.responseData[0].stopValue - (this.responseData[0].stopValue % 5);
	// 				this.primaryCheckBox = this.responseData[0].checkBoxValue;
	// 				this.showBatteryThreshold = this.responseData[0].isOn;
	// 				if (this.selectedStartAtChargeVal !== this.responseData[0].startValue ||
	// 					this.selectedStopAtChargeVal !== this.responseData[0].stopValue) {
	// 					this.powerService.setChargeThresholdValue(
	// 						{
	// 							batteryNumber: this.responseData[0].batteryNumber,
	// 							startValue: this.selectedStartAtChargeVal,
	// 							stopValue: this.selectedStopAtChargeVal,
	// 							checkBoxValue: this.primaryCheckBox
	// 						}
	// 					);
	// 				}
	// 				if (this.responseData.length === 2) {
	// 					this.isChargeThresholdAvailable = this.responseData[0].isCapable || this.responseData[1].isCapable;
	// 					this.isSecondBatteryAvailable = this.responseData[1].isCapable;
	// 					this.showBatteryThreshold = this.responseData[0].isOn || this.responseData[1].isOn;
	// 					this.secondaryCheckBox = this.responseData[1].checkBoxValue;
	// 					this.selectedStartAtChargeVal1 = this.responseData[1].startValue - (this.responseData[1].startValue % 5);
	// 					this.selectedStopAtChargeVal1 = this.responseData[1].stopValue - (this.responseData[1].stopValue % 5);
	// 					if (this.selectedStartAtChargeVal1 !== this.responseData[1].startValue ||
	// 						this.selectedStopAtChargeVal1 !== this.responseData[1].stopValue) {
	// 						this.powerService.setChargeThresholdValue(
	// 							{
	// 								batteryNumber: this.responseData[1].batteryNumber,
	// 								startValue: this.selectedStartAtChargeVal1,
	// 								stopValue: this.selectedStopAtChargeVal1,
	// 								checkBoxValue: this.secondaryCheckBox
	// 							}
	// 						);
	// 					}
	// 				}
	// 				this.isThresholdWarningMsgShown();
	// 			} else {
	// 				this.isChargeThresholdAvailable = false;
	// 				this.showBatteryThreshold = false;
	// 			}

	// 			this.commonService.sendNotification(ChargeThresholdInformation.ChargeThresholdInfo, this.showBatteryThreshold);

	// 			// cache value
	// 			this.batteryChargeThresholdCache.available = this.isChargeThresholdAvailable;
	// 			this.batteryChargeThresholdCache.toggleStatus = this.showBatteryThreshold;

	// 			this.batteryChargeThresholdCache.isPrimaryBatteryAvailable = this.isPrimaryBatteryAvailable;
	// 			this.batteryChargeThresholdCache.startAt1 = this.selectedStartAtChargeVal;
	// 			this.batteryChargeThresholdCache.stopAt1 = this.selectedStopAtChargeVal;
	// 			this.batteryChargeThresholdCache.checkBox1 = this.primaryCheckBox;

	// 			this.batteryChargeThresholdCache.isSecondBatteryAvailable = this.isSecondBatteryAvailable;
	// 			this.batteryChargeThresholdCache.startAt2 = this.selectedStartAtChargeVal1;
	// 			this.batteryChargeThresholdCache.stopAt2 = this.selectedStopAtChargeVal1;
	// 			this.batteryChargeThresholdCache.checkBox2 = this.secondaryCheckBox;

	// 			this.batteryChargeThresholdCache.showWarningMsg = this.showWarningMsg;

	// 			this.commonService.setLocalStorageValue(LocalStorageKey.BatteryChargeThresholdCapability, this.batteryChargeThresholdCache);
	// 			// end cache
	// 		} catch (error) {
	// 			this.logger.error('getBatteryThresholdInformation :: error', error.message);
	// 			return EMPTY;
	// 		}
	// 	}
	// }

	private onNotification(notification: AppNotification) {
		if (notification) {
			switch (notification.type) {
				case 'IsPowerDriverMissing':
					const status = notification.payload;
					if (status !== this.isPowerDriverMissing) {
						this.isPowerDriverMissing = status;
						this.getBatteryAndPowerSettings();
					}
					break;
			}

		}
	}

	public showBatteryThresholdsettings(event) {
		this.showBatteryThreshold = event;
		// console.log(this.showBatteryThreshold);
		this.batteryChargeThresholdCache.toggleStatus = event;
		this.commonService.setLocalStorageValue(LocalStorageKey.BatteryChargeThresholdCapability, this.batteryChargeThresholdCache);
		if (this.showBatteryThreshold) {
			this.thresholdInfo.forEach(batteryInfo => {
				this.setChargeThresholdValues(batteryInfo, batteryInfo.batteryNum, 'changedValues');
			});
		} else {
			this.powerService.setToggleOff(this.thresholdInfo.length)
				.then((value: any) => {
					// console.log('change threshold value------------------->>>>>>>>>', value);
					this.getBatteryThresholdInformation();
				})
				.catch(error => {
					this.logger.error('change threshold value', error.message);
					return EMPTY;
				});
		}

	}

	public setChargeThresholdValues(batteryDetails: any, batteryNum: number, inputString: string) {
		let batteryInfo: any = {};
		if (batteryNum === 1) {
			this.selectedStopAtChargeVal = batteryDetails.stopValue;

			this.batteryChargeThresholdCache.checkBox1 = batteryDetails.checkBoxValue;
			this.batteryChargeThresholdCache.startAt1 = batteryDetails.startValue;
			this.batteryChargeThresholdCache.stopAt1 = batteryDetails.stopValue;
		}
		if (batteryNum === 2) {
			this.selectedStopAtChargeVal1 = batteryDetails.stopValue;

			this.batteryChargeThresholdCache.checkBox2 = batteryDetails.checkBoxValue;
			this.batteryChargeThresholdCache.startAt2 = batteryDetails.startValue;
			this.batteryChargeThresholdCache.stopAt2 = batteryDetails.stopValue;
		}
		this.commonService.setLocalStorageValue(LocalStorageKey.BatteryChargeThresholdCapability, this.batteryChargeThresholdCache);
		try {
			if (this.powerService.isShellAvailable) {
				batteryInfo = {
					batteryNumber: batteryNum,
					startValue: batteryDetails.startValue,
					stopValue: batteryDetails.stopValue,
					checkBoxValue: batteryDetails.checkBoxValue
				};
				if (inputString === 'changedValues') {
					this.powerService
						.setChargeThresholdValue(batteryInfo)
						.then((value: any) => {
							this.logger.info('setChargeThresholdValue success');
							this.commonService.sendNotification(ChargeThresholdInformation.ChargeThresholdInfo, true);
							this.isThresholdWarningMsgShown();
						})
						.catch(error => {
							this.logger.error('change threshold value', error.message);
							return EMPTY;
						});
				} else {
					if (inputString === 'autoChecked') {
						this.powerService.setCtAutoCheckbox(batteryInfo);
					}
				}
			}
		} catch (error) {
			this.logger.error('setChargeThresholdValues', error.message);
			return EMPTY;
		}
	}

	public getFlipToBootCapability() {
		this.powerService.getFlipToBootCapability()
			.then(res => {
				if (+res.ErrorCode === FlipToBootErrorCodeEnum.Succeed && +res.Supported === FlipToBootSupportedEnum.Succeed) {
					this.updatePowerLinkStatus(true);
					this.showFlipToBootSection$.next(true);
					this.toggleFlipToBootStatus = +res.CurrentMode === FlipToBootCurrentModeEnum.SucceedEnable;
				} else {
					this.updatePowerLinkStatus(false);
				}
			})
			.catch(error => {
				console.log('getFlipToBootCapability.error', error);
			});
	}

	onToggleOfFlipToBoot($event: any) {
		const status: FlipToBootSetStatus = $event.switchValue ? FlipToBootSetStatusEnum.On : FlipToBootSetStatusEnum.Off;
		this.powerService.setFlipToBootSettings(status)
			.then(res => {
				if (+res.ErrorCode !== FlipToBootErrorCodeEnum.Succeed) {
					this.toggleFlipToBootStatus = false;
					return res;
				}
				const metricsData = {
					itemParent: 'Device.MyDeviceSettings',
					itemName: 'FlipToBoot',
					value: status
				};
				this.metrics.sendMetrics(metricsData);
			})
			.catch(error => {
				console.log('setFlipToBootSettings.error', error);
			});
	}

	getGaugeResetCapability() {
		this.powerService.getGaugeResetCapability().then((response) => {
			console.log('Battery Gauge Reset', this.gaugeResetCapability);
			this.gaugeResetCapability = response;
			this.updateBatteryLinkStatus(this.gaugeResetCapability);
			this.commonService.setLocalStorageValue(LocalStorageKey.GaugeResetCapability, this.gaugeResetCapability);
		}).catch((err) => {
			console.log('Battery Gauge Reset', err);
		});
	}
}
