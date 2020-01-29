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

	private batteryCountStatusEventRef: any;
	public thresholdInfo: ChargeThreshold[];
	public chargeThresholdCapability = false;
	public chargeThresholdStatus = false;
	public showBCTWarningNote: boolean;

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
	chargeThresholdCache: ChargeThreshold[] = undefined;
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
		this.logger.info('Init Subpage Power');
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

		this.logger.info('=============Power Subpage ngOnit ===================');
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
		this.initSmartStandbyFromCache();
		this.initPowerSmartSettingFromCache();
		this.initAirplanePowerFromCache();
		this.initBatteryChargeThresholdFromCache();
		this.initGaugeResetInfoFromCache();
		this.initExpressChargingFromCache();
		this.initConservationModeFromCache();
		this.initPowerSettingsFromCache();
		this.initOtherSettingsFromCache();
		this.initEnergyStarFromCache();

	}

	public initPowerSmartSettingFromCache() {
		try {
			const cache = this.commonService.getLocalStorageValue(LocalStorageKey.IntelligentCoolingCapability, undefined);
			if (cache) {
				const showIC = cache.showIC;
				if (showIC === 0) {
					this.onSetSmartSettingsCapability(true);
				}
			}
		} catch (error) {
			console.log('initPowerSmartSettingFromCache', error);
		}
	}

	initSmartStandbyFromCache() {
		const capability = this.commonService.getLocalStorageValue(LocalStorageKey.SmartStandbyCapability, undefined);
		if (capability !== undefined) {
			this.onSetSmartStandbyCapability(capability.isCapable);
		} else {
			this.onSetSmartStandbyCapability(false);
		}
	}

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
			this.logger.info('initAirplanePowerFromCache', error);
		}
	}

	initBatteryChargeThresholdFromCache() {
		try {
			this.chargeThresholdCache = this.commonService.getLocalStorageValue(LocalStorageKey.BatteryChargeThresholdCapability, undefined);
			if (this.chargeThresholdCache) {
				this.setChargeThresholdUI(this.chargeThresholdCache);
			}
		} catch (error) {
			this.logger.info('initBatteryChargeThresholdFromCache', error);
		}
	}

	initGaugeResetInfoFromCache() {
		try {
			const gaugeResetCapability = this.commonService.getLocalStorageValue(LocalStorageKey.GaugeResetCapability, undefined);
			this.gaugeResetCapability = gaugeResetCapability ? true : false;
		} catch (error) {
			this.logger.info('initAirplanePowerFromCache', error);
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
			this.logger.info('initExpressChargingFromCache', error);
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
			this.logger.info('initConservationModeFromCache', error);
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
			this.logger.info('initPowerSettingsFromCache', error);
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
			this.logger.info('initOtherSettingsFromCache', error);
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
			this.logger.info('initEnergyStarFromCache', error);
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
	onSetSmartSettingsCapability(value: boolean) {
		this.showPowerSmartSettings = value;
		this.updateSmartSettingsLinkStatus(this.showPowerSmartSettings);
	}

	onSetSmartStandbyCapability(value: boolean) {
		this.smartStandbyCapability = value;
		this.updateSmartStandbyLinkStatus(this.smartStandbyCapability);
	}

	getBatteryAndPowerSettings() {
		this.logger.info('Inside getBatteryAndPowerSettings', this.machineType);

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
		this.logger.info('Before getVantageToolBarStatus');
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
		this.logger.info('Before getEnergyStarCapability');
		this.powerService.getEnergyStarCapability()
			.then((response: boolean) => {
				this.logger.info('getEnergyStarCapability.then', response);
				this.isEnergyStarProduct = response;
				this.commonService.setLocalStorageValue(LocalStorageKey.EnergyStarCapability, this.isEnergyStarProduct);
			}).catch(error => {
				this.logger.error('getEnergyStarCapability.error', error.message);
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
				title: 'device.deviceSettings.power.smartStandby.sectionTitle',
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
		this.logger.info('usb charge state entered');
		this.updatePowerMode();
	}

	onToggleOfAlwaysOnUsb(value: boolean) {
		this.toggleAlwaysOnUsbFlag = value;
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
				this.logger.info('always on usb: thinkpad');
				break;
			case 0:
				this.setAlwaysOnUSBStatusIdeaPad(value);
				this.logger.info('always on usb: ideapad');
				break;
		}
		this.alwaysOnUSBCache.toggleState.status = this.toggleAlwaysOnUsbFlag;
		this.commonService.setLocalStorageValue(LocalStorageKey.AlwaysOnUSBCapability, this.alwaysOnUSBCache);
		setTimeout(() => {
			this.updatePowerMode();
		}, 100);
	}

	onToggleOfEasyResume(value: boolean) {
		switch (this.machineType) {
			case 1:
				this.setEasyResumeThinkPad(value);
				this.logger.info('Easy Resume: ThinkPad');
				break;
			case 0:
				this.logger.info('easy resume: ideapad');
				break;
		}
	}

	onToggleOfAirplanePowerMode(value) {
		switch (this.machineType) {
			case 1:
				this.setAirplaneModeThinkPad(value);
				this.logger.info('Airplane Power mOde Set: ThinkPad', value);
				break;
			case 0:
				this.logger.info('Airplane Power mOde Set: ideapad');
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
				this.logger.info('always on usb: thinkpad');
				this.setAlwaysOnUSBStatusThinkPad(this.powerMode, this.usbChargingCheckboxFlag);
				break;
			case 0:
				this.setUSBChargingInBatteryModeStatusIdeaNoteBook(this.usbChargingCheckboxFlag);
				this.logger.info('always on usb: ideapad');
				break;
		}
	}

	// Start ThinkPad
	private getAlwaysOnUSBCapabilityThinkPad() {
		this.logger.info('Before getAlwaysOnUSBCapabilityThinkPad ');
		if (this.powerService.isShellAvailable) {
			this.powerService.getAlwaysOnUSBCapabilityThinkPad().then((value) => {
				this.logger.info('getAlwaysOnUSBCapabilityThinkPad.then', value);
				this.alwaysOnUSBStatus.available = value;
				this.updatePowerLinkStatus(value);
				if (value) {
					this.getAlwaysOnUSBStatusThinkPad();
				}
			}).catch ((error) => {
				this.logger.error('getAlwaysOnUSBCapabilityThinkPad.error', error.message);
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
						this.logger.info('getAlwaysOnUSBStatusThinkPad.then', alwaysOnUsbThinkPad);
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
		this.logger.info('Before getEasyResumeCapabilityThinkPad');
		if (this.powerService.isShellAvailable) {
			this.powerService.getEasyResumeCapabilityThinkPad().then((value) => {
				this.logger.info('getEasyResumeCapabilityThinkPad.then', value);
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
						this.logger.info('getEasyResumeStatusThinkPad.then', value);
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

	private setEasyResumeThinkPad(value: boolean) {
		if (this.powerService.isShellAvailable) {
			this.powerService.setEasyResumeThinkPad(value).then((response: boolean) => {
				this.logger.info('setEasyResumeThinkPad.then', value);
				if (response) {
					this.getEasyResumeStatusThinkPad();
				}
			}).catch(error => {
				this.logger.error('setEasyResumeThinkPad', error.message);
				return EMPTY;
			});
		}
	}

	private setAlwaysOnUSBStatusThinkPad(powerMode: string, checkboxVal: boolean) {
		if (this.powerService.isShellAvailable) {
			this.powerService.setAlwaysOnUSBStatusThinkPad(powerMode, checkboxVal).then((value: boolean) => {
				this.logger.info('setAlwaysOnUSBStatusThinkPad.then', value);
				this.getAlwaysOnUSBStatusThinkPad();
			}).catch(error => {
				this.logger.error('setAlwaysOnUSBStatusThinkPad', error.message);
				return EMPTY;
			});
		}
	}
	private getAirplaneModeCapabilityThinkPad() {
		this.logger.info('Before getAirplaneModeCapabilityThinkPad.then ');
		if (this.powerService.isShellAvailable) {
			this.powerService.getAirplaneModeCapabilityThinkPad().then((value) => {
				this.logger.info('getAirplaneModeCapabilityThinkPad.then ==>', value);
				this.showAirplanePowerModeSection = value;
				this.updatePowerLinkStatus(this.showAirplanePowerModeSection);
				if (this.showAirplanePowerModeSection) {
					this.getAirplaneModeThinkPad();
				}
				this.airplanePowerCache.toggleState.available = this.showAirplanePowerModeSection;
				this.commonService.setLocalStorageValue(LocalStorageKey.AirplanePowerModeCapability, this.airplanePowerCache);
			}) .catch ((error) => {
				this.logger.error('getAirplaneModeCapabilityThinkPad Error ==> ', error.message);
				return EMPTY;
			});
		}
	}

	private getAirplaneModeThinkPad() {
		if (this.powerService.isShellAvailable) {
			this.powerService.getAirplaneModeThinkPad().then((airPlanePowerMode: any) => {
				this.logger.info('getAirplaneModeThinkPad.then', airPlanePowerMode);
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

	private setAirplaneModeThinkPad(value: boolean) {
		if (this.powerService.isShellAvailable) {
			this.powerService.setAirplaneModeThinkPad(value).then((response: boolean) => {
				this.logger.info('setAirplaneModeThinkPad.then', response);
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
					this.logger.info('getAirplaneModeAutoDetectionOnThinkPad.then', status);
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
					this.logger.info('setAirplaneModeAutoDetectionOnThinkPad.then', value);
				}).catch(error => {
					this.logger.error('setAirplaneModeAutoDetectionOnThinkPad', error.message);
					return EMPTY;
				});
		}
	}

	onAirplaneAutoModeStatusChange() {
		this.logger.info('onAirplaneAutoModeStatusChange', this.airplaneAutoDetection);
		this.setAirplaneModeAutoDetectionOnThinkPad(this.airplaneAutoDetection);
		this.airplanePowerCache.checkbox.status = this.airplaneAutoDetection;
		this.commonService.setLocalStorageValue(LocalStorageKey.AirplanePowerModeCapability, this.airplanePowerCache);
	}
	// **************************** End ThinkPad ***************************************************

	// Start IdeaNoteBook
	private getAlwaysOnUSBStatusIdeaPad() {
		if (this.powerService.isShellAvailable) {
			this.powerService.getAlwaysOnUSBStatusIdeaNoteBook().then((featureStatus) => {
				this.logger.info('getAlwaysOnUSBStatusIdeaNoteBook.then', featureStatus);
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
		this.logger.info('Before getUSBChargingInBatteryModeStatusIdeaNoteBook');
		if (this.powerService.isShellAvailable) {
			this.powerService.getUSBChargingInBatteryModeStatusIdeaNoteBook()
				.then((featureStatus: FeatureStatus) => {
					this.logger.info('getUSBChargingInBatteryModeStatusIdeaNoteBook.then', featureStatus);
					this.usbChargingStatus = featureStatus;
					this.usbChargingInBatteryModeStatus = featureStatus.available;
					if (this.usbChargingInBatteryModeStatus) {
						this.usbChargingCheckboxFlag = featureStatus.status;
					}
					this.alwaysOnUSBCache.checkbox.available = this.usbChargingInBatteryModeStatus;
					this.alwaysOnUSBCache.checkbox.status = this.usbChargingCheckboxFlag;
					this.commonService.setLocalStorageValue(LocalStorageKey.AlwaysOnUSBCapability, this.alwaysOnUSBCache);
				}).catch(error => {
					this.logger.error('getUSBChargingInBatteryModeStatusIdeaNoteBook', error.message);
					return EMPTY;
				});
		}
	}

	private setUSBChargingInBatteryModeStatusIdeaNoteBook(flagValue: any) {
		if (this.powerService.isShellAvailable) {
			this.powerService.setUSBChargingInBatteryModeStatusIdeaNoteBook(flagValue)
				.then((value: boolean) => {
					this.logger.info('setUSBChargingInBatteryModeStatusIdeaNoteBook.then', value);
					setTimeout(() => {
						this.getUSBChargingInBatteryModeStatusIdeaNoteBook();
					}, 50);
				}).catch(error => {
					this.logger.error('setUSBChargingInBatteryModeStatusIdeaNoteBook', error.message);
					return EMPTY;
				});
		}
	}

	private setAlwaysOnUSBStatusIdeaPad(value: boolean) {
		if (this.powerService.isShellAvailable) {
			this.powerService
				.setAlwaysOnUSBStatusIdeaNoteBook(value)
				.then((response: boolean) => {
					this.logger.info('setAlwaysOnUSBStatusIdeaNoteBook.then', response);
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
		this.logger.info('Before getConservationModeStatusIdeaNoteBook');
		if (this.powerService.isShellAvailable) {
			this.powerService.getConservationModeStatusIdeaNoteBook().then((featureStatus) => {
				this.logger.info('getConservationModeStatusIdeaNoteBook.then', featureStatus);
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
		this.logger.info('Before getRapidChargeModeStatusIdeaNoteBook');
		if (this.powerService.isShellAvailable) {
			this.powerService.getRapidChargeModeStatusIdeaNoteBook().then((featureStatus) => {
				this.logger.info('getRapidChargeModeStatusIdeaNoteBook.then', featureStatus);
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
			this.logger.info('setConservationModeStatusIdeaNoteBook.then', status);
			if (this.powerService.isShellAvailable) {
				const value = await this.powerService.setConservationModeStatusIdeaNoteBook(status);
				this.logger.info('setConservationModeStatusIdeaNoteBook.then', value);

			}
		} catch (error) {
			this.logger.error('setConservationModeStatusIdeaNoteBook', error.message);
			return EMPTY;
		}
	}


	// removed from conservation mode <br>Note: Express Charging and Conservation mode cannot work at the same time. IF one of the modes is turned on, the other one will be automatically turned off.
	async changeBatteryMode(mode: string) {
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
					this.logger.info(e.message);
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
					this.logger.info(e.message);
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
					this.logger.info(e.message);
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
					this.logger.info(e.message);
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
			this.logger.info('setRapidChargeModeStatusIdeaNoteBook.then', status);

			if (this.powerService.isShellAvailable) {
				const value = await this.powerService
					.setRapidChargeModeStatusIdeaNoteBook(status);
				this.logger.info('setRapidChargeModeStatusIdeaNoteBook.then', value);
			}
		} catch (error) {
			this.logger.error('setRapidChargeModeStatusIdeaNoteBook', error.message);
			return EMPTY;
		}
	}
	// End IdeaNoteBook


	// Start Lenovo Vantage ToolBar
	public onVantageToolBarStatusToggle(value: boolean) {
		this.logger.info('onVantageToolBarStatusToggle', value);
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

				const setEvent$ = from(this.powerService.setVantageToolBarStatus(value))
					.pipe(
						tap(() => this.logger.info(`powerService.setVantageToolBarStatus - start stream`))
					);

				const retry$ = of([])
					.pipe(
						switchMap(() => this.powerService.getVantageToolBarStatus()),
						map(res => {
							if (res.status !== value) {

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

				this.toolBarSubscription = combineLatest([setEvent$, deboEvent$]).subscribe(() => this.logger.info(`combineLatest( setEvent$ + deboEvent$ )`)
				);
			}
		} catch (error) {
			this.isVantageToolbarSetEnd = true;
			this.logger.error('getVantageToolBarStatus', error.message);
			return EMPTY;
		}
	}

	public getStartMonitorCallBack(featureStatus: FeatureStatus) {
		this.logger.info('getStartMonitorCallBack', featureStatus);
		this.logger.info('isVantageToolbarSetEnd:', this.isVantageToolbarSetEnd);
		if (this.isVantageToolbarSetEnd) {
			this.vantageToolbarStatus = featureStatus;
		}
		this.updateOtherSettingsStatus(this.vantageToolbarStatus.available);
		this.commonService.setLocalStorageValue(LocalStorageKey.VantageToolbarCapability, featureStatus);
	}

	public startMonitor() {
		this.logger.info('start eyecare monitor');
		if (this.powerService.isShellAvailable) {
			this.powerService
				.startMonitor(this.getStartMonitorCallBack.bind(this))
				.then((value: any) => {
					this.logger.info('startmonitor', value);
				}).catch(error => {
					this.logger.error('startmonitor', error.message);
					return EMPTY;
				});

		}
	}

	public stopMonitor() {
		this.logger.info('stop eyecare monitor');
		if (this.powerService.isShellAvailable) {
			this.powerService.stopMonitor();
		}
	}

	// End Lenovo Vantage ToolBar

	// start battery threshold settings
	private getBatteryStatusEvent(response) {
		// this.logger.info('Event response here---------------....>%%%%%%%%%%%?>', response)
		this.setChargeThresholdUI(response);
	}

	isThresholdWarningMsgShown() {
		if (this.batteryService.remainingPercentages && this.batteryService.remainingPercentages.length > 0) {
			if (this.thresholdInfo.length === 1) {
				if (this.batteryService.remainingPercentages[0] && this.thresholdInfo[0].batteryNum === 1 ) {
					this.showBCTWarningNote = this.batteryService.remainingPercentages[0] > this.thresholdInfo[0].stopValue;
				}
				if (this.batteryService.remainingPercentages.length > 1 && this.batteryService.remainingPercentages[1]
					&& this.thresholdInfo[0].batteryNum === 2 ) {
					this.showBCTWarningNote = this.batteryService.remainingPercentages[1] > this.thresholdInfo[0].stopValue;
				}
			} else {
				if (this.batteryService.remainingPercentages.length > 1 && this.thresholdInfo[1].stopValue) {
					this.showBCTWarningNote = this.showBCTWarningNote || (this.batteryService.remainingPercentages[0] > this.thresholdInfo[0].stopValue);
				}
			}
		}
	}

	setChargeThresholdUI(response) {
		const thresholdInfo = response || [];
		let bctCapability = false;
		let bctStatus = false;

		if (thresholdInfo && thresholdInfo.length > 0) {
			let count = 0;
			thresholdInfo.forEach((battery) => {
				bctCapability = bctCapability || battery.isCapable;
				bctStatus = bctStatus || battery.isEnabled;

				const startValue = battery.startValue - (battery.startValue % 5);
				let stopValue = battery.stopValue - (battery.stopValue % 5);
				if (startValue === stopValue) {
					stopValue = stopValue + 5;
				}
				if (battery.startValue !== startValue || battery.stopValue !== stopValue) {
					battery.startValue = startValue;
					battery.stopValue = stopValue;
					this.onBCTInfoChange(battery, count);
				}
				count++;
			});

			this.chargeThresholdCapability = bctCapability;
			this.chargeThresholdStatus = bctStatus;
			this.thresholdInfo = thresholdInfo;
			if (this.chargeThresholdCapability && this.chargeThresholdStatus) {
				this.isThresholdWarningMsgShown();
			}
		} else {
			this.chargeThresholdCapability = false;
			this.chargeThresholdStatus = false;
		}
		this.updateBatteryLinkStatus(this.chargeThresholdCapability);
		this.commonService.sendNotification(ChargeThresholdInformation.ChargeThresholdInfo, this.chargeThresholdCapability && this.chargeThresholdStatus);
	}

	public getBatteryThresholdInformation() {
		this.logger.info('Before getBatteryThresholdInformation');
		if (this.powerService.isShellAvailable) {
			this.powerService.getChargeThresholdInfo().then((response) => {
				this.logger.info('getBatteryThresholdInformation.then', response);
				this.setChargeThresholdUI(response);
				this.commonService.setLocalStorageValue(LocalStorageKey.BatteryChargeThresholdCapability, response);
			}).catch ((error) => {
				this.logger.error('getBatteryThresholdInformation :: error', error.message);
				return EMPTY;
			});
		}
	}

	public toggleBCTSwitch(value: boolean) {
		if (value) {
			let count = 0;
			this.thresholdInfo.forEach(battery => {
				battery.isEnabled = value;
				const startValue = battery.startValue - (battery.startValue % 5);
				let stopValue = battery.stopValue - (battery.stopValue % 5);
				if (battery.startValue !== startValue || battery.stopValue !== battery.stopValue) {
					if (startValue === stopValue) {
						stopValue = stopValue + 5;
					}
					battery.startValue = startValue;
					battery.stopValue = stopValue;
				}
				this.onBCTInfoChange(battery, count);
				count++;
			});
		} else {
			this.setBCTToggleOff(value);
		}
	}

	public onBCTInfoChange(bctInfo: ChargeThreshold, index: number) {
		if (this.powerService.isShellAvailable) {
			this.powerService.setChargeThresholdValue(bctInfo)
				.then((value: any) => {
					this.logger.info('setChargeThresholdValue.then', value);
					if (value === 0) {
						this.thresholdInfo[index] = bctInfo;
						if (!this.chargeThresholdStatus) {
							this.chargeThresholdStatus = true;
							this.commonService.sendNotification(ChargeThresholdInformation.ChargeThresholdInfo, this.chargeThresholdStatus);
						}
						this.isThresholdWarningMsgShown();
						this.commonService.setLocalStorageValue(LocalStorageKey.BatteryChargeThresholdCapability, this.thresholdInfo);
					}
				})
				.catch(error => {
					this.logger.error('change threshold value', error.message);
					return EMPTY;
				});
		}
	}

	public onAutoCheckChange(bctInfo: ChargeThreshold, index: number) {
		if (this.powerService.isShellAvailable) {
			this.powerService.setCtAutoCheckbox(bctInfo);
			this.thresholdInfo[index] = bctInfo;
			this.commonService.setLocalStorageValue(LocalStorageKey.BatteryChargeThresholdCapability, this.thresholdInfo);
		}
	}

	public setBCTToggleOff(value: boolean) {
		this.powerService.setToggleOff(this.thresholdInfo.length)
			.then((response: number) => {
				if (response === 0) {
					this.chargeThresholdStatus = false;
					this.commonService.sendNotification(ChargeThresholdInformation.ChargeThresholdInfo, this.chargeThresholdStatus);
					this.thresholdInfo.forEach(battery => {
						battery.isEnabled = value;
					});
					this.commonService.setLocalStorageValue(LocalStorageKey.BatteryChargeThresholdCapability, this.thresholdInfo);
				}
			})
			.catch(error => {
				this.logger.error('change threshold value', error.message);
				return EMPTY;
			});
	}
	// End battery threshold settings

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

	// Start Flip To Boot
	public getFlipToBootCapability() {
		this.logger.info('Before getFlipToBootCapability');
		this.powerService.getFlipToBootCapability()
			.then((res) => {
				this.logger.info('getFlipToBootCapability.then ===>', res);
				if (+res.ErrorCode === FlipToBootErrorCodeEnum.Succeed && +res.Supported === FlipToBootSupportedEnum.Succeed) {
					this.updatePowerLinkStatus(true);
					this.showFlipToBootSection$.next(true);
					this.toggleFlipToBootStatus = +res.CurrentMode === FlipToBootCurrentModeEnum.SucceedEnable;
				} else {
					this.updatePowerLinkStatus(false);
				}
			})
			.catch(error => {
				this.logger.info('getFlipToBootCapability.error', error);
			});
	}

	onToggleOfFlipToBoot(value: boolean) {
		const status: FlipToBootSetStatus = value ? FlipToBootSetStatusEnum.On : FlipToBootSetStatusEnum.Off;
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
				this.logger.info('setFlipToBootSettings.error', error);
			});
	}
	// End Flip To Boot

	// Gauge Reset Capability
	getGaugeResetCapability() {
		this.logger.info('Before getGaugeResetCapability');
		this.powerService.getGaugeResetCapability().then((response) => {
			this.logger.info('getGaugeResetCapability.then', this.gaugeResetCapability);
			this.gaugeResetCapability = response;
			this.updateBatteryLinkStatus(this.gaugeResetCapability && this.batteryService.gaugeResetInfo.length > 0);
			this.commonService.setLocalStorageValue(LocalStorageKey.GaugeResetCapability, this.gaugeResetCapability);
		}).catch((err) => {
			this.logger.info('getGaugeResetCapability.error', err);
		});
	}
	// Gauge Reset Capability

}
