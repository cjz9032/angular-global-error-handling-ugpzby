import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PowerService } from 'src/app/services/power/power.service';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { DeviceService } from 'src/app/services/device/device.service';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

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

	toggleAlwaysOnUsbFlag = false;
	usbChargingCheckboxFlag = false;
	powerMode = PowerMode.Sleep;
	showEasyResumeSection = false;
	toggleEasyResumeStatus = false;
	showAirplanePowerModeSection = false;
	toggleAirplanePowerModeFlag = false;
	dYTCRevision = 0;
	cQLCapability = false;
	tIOCapability = false;
	showIntelligentCooling = 0;
	toggleIntelligentCooling = true;
	radioPerformance = false;
	radioQuietCool = false;
	toggleIntelligentCoolingStatus = false;
	manualModeSettingStatus: string;
	usbChargingInBatteryModeStatus = true;
	headerCaption =
		'This section enables you to dynamically adjust thermal performance and maximize the battery life.' +
		' It also has other popular power-related features.' +
		' You can check the default settings in this section and customize your system according to your needs.';
	headerMenuTitle = 'Jump to Settings';

	intelligentCooling = false;
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
				leftImageSource: ['far', 'gem'],
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
				leftImageSource: ['far', 'gem'],
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
				leftImageSource: ['far', 'gem'],
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
				leftImageSource: ['far', 'gem'],
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
			leftImageSource: ['far', 'gem'],
			header: 'Always on USB',
			subHeader:
				'Charge USB devices through the Always on USB connector on the computer, when the computer is in sleep, hibernation, or off mode. A smartphone or tablet can be charged quickly from the USB connector that is yellow-coded or silk-printed with these icons:',
			isCheckBoxVisible: true,
			isSwitchVisible: true,
			isSwitchChecked: this.toggleAlwaysOnUsbFlag,
			checkboxDesc: "Enable USB charging from battery power when the computer is off."
		},
		{
			readMoreText: 'Read More',
			rightImageSource: ['far', 'question-circle'],
			leftImageSource: ['far', 'gem'],
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
			leftImageSource: ['far', 'gem'],
			header: 'Lenovo Vantage Toolbar',
			subHeader:
				'Pin Vantage Toolbar to the Windows task bar to easily get more battery details and access to your quick settings.',
			isCheckBoxVisible: true,
			isSwitchVisible: true
		}
	];
	changeBatteryMode(event, mode) {
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
				if (event.switchValue) {
					this.conservationModeStatus.status = !event.switchValue;
					this.setConservationModeStatusIdeaNoteBook(!event.switchValue);
				}
				this.expressChargingStatus.status = event.switchValue;
				this.setRapidChargeModeStatusIdeaNoteBook(event.switchValue);
			} else {
				if (event.switchValue) {
					this.expressChargingStatus.status = !event.switchValue;
					this.setRapidChargeModeStatusIdeaNoteBook(!event.switchValue);
				}
				this.conservationModeStatus.status = event.switchValue;
				this.setConservationModeStatusIdeaNoteBook(event.switchValue);
			}
		}
	}
	constructor(public powerService: PowerService,
		private deviceService: DeviceService,
		private commonService: CommonService,
		public modalService: NgbModal) { }

	onIntelligentCoolingToggle(event) {
		if (event.switchValue) {
			this.intelligentCooling = false;
		} else {
			this.intelligentCooling = true;
			this.radioPerformance = !event.switchValue;
		}
		this.setAutoModeSetting(event);

	}
	changeQuietCool(event) {
		console.log('cool');
		this.setManualModeSetting('Cool');
	}
	changePerformance(event) {
		console.log('perform');
		this.setManualModeSetting('Performance');
	}
	ngOnInit() {
		this.getMachineInfo();
		this.startMonitor();
		this.getVantageToolBarStatus();
	}

	ngOnDestroy() {
		this.stopMonitor();
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
						this.getDYTCRevision();
						this.getAndSetAlwaysOnUSBForBrands(this.machineBrand);
					}).catch(error => {
						console.error('getMachineInfo', error);
					});
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	// Power Smart Settings
	private getDYTCRevision() {
		try {
			if (this.powerService.isShellAvailable) {
				this.powerService
					.getDYTCRevision()
					.then((value: number) => {
						console.log('getDYTCRevision.then', value);
						//	value=5;
						if (value === 4) {
							this.showIntelligentCooling = 2;
							this.getCQLCapability();
							this.getTIOCapability();
							console.log(this.cQLCapability);
							console.log(this.tIOCapability);

							if (this.cQLCapability === true && this.tIOCapability === true) {
								console.log('inside false of CQLCCapability and TIOCCapability');
								this.toggleIntelligentCooling = true;
								this.intelligentCooling = true;
								this.toggleIntelligentCoolingStatus = true;
							} else {
								this.toggleIntelligentCooling = false;
								this.toggleIntelligentCoolingStatus = false;
								this.intelligentCooling = true;
								if (this.cQLCapability === false) {
									this.SetPerformanceAndCool('performance');
								} else {
									this.getManualModeSetting();
								}
								//
								// this.manualModeSettingStatus = 'error';

							}
						} else if (value === 5) {
							this.showIntelligentCooling = 3;

						} else {
							this.showIntelligentCooling = 0;
							this.headerMenuItems.splice(0, 1);
						}
					})
					.catch(error => {
						console.error('getDYTCRevision', error);
					});
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	private SetPerformanceAndCool(status: string) {
		switch (status) {
			case 'cool':
				console.log('manualModeSettingStatus: cool');
				this.radioQuietCool = true;
				//this.toggleIntelligentCooling = true;
				//this.toggleIntelligentCoolingStatus = false;
				//this.intelligentCooling = true;
				break;
			case 'performance':
				this.radioPerformance = true;
				//this.toggleIntelligentCooling = true;
				//this.toggleIntelligentCoolingStatus = false;
				//	this.intelligentCooling = true;
				console.log('manualModeSettingStatus: performance');
				break;
			case 'error':
				this.toggleIntelligentCooling = false;
				console.log('manualModeSettingStatus: error');
				break;
		}
	}
	private getCQLCapability() {
		try {
			if (this.powerService.isShellAvailable) {
				this.powerService
					.getCQLCapability()
					.then((value: boolean) => {
						console.log('getCQLCapability.then', value);
						this.cQLCapability = value;
					})
					.catch(error => {
						console.error('getCQLCapability', error);
					});
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	private getTIOCapability() {
		try {
			if (this.powerService.isShellAvailable) {
				this.powerService
					.getTIOCapability()
					.then((value: boolean) => {
						console.log('getTIOCapability.then', value);
						this.tIOCapability = value;
					})
					.catch(error => {
						console.error('getTIOCapability', error);
					});
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	private setAutoModeSetting(event: any) {
		try {
			if (this.powerService.isShellAvailable) {
				this.powerService
					.setAutoModeSetting(event.switchValue)
					.then((value: boolean) => {
						console.log('setAutoModeSetting.then', value);

					})
					.catch(error => {
						console.error('setAutoModeSetting', error);
					});
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	private setManualModeSetting(arg: string) {
		try {
			if (this.powerService.isShellAvailable) {
				this.powerService
					.setManualModeSetting(arg)
					.then((value: boolean) => {
						console.log('setManualModeSetting.then', value);
						this.getManualModeSetting();
					})
					.catch(error => {
						console.error('setManualModeSetting', error);
					});
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	private getManualModeSetting() {
		try {
			if (this.powerService.isShellAvailable) {
				this.powerService
					.getManualModeSetting()
					.then((value: string) => {
						console.log('getManualModeSetting.then', value);
						this.manualModeSettingStatus = value;
						this.SetPerformanceAndCool(this.manualModeSettingStatus);
					})
					.catch(error => {
						console.error('getManualModeSetting', error);
					});
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	// End Power Smart Settings

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
	private setConservationModeStatusIdeaNoteBook(status: any) {
		try {
			console.log('setConservationModeStatusIdeaNoteBook.then', status);
			if (this.powerService.isShellAvailable) {
				this.powerService
					.setConservationModeStatusIdeaNoteBook(status)
					.then((value: boolean) => {
						console.log('setConservationModeStatusIdeaNoteBook.then', value);
						//this.getConservationModeStatusIdeaPad();
					})
					.catch(error => {
						console.error('setConservationModeStatusIdeaNoteBook', error);
					});
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	private setRapidChargeModeStatusIdeaNoteBook(status) {
		try {
			console.log('setRapidChargeModeStatusIdeaNoteBook.then', status);
			if (this.powerService.isShellAvailable) {
				this.powerService
					.setRapidChargeModeStatusIdeaNoteBook(status)
					.then((value: boolean) => {
						console.log('setRapidChargeModeStatusIdeaNoteBook.then', value);
						//this.getRapidChargeModeStatusIdeaPad();
					})
					.catch(error => {
						console.error('setRapidChargeModeStatusIdeaNoteBook', error);
					});
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
						console.error('getEyeCareModeState', error);
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
						console.error('onEyeCareModeStatusToggle', error);
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
}
