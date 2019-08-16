import { Component, OnInit, TemplateRef, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PowerService } from 'src/app/services/power/power.service';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { DeviceService } from 'src/app/services/device/device.service';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { BatteryDetailService } from 'src/app/services/battery-detail/battery-detail.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { EventTypes } from '@lenovo/tan-client-bridge';
import { ChargeThresholdInformation } from 'src/app/enums/battery-information.enum';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { Subscription } from 'rxjs/internal/Subscription';


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
	headerMenuItems = [
		{
			title: 'device.deviceSettings.power.powerSmartSettings.title',
			path: 'smartSettings'
		},
		{
			title: 'device.deviceSettings.power.smartStandby.title',
			path: 'smartStandby'
		},
		{
			title: 'device.deviceSettings.power.batterySettings.title',
			path: 'battery',
		},
		{
			title: 'device.deviceSettings.power.powerSettings.title',
			path: 'power'
		},
		{
			title: 'device.deviceSettings.power.otherSettings.title',
			path: 'other'
		}
	];
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
	}
	constructor(public powerService: PowerService, private deviceService: DeviceService, private commonService: CommonService, public modalService: NgbModal, public shellServices: VantageShellService) { }

	ngOnInit() {
		this.isDesktopMachine = this.commonService.getLocalStorageValue(LocalStorageKey.DesktopMachine);
		this.machineType = this.commonService.getLocalStorageValue(LocalStorageKey.MachineType);

		if (this.isDesktopMachine) {
			this.headerMenuItems.splice(0, 1);
			this.headerMenuItems.splice(0, 1);
			this.headerMenuItems.splice(0, 1);
		}
		this.getBatteryAndPowerSettings(this.machineType);
		this.startMonitor();
		this.getVantageToolBarStatus();

		this.getEnergyStarCapability();

		this.shellServices.registerEvent(EventTypes.pwrBatteryStatusEvent, this.batteryCountStatusEventRef);

		this.thresholdWarningSubscription = this.commonService.notification.subscribe((notification: AppNotification) => {
			this.getBatteryCharge(notification);
		});

	}

	ngOnDestroy() {
		this.thresholdWarningSubscription.unsubscribe();
		this.stopMonitor();
		this.shellServices.unRegisterEvent(EventTypes.pwrBatteryStatusEvent, this.batteryCountStatusEventRef);

	}

	onSetSmartStandbyCapability(event: boolean) {
		if (!event) {
			this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, 'smartStandby');
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
				this.getBatteryThresholdInformation();
				await this.getAirplaneModeCapabilityThinkPad();
				await this.getAlwaysOnUSBCapabilityThinkPad();
				await this.getEasyResumeCapabilityThinkPad();
				break;
			case 0:
				await this.getConservationModeStatusIdeaPad();
				await this.getRapidChargeModeStatusIdeaPad();
				await this.getAlwaysOnUSBStatusIdeaPad();
				await this.getUSBChargingInBatteryModeStatusIdeaNoteBook();
				break;
		}
		this.hideBatteryLink();
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
		this.updatePowerMode();
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
			this.powerService
				.getAlwaysOnUSBCapabilityThinkPad()
				.then((value: boolean) => {
					console.log('getAlwaysOnUSBCapabilityThinkPad.then', value);
					this.alwaysOnUSBStatus.available = value;
					this.getAlwaysOnUSBStatusThinkPad();
				})
				.catch(error => {
					console.error('getAlwaysOnUSBCapabilityThinkPad', error);
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
						if (alwaysOnUsbThinkPad.isEnabled) {
							this.toggleAlwaysOnUsbFlag = true;
						}

					})
					.catch(error => {
						console.error('getAlwaysOnUSBStatusThinkPad', error);
					});
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	private getEasyResumeCapabilityThinkPad() {
		try {
			if (this.powerService.isShellAvailable) {
				this.powerService
					.getEasyResumeCapabilityThinkPad()
					.then((value: any) => {
						console.log('getEasyResumeCapabilityThinkPad.then', value);
						if (value === true) {
							this.showEasyResumeSection = true;
							this.getEasyResumeStatusThinkPad();
						} else {
							this.showEasyResumeSection = false;
						}
					})
					.catch(error => {
						console.error('getEasyResumeCapabilityThinkPad', error);
					});
			}
		} catch (error) {
			console.error(error.message);
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
					})
					.catch(error => {
						console.error('getEasyResumeStatusThinkPad', error);
					});
			}
		} catch (error) {
			console.error(error.message);
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
						console.error('setEasyResumeThinkPad', error);
					});
			}
		} catch (error) {
			console.error(error.message);
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
						console.error('setAlwaysOnUSBStatusThinkPad', error);
					});
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	private getAirplaneModeCapabilityThinkPad() {
		console.log('getAirplaneModeCapabilityThinkPad ');
		if (this.powerService.isShellAvailable) {
			this.powerService
				.getAirplaneModeCapabilityThinkPad()
				.then((value: boolean) => {
					console.log('getAirplaneModeCapabilityThinkPad.then', value);
					this.showAirplanePowerModeSection = value;
					if (this.showAirplanePowerModeSection) {
						this.getAirplaneModeThinkPad();
					}
				})
				.catch(error => {
					console.error('getAirplaneModeCapabilityThinkPad', error);
				});
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
					})
					.catch(error => {
						console.error('getAirplaneModeThinkPad', error);
					});
			}
		} catch (error) {
			console.error(error.message);
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
						console.error('setAirplaneModeThinkPad', error);
					});
			}
		} catch (error) {
			console.error(error.message);
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
					})
					.catch(error => {
						console.error('getAirplaneModeAutoDetectionOnThinkPad', error);
					});
			}
		} catch (error) {
			console.error(error.message);
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
						console.error('setAirplaneModeAutoDetectionOnThinkPad', error);
					});
			}
		} catch (error) {
			console.error(error.message);
		}
	}

	onAirplaneAutoModeStatusChange() {
		console.log('onAirplaneAutoModeStatusChange', this.airplaneAutoDetection);
		this.setAirplaneModeAutoDetectionOnThinkPad(this.airplaneAutoDetection);
	}
	// End ThinkPad

	// Start IdeaNoteBook
	private getAlwaysOnUSBStatusIdeaPad() {
		try {
			if (this.powerService.isShellAvailable) {
				this.powerService
					.getAlwaysOnUSBStatusIdeaNoteBook()
					.then((featureStatus: FeatureStatus) => {
						console.log('getAlwaysOnUSBStatusIdeaNoteBook.then', featureStatus);
						this.alwaysOnUSBStatus = featureStatus;
						this.toggleAlwaysOnUsbFlag = this.alwaysOnUSBStatus.status;
					})
					.catch(error => {
						console.error('getAlwaysOnUSBStatusIdeaNoteBook', error);
					});
			}
		} catch (error) {
			console.error(error.message);
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
						// if (this.alwaysOnUSBStatus.status) {
						// 	this.toggleAlwaysOnUsbFlag = true;
						// }
					})
					.catch(error => {
						console.error('getUSBChargingInBatteryModeStatusIdeaNoteBook', error);
					});
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	private setUSBChargingInBatteryModeStatusIdeaNoteBook(event: any) {
		try {
			if (this.powerService.isShellAvailable) {
				this.powerService
					.setUSBChargingInBatteryModeStatusIdeaNoteBook(event)
					.then((value: boolean) => {
						console.log('setUSBChargingInBatteryModeStatusIdeaNoteBook.then', value);
						this.getUSBChargingInBatteryModeStatusIdeaNoteBook();
					})
					.catch(error => {
						console.error('setUSBChargingInBatteryModeStatusIdeaNoteBook', error);
					});
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	private setAlwaysOnUSBStatusIdeaPad(event: any) {
		try {
			if (this.powerService.isShellAvailable) {
				this.powerService
					.setAlwaysOnUSBStatusIdeaNoteBook(event.switchValue)
					.then((value: boolean) => {
						console.log('setAlwaysOnUSBStatusIdeaNoteBook.then', value);
						this.getAlwaysOnUSBStatusIdeaPad();
					})
					.catch(error => {
						console.error('getAlwaysOnUSBStatusIdeaNoteBook', error);
					});
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	private getConservationModeStatusIdeaPad() {
		try {
			if (this.powerService.isShellAvailable) {
				this.powerService
					.getConservationModeStatusIdeaNoteBook()
					.then((featureStatus: FeatureStatus) => {
						console.log('getConservationModeStatusIdeaNoteBook.then', featureStatus);
						this.conservationModeStatus = featureStatus;
					})
					.catch(error => {
						console.error('getConservationModeStatusIdeaNoteBook', error);
					});
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	private getRapidChargeModeStatusIdeaPad() {
		try {
			if (this.powerService.isShellAvailable) {
				this.powerService
					.getRapidChargeModeStatusIdeaNoteBook()
					.then((featureStatus: FeatureStatus) => {
						console.log('getRapidChargeModeStatusIdeaNoteBook.then', featureStatus);
						this.expressChargingStatus = featureStatus;
					})
					.catch(error => {
						console.error('getRapidChargeModeStatusIdeaNoteBook', error);
					});
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	private async setConservationModeStatusIdeaNoteBook(status: any) {
		try {
			console.log('setConservationModeStatusIdeaNoteBook.then', status);
			if (this.powerService.isShellAvailable) {
				const value = await this.powerService
					.setConservationModeStatusIdeaNoteBook(status);
				console.log('setConservationModeStatusIdeaNoteBook.then', value);

			}
		} catch (error) {
			console.error(error.message);
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
			console.error(error.message);
		}
	}


	// End IdeaNoteBook
	// Start Lenovo Vantage ToolBar
	private getVantageToolBarStatus() {
		try {
			if (this.powerService.isShellAvailable) {
				this.powerService
					.getVantageToolBarStatus()
					.then((featureStatus: FeatureStatus) => {
						console.log('getVantageToolBarStatus.then', featureStatus);
						this.vantageToolbarStatus = featureStatus;
					})
					.catch(error => {
						console.error('getVantageToolBarStatus', error);
					});
			}
		} catch (error) {
			console.error(error.message);
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
						console.error('setVantageToolBarStatus', error);
					});
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	public getStartMonitorCallBack(featureStatus: FeatureStatus) {
		console.log('getStartMonitorCallBack', featureStatus);
		this.vantageToolbarStatus = featureStatus;
	}

	public startMonitor() {
		console.log('start eyecare monitor');
		if (this.powerService.isShellAvailable) {
			this.powerService
				.startMonitor(this.getStartMonitorCallBack.bind(this))
				.then((value: any) => {
					console.log('startmonitor', value);
				}).catch(error => {
					console.error('startmonitor', error);
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

	/**
	 * launchSystemUri
	 * path: string
	 */
	public launchSystemUri(path: string) {
		console.log('system uri called ', path);
		if (path) {
			this.deviceService.launchUri(path);
		}
	}

	hidePowerSmartSetting(hide: boolean) {
		this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, 'smartSettings');
	}

	// start battery threshold settings
	private getBatteryStatusEvent(response) {
		// console.log('Event response here---------------....>%%%%%%%%%%%?>', response)
		this.responseData = response;
		this.getBatteryThresholdInformation();
	}
	public getBatteryThresholdInformation() {
		let notification;
		if (this.powerService.isShellAvailable) {
			this.powerService
				.getChargeThresholdInfo()
				.then((res) => {
					this.responseData = res || [];
					if (this.responseData && this.responseData.length > 0) {
						this.isChargeThresholdAvailable = this.responseData[0].isCapable;
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
					}
					this.commonService.sendNotification(ChargeThresholdInformation.ChargeThresholdInfo, notification);
				})
				.catch(error => {
					console.error('', error);
				});
		}
	}

	private getBatteryCharge(notification: AppNotification) {
		if (notification && notification.type === 'ThresholdWarningNote') {
			this.showWarningMsg = notification.payload;
		}
	}

	public showBatteryThresholdsettings(event) {
		this.showBatteryThreshold = event;
		// console.log(this.showBatteryThreshold);
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
					console.error('change threshold value', error);
				});
		}

	}

	public setChargeThresholdValues(batteryDetails: any, batteryNum: number, inputString: string) {
		let batteryInfo: any = {};
		if (batteryNum === 1) {
			this.selectedStopAtChargeVal = batteryDetails.stopValue;
		}
		if (batteryNum === 2) {
			this.selectedStopAtChargeVal1 = batteryDetails.stopValue;
		}
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
							console.error('change threshold value', error);
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
			console.error(error.message);
		}
	}

	hideBatteryLink() {
		if (this.conservationModeStatus && this.expressChargingStatus && this.responseData && this.responseData.length > 0) {
			if (!(this.showAirplanePowerModeSection || this.conservationModeStatus.available || this.expressChargingStatus.available || this.responseData[0].isCapable)) {
				this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, 'battery');
			}
		}

	}

	showPowerSettings() {
		if (this.isDesktopMachine || (!this.showEasyResumeSection && !this.alwaysOnUSBStatus.available)) {
			this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, 'power');
			return false;
		}
		return true
	}

	private getEnergyStarCapability() {
		this.powerService.getEnergyStarCapability()
			.then((response: boolean) => {
				console.log('getEnergyStarCapability.then', response);

				this.isEnergyStarProduct = response;
			})
			.catch(error => {
				console.log('getEnergyStarCapability.error', error);
			});
	}
}
