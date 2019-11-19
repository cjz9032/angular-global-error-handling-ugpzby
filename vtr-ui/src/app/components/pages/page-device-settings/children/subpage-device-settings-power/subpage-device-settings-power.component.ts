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
import { BehaviorSubject, EMPTY } from 'rxjs';
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
	public vantageToolbarStatus = new FeatureStatus(false, true);
	vantageToolbarCache: FeatureStatus;
	public alwaysOnUSBStatus = new FeatureStatus(false, true);
	public usbChargingStatus = new FeatureStatus(false, true);
	public easyResumeStatus = new FeatureStatus(false, true);
	public conservationModeStatus = new FeatureStatus(false, true);
	public expressChargingStatus = new FeatureStatus(false, true);
	public conservationModeLock = false;
	public expressChargingLock = false;
	public batteryGauge: any;
	public showWarningMsg: boolean;
	public isEnergyStarProduct = false;
	public energyStarCache: boolean;
	public isChargeThresholdAvailable = false;

	@Input() isCollapsed = true;
	@Input() allowCollapse = true;
	@Input() theme = 'white';

	@Output() toggle = new EventEmitter();

	primaryCheckBox = false;
	secondaryCheckBox = false;
	selectedStopAtChargeVal;
	selectedStartAtChargeVal;
	selectedStopAtChargeVal1;
	selectedStartAtChargeVal1;

	public responseData: any[] = [];
	public isSecondBatteryAvailable = false;
	public isPrimaryBatteryAvailable = false;
	public machineType: any;
	private batteryCountStatusEventRef: any;

	thresholdWarningSubscription: Subscription;

	chargeOptions: number[] = [40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
	startAtChargeOptions: number[] = this.chargeOptions.slice(0, this.chargeOptions.length - 1);
	stopAtChargeOptions: number[] = this.chargeOptions.slice(1, this.chargeOptions.length);

	toggleAlwaysOnUsbFlag = false;
	usbChargingCheckboxFlag = false;
	powerMode = PowerMode.Sleep;
	showEasyResumeSection = true;
	toggleEasyResumeStatus = false;
	showAirplanePowerModeSection = false;
	toggleAirplanePowerModeFlag = false;
	airplaneAutoDetection = false;
	usbChargingInBatteryModeStatus = true;
	isDesktopMachine = true;
	showBatteryThreshold = false;
	value = 1;
	alwaysOnUSBCache: AlwaysOnUSBCapability = undefined;
	airplanePowerCache: AlwaysOnUSBCapability = undefined;
	easyResumeCache: FeatureStatus;
	batteryChargeThresholdCache: BatteryChargeThresholdCapability = undefined;
	expressChargingCache: FeatureStatus = undefined;
	conservationModeCache: FeatureStatus = undefined;
	public isPowerDriverMissing = false;

	headerMenuItems = [
		{
			title: 'device.deviceSettings.power.powerSmartSettings.title',
			path: 'smartSettings',
			metricsItem: 'PowerSmartSettings',
			order: 1
		},
		{
			title: 'device.deviceSettings.power.smartStandby.title',
			path: 'smartStandby',
			metricsItem: 'SmartStandby',
			order: 2
		},
		{
			title: 'device.deviceSettings.power.batterySettings.title',
			path: 'battery',
			metricsItem: 'BatterySettings',
			order: 3
		},
		{
			title: 'device.deviceSettings.power.powerSettings.title',
			path: 'power',
			metricsItem: 'PowerSettings',
			order: 4
		},
		{
			title: 'device.deviceSettings.power.otherSettings.title',
			path: 'other',
			metricsItem: 'OtherSettings',
			order: 5
		}
	];

	// removed from conservation mode <br>Note: Express Charging and Conservation mode cannot work at the same time. IF one of the modes is turned on, the other one will be automatically turned off.
	toggleFlipToBootStatus = true;
	showFlipToBootSection$: BehaviorSubject<boolean> = new BehaviorSubject(false);

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

	constructor(
		private routeHandler: RouteHandlerService, // logic is added in constructor, no need to call any method
		public powerService: PowerService,
		private commonService: CommonService,
		private logger: LoggerService,
		public modalService: NgbModal,
		public shellServices: VantageShellService,
		private metrics: MetricService,
	) {
	}

	ngOnInit() {
		this.getFlipToBootCapability();
		this.initDataFromCache();
		this.isDesktopMachine = this.commonService.getLocalStorageValue(LocalStorageKey.DesktopMachine);
		this.machineType = this.commonService.getLocalStorageValue(LocalStorageKey.MachineType);
		this.isPowerDriverMissing = this.commonService.getLocalStorageValue(LocalStorageKey.IsPowerDriverMissing);
		this.getVantageToolBarCapability();
		this.getEnergyStarCapability();
		if (this.isDesktopMachine) {
			this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, 'smartSettings');
			this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, 'smartStandby');
			this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, 'battery');
			// this.headerMenuItems.splice(0, 1);
			// this.headerMenuItems.splice(0, 1);
			// this.headerMenuItems.splice(0, 1);
			this.updateBatteryLinkStatus(false);
		}
		this.checkMenuItemsEmpty();
		this.getBatteryAndPowerSettings(this.machineType);
		this.startMonitor();

		this.shellServices.registerEvent(EventTypes.pwrBatteryStatusEvent, this.batteryCountStatusEventRef);

		this.thresholdWarningSubscription = this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});
	}

	initDataFromCache() {
		this.initBatteryLinkFromCache();
		this.initPowerSmartSettingFromCache();
		this.initAirplanePowerFromCache();
		this.initBatteryChargeThresholdFromCache();
		this.initExpressChargingFromCache();
		this.initConservationModeFromCache();
		this.initPowerSettingsFromCache();
		this.initOtherSettingsFromCache();
		this.initEnergyStarFromCache();

	}

	initBatteryLinkFromCache() {
		const status = this.commonService.getLocalStorageValue(LocalStorageKey.IsBatteryQuickSettingAvailable, true);
		this.updateBatteryLinkStatus(status);
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

	ngOnDestroy() {
		if (this.thresholdWarningSubscription) {
			this.thresholdWarningSubscription.unsubscribe();
		}
		this.stopMonitor();
		this.shellServices.unRegisterEvent(EventTypes.pwrBatteryStatusEvent, this.batteryCountStatusEventRef);
	}

	onSetSmartStandbyCapability(event: boolean) {
		if (!event) {
			this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, 'smartStandby');
			this.checkMenuItemsEmpty();
		}
	}

	openContextModal(template: TemplateRef<any>) {
		this.modalService.open(template, {
			windowClass: 'read-more'
		});
	}

	closeContextModal() {
		this.modalService.dismissAll();
	}

	async getBatteryAndPowerSettings(machineName: any) {
		console.log('inside getAndSetAlwaysOnUSBForBrands');
		console.log('machine', machineName);

		switch (machineName) {
			case 1:
				this.getAirplaneModeAutoDetectionOnThinkPad();
				this.batteryCountStatusEventRef = this.getBatteryStatusEvent.bind(this);
				await this.getBatteryThresholdInformation();
				await this.getAirplaneModeCapabilityThinkPad();
				await this.getAlwaysOnUSBCapabilityThinkPad();
				await this.getEasyResumeCapabilityThinkPad();
				break;
			case 0:
				this.showEasyResumeSection = false;
				await this.getConservationModeStatusIdeaPad();
				await this.getRapidChargeModeStatusIdeaPad();
				await this.getAlwaysOnUSBStatusIdeaPad();
				this.getUSBChargingInBatteryModeStatusIdeaNoteBook();
				break;
		}
		this.hideBatteryLink();
		this.showPowerSettings();
	}

	async getVantageToolBarCapability() {
		await this.getVantageToolBarStatus();
		this.hideOtherSettingsLink();
	}

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
	private async getAlwaysOnUSBCapabilityThinkPad() {
		console.log('getAlwaysOnUSBCapabilityThinkPad ');
		if (this.powerService.isShellAvailable) {
			try {
				const value = await this.powerService.getAlwaysOnUSBCapabilityThinkPad();
				console.log('getAlwaysOnUSBCapabilityThinkPad.then', value);
				this.alwaysOnUSBStatus.available = value;
				this.getAlwaysOnUSBStatusThinkPad();
			} catch (error) {
				this.logger.error('getAlwaysOnUSBCapabilityThinkPad', error.message);
				return EMPTY;
			}
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
						if (alwaysOnUsbThinkPad.isEnabled) {
							this.toggleAlwaysOnUsbFlag = true;
						}
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
	private async getEasyResumeCapabilityThinkPad() {
		if (this.powerService.isShellAvailable) {
			try {
				const value = await this.powerService.getEasyResumeCapabilityThinkPad();
				console.log('getEasyResumeCapabilityThinkPad.then', value);
				if (value === true) {
					this.showEasyResumeSection = true;
					this.getEasyResumeStatusThinkPad();
				} else {
					this.showEasyResumeSection = false;
				}
				this.easyResumeCache.available = this.showEasyResumeSection;
				this.commonService.setLocalStorageValue(LocalStorageKey.EasyResumeCapability, this.easyResumeCache);
			} catch (error) {
				this.logger.error('getEasyResumeCapabilityThinkPad', error.message);
				return EMPTY;
			}
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
		try {
			console.log('setAlwaysOnUSBStatusIdeaNoteBook.then', event);
			if (this.powerService.isShellAvailable) {
				this.powerService
					.setEasyResumeThinkPad(event.switchValue)
					.then((value: boolean) => {
						console.log('setEasyResumeThinkPad.then', event.switchValue);
						this.getEasyResumeStatusThinkPad();
					})
					.catch(error => {
						this.logger.error('setEasyResumeThinkPad', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('setEasyResumeThinkPad', error.message);
			return EMPTY;
		}
	}

	private setAlwaysOnUSBStatusThinkPad(event: any, checkboxVal: any) {
		try {
			console.log('setAlwaysOnUSBStatusThinkPad.then', event);
			if (this.powerService.isShellAvailable) {
				this.powerService
					.setAlwaysOnUSBStatusThinkPad(event, checkboxVal)
					.then((value: boolean) => {
						console.log('setAlwaysOnUSBStatusThinkPad.then', value);
						this.getAlwaysOnUSBStatusThinkPad();
					})
					.catch(error => {
						this.logger.error('setAlwaysOnUSBStatusThinkPad', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('setAlwaysOnUSBStatusThinkPad', error.message);
			return EMPTY;
		}
	}
	private async getAirplaneModeCapabilityThinkPad() {
		console.log('getAirplaneModeCapabilityThinkPad ');
		if (this.powerService.isShellAvailable) {
			try {
				const value = await this.powerService.getAirplaneModeCapabilityThinkPad();
				console.log('getAirplaneModeCapabilityThinkPad.then', value);
				this.showAirplanePowerModeSection = value;
				if (this.showAirplanePowerModeSection) {
					this.getAirplaneModeThinkPad();
				}
				this.airplanePowerCache.toggleState.available = this.showAirplanePowerModeSection;
				this.commonService.setLocalStorageValue(LocalStorageKey.AirplanePowerModeCapability, this.airplanePowerCache);
			} catch (error) {
				this.logger.error('getAirplaneModeCapabilityThinkPad', error.message);
				return EMPTY;
			}
		}
	}

	private getAirplaneModeThinkPad() {
		try {
			if (this.powerService.isShellAvailable) {
				this.powerService
					.getAirplaneModeThinkPad()
					.then((airPlanePowerMode: any) => {
						console.log('getAirplaneModeThinkPad.then', airPlanePowerMode);
						this.toggleAirplanePowerModeFlag = airPlanePowerMode;
						this.commonService.sendNotification('AirplaneModeStatus',
							this.toggleAirplanePowerModeFlag);
						this.airplanePowerCache.toggleState.status = this.toggleAirplanePowerModeFlag;
						this.commonService.setLocalStorageValue(LocalStorageKey.AirplanePowerModeCapability, this.airplanePowerCache);
					})
					.catch(error => {
						this.logger.error('getAirplaneModeThinkPad', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('getAirplaneModeThinkPad', error.message);
			return EMPTY;
		}
	}

	private setAirplaneModeThinkPad(event: any) {
		try {
			console.log('setAirplaneModeThinkPad entered', event);
			if (this.powerService.isShellAvailable) {
				this.powerService
					.setAirplaneModeThinkPad(event.switchValue)
					.then((value: boolean) => {
						console.log('setAirplaneModeThinkPad.then', value);
						this.getAirplaneModeThinkPad();
					})
					.catch(error => {
						this.logger.error('setAirplaneModeThinkPad', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('setAirplaneModeThinkPad', error.message);
			return EMPTY;
		}

	}

	private getAirplaneModeAutoDetectionOnThinkPad() {
		try {
			if (this.powerService.isShellAvailable) {
				this.powerService
					.getAirplaneModeAutoDetectionOnThinkPad()
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
		} catch (error) {
			this.logger.error('getAirplaneModeAutoDetectionOnThinkPad', error.message);
			return EMPTY;
		}
	}

	private setAirplaneModeAutoDetectionOnThinkPad(status: boolean) {
		try {
			console.log('setAirplaneModeAutoDetectionOnThinkPad entered', status);
			if (this.powerService.isShellAvailable) {
				this.powerService
					.setAirplaneModeAutoDetectionOnThinkPad(status)
					.then((value: boolean) => {
						console.log('setAirplaneModeAutoDetectionOnThinkPad.then', value);
					})
					.catch(error => {
						this.logger.error('setAirplaneModeAutoDetectionOnThinkPad', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('setAirplaneModeAutoDetectionOnThinkPad', error.message);
			return EMPTY;
		}
	}

	onAirplaneAutoModeStatusChange() {
		console.log('onAirplaneAutoModeStatusChange', this.airplaneAutoDetection);
		this.setAirplaneModeAutoDetectionOnThinkPad(this.airplaneAutoDetection);
		this.airplanePowerCache.checkbox.status = this.airplaneAutoDetection;
		this.commonService.setLocalStorageValue(LocalStorageKey.AirplanePowerModeCapability, this.airplanePowerCache);
	}

	// End ThinkPad

	// Start IdeaNoteBook
	private async getAlwaysOnUSBStatusIdeaPad() {
		if (this.powerService.isShellAvailable) {
			try {
				const featureStatus = await this.powerService.getAlwaysOnUSBStatusIdeaNoteBook();
				console.log('getAlwaysOnUSBStatusIdeaNoteBook.then', featureStatus);
				this.alwaysOnUSBStatus = featureStatus;
				this.toggleAlwaysOnUsbFlag = this.alwaysOnUSBStatus.status;
				this.alwaysOnUSBCache.toggleState.status = this.toggleAlwaysOnUsbFlag;
				this.commonService.setLocalStorageValue(LocalStorageKey.AlwaysOnUSBCapability, this.alwaysOnUSBCache);
			} catch (error) {
				this.logger.error('getAlwaysOnUSBStatusIdeaNoteBook', error.message);
				return EMPTY;
			}
		}
	}

	private getUSBChargingInBatteryModeStatusIdeaNoteBook() {
		try {
			if (this.powerService.isShellAvailable) {
				this.powerService
					.getUSBChargingInBatteryModeStatusIdeaNoteBook()
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
					})
					.catch(error => {
						this.logger.error('getUSBChargingInBatteryModeStatusIdeaNoteBook', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('getUSBChargingInBatteryModeStatusIdeaNoteBook', error.message);
			return EMPTY;
		}
	}

	private setUSBChargingInBatteryModeStatusIdeaNoteBook(event: any) {
		try {
			if (this.powerService.isShellAvailable) {
				this.powerService
					.setUSBChargingInBatteryModeStatusIdeaNoteBook(event)
					.then((value: boolean) => {
						console.log('setUSBChargingInBatteryModeStatusIdeaNoteBook.then', value);
						setTimeout(() => {
							this.getUSBChargingInBatteryModeStatusIdeaNoteBook();
						}, 50);
					})
					.catch(error => {
						this.logger.error('setUSBChargingInBatteryModeStatusIdeaNoteBook', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('setUSBChargingInBatteryModeStatusIdeaNoteBook', error.message);
			return EMPTY;
		}
	}

	private setAlwaysOnUSBStatusIdeaPad(event: any) {
		try {
			if (this.powerService.isShellAvailable) {
				this.powerService
					.setAlwaysOnUSBStatusIdeaNoteBook(event.switchValue)
					.then((value: boolean) => {
						console.log('setAlwaysOnUSBStatusIdeaNoteBook.then', value);
						setTimeout(() => {
							this.getAlwaysOnUSBStatusIdeaPad();
						}, 50);
					})
					.catch(error => {
						this.logger.error('getAlwaysOnUSBStatusIdeaNoteBook', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('getAlwaysOnUSBStatusIdeaNoteBook', error.message);
			return EMPTY;
		}
	}
	private async getConservationModeStatusIdeaPad() {
		if (this.powerService.isShellAvailable) {
			try {
				const featureStatus = await this.powerService.getConservationModeStatusIdeaNoteBook();
				console.log('getConservationModeStatusIdeaNoteBook.then', featureStatus);
				this.conservationModeStatus = featureStatus;

				this.conservationModeCache = featureStatus;
				this.conservationModeCache.isLoading = this.conservationModeLock;
				this.commonService.setLocalStorageValue(LocalStorageKey.ConservationModeCapability, this.conservationModeCache);
			} catch (error) {
				this.logger.error('getConservationModeStatusIdeaNoteBook', error.message);
				return EMPTY;
			}
		}
	}

	private async getRapidChargeModeStatusIdeaPad() {
		if (this.powerService.isShellAvailable) {
			try {
				const featureStatus = await this.powerService.getRapidChargeModeStatusIdeaNoteBook();
				console.log('getRapidChargeModeStatusIdeaNoteBook.then', featureStatus);
				this.expressChargingStatus = featureStatus;
				this.expressChargingCache = featureStatus;
				this.expressChargingCache.isLoading = this.expressChargingLock;
				this.commonService.setLocalStorageValue(LocalStorageKey.ExpressChargingCapability, this.expressChargingCache);
			} catch (error) {
				this.logger.error('getRapidChargeModeStatusIdeaNoteBook', error.message);
				return EMPTY;
			}
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
	private async getVantageToolBarStatus() {
		try {
			if (this.powerService.isShellAvailable) {
				const featureStatus = await this.powerService.getVantageToolBarStatus();
				this.logger.info('getVantageToolBarStatus.then', featureStatus);
				this.vantageToolbarStatus = featureStatus;
				this.hideOtherSettingsLink();
			}
		} catch (error) {
			this.logger.error('getVantageToolBarStatus', error.message);
			this.hideOtherSettingsLink();
			return EMPTY;
		}
	}

	public onVantageToolBarStatusToggle(event: any) {
		console.log('onVantageToolBarStatusToggle', event.switchValue);
		try {
			if (this.powerService.isShellAvailable) {
				this.powerService.setVantageToolBarStatus(event.switchValue)
					.then((value: boolean) => {
						console.log('setVantageToolBarStatus.then', event.switchValue);
						this.getVantageToolBarStatus();
					}).catch(error => {
						this.logger.error('setVantageToolBarStatus', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('getVantageToolBarStatus', error.message);
			return EMPTY;
		}
	}

	public getStartMonitorCallBack(featureStatus: FeatureStatus) {
		console.log('getStartMonitorCallBack', featureStatus);
		this.vantageToolbarStatus = featureStatus;
		this.commonService.setLocalStorageValue(LocalStorageKey.VantageToolbarCapability, featureStatus);
		this.hideOtherSettingsLink();
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
	public initPowerSmartSettingFromCache() {
		try {
			const cache = this.commonService.getLocalStorageValue(LocalStorageKey.IntelligentCoolingCapability, undefined);
			if (cache) {
				const showIC = cache.showIC;
				if (showIC === 0) {
					this.hidePowerSmartSetting(true);
				}
			}
		} catch (error) {
			console.log('initPowerSmartSettingFromCache', error);
		}
	}

	hidePowerSmartSetting(hide: boolean) {
		this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, 'smartSettings');
		this.checkMenuItemsEmpty();
	}

	// start battery threshold settings
	private getBatteryStatusEvent(response) {
		// console.log('Event response here---------------....>%%%%%%%%%%%?>', response)
		this.responseData = response;
		this.getBatteryThresholdInformation();
	}
	public async getBatteryThresholdInformation() {
		let notification;
		if (this.powerService.isShellAvailable) {
			try {
				const res = await this.powerService.getChargeThresholdInfo();
				this.responseData = res || [];
				if (this.responseData && this.responseData.length > 0) {
					this.isChargeThresholdAvailable = this.responseData[0].isCapable || this.responseData[1].isCapable;
					this.isPrimaryBatteryAvailable = this.responseData[0].isCapable;
					this.selectedStartAtChargeVal = this.responseData[0].startValue - (this.responseData[0].startValue % 5);
					this.selectedStopAtChargeVal = this.responseData[0].stopValue - (this.responseData[0].stopValue % 5);
					this.primaryCheckBox = this.responseData[0].checkBoxValue;
					this.showBatteryThreshold = this.responseData[0].isOn;
					if (this.selectedStartAtChargeVal !== this.responseData[0].startValue ||
						this.selectedStopAtChargeVal !== this.responseData[0].stopValue) {
						this.powerService.setChargeThresholdValue(
							{
								batteryNumber: this.responseData[0].batteryNumber,
								startValue: this.selectedStartAtChargeVal,
								stopValue: this.selectedStopAtChargeVal,
								checkBoxValue: this.primaryCheckBox
							}
						);
					}
					if (this.responseData.length === 2) {
						this.isSecondBatteryAvailable = this.responseData[1].isCapable;
						// this.isChargeThresholdAvailable = this.responseData[1].isCapable;
						this.secondaryCheckBox = this.responseData[1].checkBoxValue;
						this.selectedStartAtChargeVal1 = this.responseData[1].startValue - (this.responseData[1].startValue % 5);
						this.selectedStopAtChargeVal1 = this.responseData[1].stopValue - (this.responseData[1].stopValue % 5);
						if (this.selectedStartAtChargeVal1 !== this.responseData[1].startValue ||
							this.selectedStopAtChargeVal1 !== this.responseData[1].stopValue) {
							this.powerService.setChargeThresholdValue(
								{
									batteryNumber: this.responseData[1].batteryNumber,
									startValue: this.selectedStartAtChargeVal1,
									stopValue: this.selectedStopAtChargeVal1,
									checkBoxValue: this.secondaryCheckBox
								}
							);
						}
					}
					notification = {
						isOn: this.responseData[0].isOn,
						stopValue1: this.selectedStopAtChargeVal,
						stopValue2: this.selectedStopAtChargeVal1
					};

					// cache value
					this.batteryChargeThresholdCache.available = this.isChargeThresholdAvailable;
					this.batteryChargeThresholdCache.toggleStatus = this.showBatteryThreshold;

					this.batteryChargeThresholdCache.startAt1 = this.selectedStartAtChargeVal;
					this.batteryChargeThresholdCache.stopAt1 = this.selectedStopAtChargeVal;
					this.batteryChargeThresholdCache.checkBox1 = this.primaryCheckBox;

					this.batteryChargeThresholdCache.startAt2 = this.selectedStartAtChargeVal1;
					this.batteryChargeThresholdCache.stopAt2 = this.selectedStopAtChargeVal1;
					this.batteryChargeThresholdCache.checkBox2 = this.secondaryCheckBox;

					this.batteryChargeThresholdCache.showWarningMsg = this.showWarningMsg;
					this.batteryChargeThresholdCache.isSecondBatteryAvailable = this.isSecondBatteryAvailable;
					this.batteryChargeThresholdCache.isPrimaryBatteryAvailable = this.isPrimaryBatteryAvailable;
					this.commonService.setLocalStorageValue(LocalStorageKey.BatteryChargeThresholdCapability, this.batteryChargeThresholdCache);
				}
				this.commonService.sendNotification(ChargeThresholdInformation.ChargeThresholdInfo, notification);
			} catch (error) {
				this.logger.error('getBatteryThresholdInformation :: error', error.message);
				return EMPTY;
			}
		}
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			switch (notification.type) {
				case 'ThresholdWarningNote':
					this.showWarningMsg = notification.payload;
					this.batteryChargeThresholdCache.showWarningMsg = this.showWarningMsg;
					this.commonService.setLocalStorageValue(LocalStorageKey.BatteryChargeThresholdCapability, this.batteryChargeThresholdCache);
					break;
				case 'IsPowerDriverMissing':
					this.checkPowerDriverMissing(notification.payload);
					this.checkPowerDriverMissing(this.isPowerDriverMissing);
					break;
			}

		}
	}

	public checkPowerDriverMissing(status) {
		this.isPowerDriverMissing = status;
		if (this.machineType === 1 && status) {
			this.showAirplanePowerModeSection = false;
			this.isChargeThresholdAvailable = false;
			this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, 'battery');
			this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, 'power');
			this.updateBatteryLinkStatus(false);
			this.checkMenuItemsEmpty();
		}
	}

	updateBatteryLinkStatus(addLink: boolean) {
		const status = this.commonService.isPresent(this.headerMenuItems, 'battery');
		if (addLink && !status) {
			const powerObj  = {
				title: 'device.deviceSettings.power.batterySettings.title',
				path: 'battery',
				metricsItem: 'BatterySettings',
				order: 2
			};
			this.headerMenuItems.push(powerObj);
			this.commonService.sortMenuItems(this.headerMenuItems);
			this.commonService.setLocalStorageValue(LocalStorageKey.IsBatteryQuickSettingAvailable, true);
		}
		if (!addLink) {
			this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, 'battery');
			this.commonService.setLocalStorageValue(LocalStorageKey.IsBatteryQuickSettingAvailable, false);
		}
	}

	public showBatteryThresholdsettings(event) {
		this.showBatteryThreshold = event;
		// console.log(this.showBatteryThreshold);
		this.batteryChargeThresholdCache.toggleStatus = event;
		this.commonService.setLocalStorageValue(LocalStorageKey.BatteryChargeThresholdCapability, this.batteryChargeThresholdCache);
		if (this.showBatteryThreshold) {
			this.responseData.forEach(batteryInfo => {
				this.setChargeThresholdValues(batteryInfo, batteryInfo.batteryNum, 'changedValues');
			});
		} else {
			this.powerService.setToggleOff(this.responseData.length)
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
							const notification = {
								isOn: true,
								stopValue1: this.selectedStopAtChargeVal, stopValue2: this.selectedStopAtChargeVal1
							};
							this.commonService.sendNotification(ChargeThresholdInformation.ChargeThresholdInfo, notification);
						})
						.catch(error => {
							this.logger.error('change threshold value', error.message);
							return EMPTY;
						});
				} else {
					if (inputString === 'autoChecked') {
						this.powerService.setCtAutoCheckbox(batteryInfo);
						const notification = {
							isOn: true,
							stopValue1: this.selectedStopAtChargeVal, stopValue2: this.selectedStopAtChargeVal1
						};
						this.commonService.sendNotification(ChargeThresholdInformation.ChargeThresholdInfo, notification);
					}
				}
			}
		} catch (error) {
			this.logger.error('setChargeThresholdValues', error.message);
			return EMPTY;
		}
	}

	hideBatteryLink() {
		if (!(this.showAirplanePowerModeSection ||
			(this.conservationModeStatus && this.conservationModeStatus.available) || (this.expressChargingStatus && this.expressChargingStatus.available) ||
			this.isChargeThresholdAvailable)) {
			this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, 'battery');
			this.commonService.setLocalStorageValue(LocalStorageKey.IsBatteryQuickSettingAvailable, false);
			this.updateBatteryLinkStatus(false);
			this.checkMenuItemsEmpty();
		} else {
			this.updateBatteryLinkStatus(true);
		}
	}

	showPowerSettings() {
		if (this.isDesktopMachine || (!this.showEasyResumeSection && !this.alwaysOnUSBStatus.available && !this.showFlipToBootSection$.value)) {
			this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, 'power');
			this.checkMenuItemsEmpty();
		}
	}

	hideOtherSettingsLink() {
		if (this.vantageToolbarStatus && !this.vantageToolbarStatus.available) {
			this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, 'other');
			this.checkMenuItemsEmpty();
		}
	}

	checkMenuItemsEmpty() {
		if (this.headerMenuItems.length === 0) {
			this.commonService.setLocalStorageValue(LocalStorageKey.IsHidePowerPage, true);
		} else {
			this.commonService.setLocalStorageValue(LocalStorageKey.IsHidePowerPage, false);
		}
	}

	public getEnergyStarCapability() {
		this.powerService.getEnergyStarCapability()
			.then((response: boolean) => {
				console.log('getEnergyStarCapability.then', response);

				this.isEnergyStarProduct = response;
				this.commonService.setLocalStorageValue(LocalStorageKey.EnergyStarCapability, this.isEnergyStarProduct);
			})
			.catch(error => {
				console.log('getEnergyStarCapability.error', error.message);
			});
	}

	public getFlipToBootCapability() {
		// think machine should pass through the procedure;
		if (+this.machineType === 1) {
			return;
		}
		this.powerService.getFlipToBootCapability()
			.then(res => {
				if (+res.ErrorCode === FlipToBootErrorCodeEnum.Succeed && +res.Supported === FlipToBootSupportedEnum.Succeed) {
					this.showFlipToBootSection$.next(true);
					this.toggleFlipToBootStatus = +res.CurrentMode === FlipToBootCurrentModeEnum.SucceedEnable;
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
}
