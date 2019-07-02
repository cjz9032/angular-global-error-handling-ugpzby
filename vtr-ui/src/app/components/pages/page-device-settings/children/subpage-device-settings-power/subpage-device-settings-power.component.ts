import { Component, OnInit, TemplateRef, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PowerService } from 'src/app/services/power/power.service';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { DeviceService } from 'src/app/services/device/device.service';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { BatteryDetailService } from 'src/app/services/battery-detail/battery-detail.service';
import { SmartStandby } from 'src/app/data-models/device/smart-standby.model';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { EventTypes } from '@lenovo/tan-client-bridge';
import { ChargeThresholdInformation } from 'src/app/enums/battery-information.enum';


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
	title = 'Power Settings';
	machineBrand: number;
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
	public currentBatteryChargeVal: number;
	private batteryCountStatusEventRef: any;

	chargeOptions: number[] = [40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
	startAtChargeOptions: number[] = this.chargeOptions.slice(0, this.chargeOptions.length - 1);
	stopAtChargeOptions: number[] = this.chargeOptions.slice(1, this.chargeOptions.length);

	toggleAlwaysOnUsbFlag = false;
	usbChargingCheckboxFlag = false;
	powerMode = PowerMode.Sleep;
	showEasyResumeSection = false;
	toggleEasyResumeStatus = false;
	showAirplanePowerModeSection = false;
	toggleAirplanePowerModeFlag = false;
	usbChargingInBatteryModeStatus = true;
	headerCaption =
		'This section enables you to dynamically adjust thermal performance and maximize the battery life.' +
		' It also has other popular power-related features.' +
		' You can check the default settings in this section and customize your system according to your needs.';
	headerMenuTitle = 'Jump to Settings';
	isDesktopMachine = true;
	showBatteryThreshold = false;
	value = 1;
	headerMenuItems = [
		{
			title: 'device.deviceSettings.power.jumpto.cooling',
			path: 'cooling'
		},
		{
			title: 'device.deviceSettings.power.jumpto.battery',
			path: 'battery',
		},
		{
			title: 'device.deviceSettings.power.jumpto.power',
			path: 'power'
		},
		{
			title: 'device.deviceSettings.power.jumpto.other',
			path: 'other'
		}
	];
	batterySettings = {
		status: {
			airplanePowerMode: false,
			batteryChargeThreshold: false,
			expressCharging: true,
			conservationMode: false
		},
		items: [
			{
				readMoreText: 'Read More',
				rightImageSource: ['far', 'question-circle'],
				leftImageSource: ['fal', 'plane'],
				header: 'Airplane Power Mode',
				subHeader: ' Protect the airplane AC power outlet by controlling the power consumption of your system. When Airplane Power Mode is enabled, the computer reduces power consumption by limiting the battery charging rate and system performance.',
				isCheckBoxVisible: true,
				isSwitchVisible: true,
				tooltipText:
					'Protect the airplane AC power outlet by controlling the power consumption of your system. When Airplane Power Mode is enabled, the computer reduces power consumption by limiting the battery charging rate and system performance.'
			},
			{
				readMoreText: 'Read More',
				rightImageSource: ['far', 'question-circle'],
				leftImageSource: ['fal', 'battery-half'],
				header: 'Battery Charge Threshold',
				subHeader:
					'If you primarily use your computer with the AC adapter attached and only infrequently use battery power, you can increase the lifespan of the battery by setting the maximum charge value to below 100%. This is useful because batteries that are used infrequently have a longer lifespan when they are maintained at less than a full charge.',
				isCheckBoxVisible: false,
				isSwitchVisible: false,
				tooltipText:
					`If your battery is currently charged above the stop-charging threshold, detach the power until the battery discharges to or below the stop-charging threshold.
					Depending on the battery status (old or new), the exact point at which the charging starts or stops might vary by up to 2 percentage points. If you enable the feature, it is recommended that you perform a Battery Gauge Reset occasionally to ensure an accurate report of the battery health.`
			},
			{
				readMoreText: 'Read More',
				rightImageSource: ['far', 'question-circle'],
				leftImageSource: ['fal', 'battery-bolt'],
				header: 'Express Charging',
				subHeader:
					'Express Charge allows your battery to a full charge much faster than normal mode.',
				isCheckBoxVisible: false,
				isSwitchVisible: false,
				tooltipText:
					'Express Charge allows you to charge your system battery much faster but this may reduce the lifetime of the battery.'
			},
			{
				readMoreText: 'Read More',
				rightImageSource: ['far', 'question-circle'],
				leftImageSource: ['fal', 'battery-quarter'],
				header: 'Conservation Mode',
				subHeader:
					`This function is useful to  extend the lifespan of your battery when plugged. <br>
			When this mode is enabled, the battery will only be charged to 55-60% of capacity and the battery lifespan can be maximized. However, this will shorten the time you use your computer after it is disconnected from the AC power source.`,
				isCheckBoxVisible: false,
				isSwitchVisible: false,
				tooltipText:
					'When enabled, your battery will only charge to 55-60%. This will shorten the amount of time you can use your computer when disconnected from an AC power source, but it will maximize the amount of time before you will need to replace your computer\'s battery.'
			}
		]
	};
	// removed from conservation mode <br>Note: Express Charging and Conservation mode cannot work at the same time. IF one of the modes is turned on, the other one will be automatically turned off.
	powerSettings = [
		{
			readMoreText: 'Read More',
			rightImageSource: [],
			leftImageSource: ['fab', 'usb'],
			header: 'Always on USB',
			subHeader:
				'Charge USB devices through the Always on USB connector on the computer, when the computer is in sleep, hibernation, or off mode. A smartphone or tablet can be charged quickly from the USB connector that is yellow-coded or silk-printed with these icons:',
			isCheckBoxVisible: true,
			isSwitchVisible: true,
			isSwitchChecked: this.toggleAlwaysOnUsbFlag,
			checkboxDesc: 'Enable USB charging from battery power when the computer is off.'
		},
		{
			readMoreText: 'Read More',
			rightImageSource: ['far', 'question-circle'],
			leftImageSource: ['fal', 'tachometer-fastest '],
			header: 'Easy Resume',
			subHeader:
				`Enable this feature to improve your resume time if you frequently open and close your computer's lid.`,
			isCheckBoxVisible: false,
			isSwitchVisible: false,
			isSwitchChecked: false,
			tooltipText:
				`This feature will improve your resume time if you frequently open and close your computer’s lid.
				When enabled, your computer will enter a low power mode when you close its lid, but it will resume instantly if you reopen your lid within 15 minutes of closing it. This feature also allows your notebook
				to attempt to finish pending activities (such as sending email or downloading a file) before the system goes into suspend.`
		}
	];

	otherSettings = [
		{
			readMoreText: 'Read More',
			rightImageSource: ['far', 'question-circle'],
			leftImageSource: ['fal', 'thumbtack'],
			header: 'Lenovo Vantage Toolbar',
			subHeader:
				'Pin Vantage Toolbar to the Windows task bar to easily get more battery details and access to your quick settings.',
			isCheckBoxVisible: true,
			isSwitchVisible: true
		}
	];
	async changeBatteryMode(event, mode) {
		// console.log(event.switchValue);
		// console.log('initially conservationMode:' + this.batterySettings.status.conservationMode);
		// console.log('initially expressCharging:' + this.batterySettings.status.expressCharging);
		// if (mode !== undefined) {
		// 	if (mode === 'expressCharging') {
		// 		this.batterySettings.status.expressCharging = event.switchValue;
		// 		this.batterySettings.status.conservationMode = !this.batterySettings.status.expressCharging;
		// 	} else {
		// 		this.batterySettings.status.conservationMode = event.switchValue;
		// 		this.batterySettings.status.expressCharging = !this.batterySettings.status.conservationMode;
		// 	}
		// }
		// console.log(event.switchValue);
		// console.log('after conservationMode :' + this.batterySettings.status.conservationMode);
		// console.log('after expressCharging :' + this.batterySettings.status.expressCharging);
		if (mode !== undefined) {
			if (mode === 'expressCharging') {
				this.conservationModeLock = true;
				this.expressChargingLock = false;
				if (this.conservationModeStatus.status === true && event.switchValue) {
					await this.setConservationModeStatusIdeaNoteBook(!event.switchValue);
					await this.setRapidChargeModeStatusIdeaNoteBook(event.switchValue);
					this.conservationModeStatus.status = !event.switchValue;
					this.expressChargingStatus.status = event.switchValue;
				} else if (this.conservationModeStatus.status !== true && event.switchValue) {
					await this.setRapidChargeModeStatusIdeaNoteBook(event.switchValue);
					this.expressChargingStatus.status = event.switchValue;
				} else if (this.conservationModeStatus.status !== true && !event.switchValue) {
					await this.setRapidChargeModeStatusIdeaNoteBook(event.switchValue);
					this.expressChargingStatus.status = !event.switchValue;
				}
				this.conservationModeLock = false;
			} else if (mode === 'conservationMode') {
				this.conservationModeLock = false;
				this.expressChargingLock = true;
				if (this.expressChargingStatus.status === true && event.switchValue) {
					await this.setRapidChargeModeStatusIdeaNoteBook(!event.switchValue);
					await this.setConservationModeStatusIdeaNoteBook(event.switchValue);
					this.expressChargingStatus.status = !event.switchValue;
					this.conservationModeStatus.status = event.switchValue;
				} else if (this.expressChargingStatus.status !== true && event.switchValue) {
					await this.setConservationModeStatusIdeaNoteBook(event.switchValue);
					this.conservationModeStatus.status = event.switchValue;
				} else if (this.expressChargingStatus.status !== true && !event.switchValue) {
					await this.setConservationModeStatusIdeaNoteBook(event.switchValue);
					this.conservationModeStatus.status = !event.switchValue;
				}
				this.expressChargingLock = false;
			}
		}
	}
	constructor(public powerService: PowerService,
		private deviceService: DeviceService,
		private commonService: CommonService,
		public modalService: NgbModal,
		private batteryService: BatteryDetailService,
		public shellServices: VantageShellService) { }

	ngOnInit() {
		this.isDesktopMachine = this.commonService.getLocalStorageValue(LocalStorageKey.DesktopMachine);
		this.machineType = this.commonService.getLocalStorageValue(LocalStorageKey.MachineType);
		if (this.isDesktopMachine) {
			this.headerMenuItems.splice(0, 1);
		}
		this.hideBatteryLink();
		this.getMachineInfo();
		this.startMonitor();
		this.getVantageToolBarStatus();
		if (this.machineType === 1) {
			this.batteryCountStatusEventRef = this.getBatterStatusEvent.bind(this);
			this.getBatteryThresholdInformation();
		}
		this.getEnergyStarCapability();

		this.shellServices.registerEvent(EventTypes.pwrBatteryStatusEvent, this.batteryCountStatusEventRef);
	}

	ngOnDestroy() {
		this.stopMonitor();
		this.shellServices.unRegisterEvent(EventTypes.pwrBatteryStatusEvent, this.batteryCountStatusEventRef);

	}

	openContextModal(template: TemplateRef<any>) {
		this.modalService.open(template, {
			windowClass: 'read-more'
		});
	}
	closeContextModal() {
		this.modalService.dismissAll();
	}
	getAndSetAlwaysOnUSBForBrands(machineName: any) {
		console.log('inside getAndSetAlwaysOnUSBForBrands');
		console.log('machine', machineName);

		switch (machineName) {
			case 1:
				this.getAirplaneModeCapabilityThinkPad();
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
	onUsbChargingStatusChange() {
		console.log('usb charge state entered');
		this.updatePowerMode();
	}

	onToggleOfAlwaysOnUsb(event) {
		this.toggleAlwaysOnUsbFlag = event.switchValue;
		switch (this.machineBrand) {
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
		switch (this.machineBrand) {
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
		switch (this.machineBrand) {
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
		switch (this.machineBrand) {
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
	private getMachineInfo() {
		try {
			if (this.deviceService.isShellAvailable) {
				this.deviceService.getMachineType()
					.then((value: any) => {
						console.log('getMachineInfo.then', value);
						this.machineBrand = value;
						// .subBrand.toLowerCase();
						// 0  means "ideaPad"
						// 1  means "thinkPad"
						// 2 means "ideaCenter"
						// 3 means "thinkCenter"
						console.log('getMachineInfo.then', this.machineBrand);
						this.getAndSetAlwaysOnUSBForBrands(this.machineBrand);
					}).catch(error => {
						console.error('getMachineInfo', error);
					});
			}
		} catch (error) {
			console.error(error.message);
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
						if (this.alwaysOnUSBStatus.status) {
							this.toggleAlwaysOnUsbFlag = true;
						}
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

				// await	this.powerService
				// 		.setConservationModeStatusIdeaNoteBook(status)
				// 		.then((value: boolean) => {
				// 			console.log('setConservationModeStatusIdeaNoteBook.then', value);
				// 			//this.getConservationModeStatusIdeaPad();
				// 		})
				// 		.catch(error => {
				// 			console.error('setConservationModeStatusIdeaNoteBook', error);
				// 		});
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	private async setRapidChargeModeStatusIdeaNoteBook(status) {
		try {
			console.log('setRapidChargeModeStatusIdeaNoteBook.then', status);

			if (this.powerService.isShellAvailable) {
				const value = this.powerService
					.setRapidChargeModeStatusIdeaNoteBook(status);
				console.log('setRapidChargeModeStatusIdeaNoteBook.then', value);
				// this.powerService
				// 	.setRapidChargeModeStatusIdeaNoteBook(status)
				// 	.then((value: boolean) => {
				// 		console.log('setRapidChargeModeStatusIdeaNoteBook.then', value);
				// 		//this.getRapidChargeModeStatusIdeaPad();
				// 	})
				// 	.catch(error => {
				// 		console.error('setRapidChargeModeStatusIdeaNoteBook', error);
				// 	});
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
	path: string */
	public launchSystemUri(path: string) {
		console.log('system uri called ', path);
		if (path) {
			this.deviceService.launchUri(path);
		}
	}

	hidePowerSmartSetting(hide: boolean) {
		this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, 'cooling');
	}

	// start battery threshold settings
	private getBatterStatusEvent(response) {
		// console.log('Event response here---------------....>%%%%%%%%%%%?>', response)
		this.responseData = response;
		this.getBatteryThresholdInformation();
	}
	public getBatteryThresholdInformation() {
		if (this.powerService.isShellAvailable) {
			this.powerService
				.getChargeThresholdInfo()
				.then((res) => {
					this.responseData = res || [];
					// this.responseData = [{batteryNum: 1, startValue: 25, stopValue: 95, checkBoxValue : true, isOn: true, isCapable: true},
					// {batteryNum:2, startValue: 57, stopValue: 78, checkBoxValue : false, isOn: true}];
					this.commonService.sendNotification(ChargeThresholdInformation.ChargeThresholdInfo, res);
					if (this.responseData && this.responseData.length > 0) {
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
					}
					this.getBatteryCharge();
				})
				.catch(error => {
					console.error('', error);
				});
		}
	}
	private getBatteryCharge() {
		this.currentBatteryChargeVal = this.commonService.getLocalStorageValue(LocalStorageKey.BatteryPercentage);
		if (this.currentBatteryChargeVal > this.selectedStopAtChargeVal1 || this.currentBatteryChargeVal > this.selectedStopAtChargeVal) {
			this.showWarningMsg = true;
		} else {
			this.showWarningMsg = false;
		}
	}
	public showBatteryThresholdsettings(event) {
		this.showBatteryThreshold = event;
		// console.log(this.showBatteryThreshold);
		if (this.showBatteryThreshold) {
			this.responseData.forEach(batteryInfo => {
				this.setChargeThresholdValues(batteryInfo, batteryInfo.batteryNum, 'changedValues');
			})
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
		if (batteryNum == 1) {
			this.selectedStopAtChargeVal = batteryDetails.stopValue;
		}
		if (batteryNum == 2) {
			this.selectedStopAtChargeVal1 = batteryDetails.stopValue;
		}
		if (this.currentBatteryChargeVal > this.selectedStopAtChargeVal1 || this.currentBatteryChargeVal > this.selectedStopAtChargeVal) {
			this.showWarningMsg = true;
		} else {
			this.showWarningMsg = false;
		}
		try {
			if (this.powerService.isShellAvailable) {
				batteryInfo = {
					batteryNumber: batteryNum,
					startValue: batteryDetails.startValue,
					stopValue: batteryDetails.stopValue,
					checkBoxValue: batteryDetails.checkBoxValue
				};
				if (inputString == 'changedValues') {
					// console.log('chnaged values here------------>');
					this.powerService
						.setChargeThresholdValue(batteryInfo)
						.then((value: any) => {
							// console.log('change threshold value------------------->>>>>>>>>', value);
							this.getBatteryThresholdInformation();
						})
						.catch(error => {
							console.error('change threshold value', error);
						});
				} else {
					if (inputString == 'autoChecked') {
						// console.log('auto checked values here------------>');
						this.powerService.setCtAutoCheckbox(batteryInfo);
					}
				}
			}
		} catch (error) {
			console.error(error.message);
		}
	}

	hideBatteryLink() {
		if (this.isDesktopMachine) {
			// hide battery like
			this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, 'battery');
		}

	}

	showPowerSettings() {

		if (!(!this.isDesktopMachine || this.showEasyResumeSection)) {
			this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, 'power');
		}

		// return !this.isDesktopMachine || this.showEasyResumeSection || this.usbChargingInBatteryModeStatus;
		return !this.isDesktopMachine || this.showEasyResumeSection;
		// return !this.isDesktopMachine || this.showEasyResumeSection;
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
