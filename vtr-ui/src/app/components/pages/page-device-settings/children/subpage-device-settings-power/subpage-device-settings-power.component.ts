import { Component, OnInit, TemplateRef } from '@angular/core';
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
export class SubpageDeviceSettingsPowerComponent implements OnInit {
	title = 'Power Settings';
	machineBrand: string;
	public vantageToolbarStatus = new FeatureStatus(false, true);
	public alwaysOnUSBStatus = new FeatureStatus(false, true);
	public usbChargingStatus = new FeatureStatus(false, true);
	public easyResumeStatus = new FeatureStatus(false, true);
	public conservationModeStatus = new FeatureStatus(false, true);
	public expressChargingStatus = new FeatureStatus(false, true);

	toggleAlwaysOnUsbFlag = true;
	usbChargingCheckboxFlag = false;
	powerMode = PowerMode.Sleep;
	showEasyResumeSection = false;
	showAirplanePowerModeSection = false;
	toggleAirplanePowerModeFlag = true;
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
			title: 'Intelligent Cooling',
			path: 'cooling'
		},
		{
			title: 'Battery',
			path: 'battery',
		},
		{
			title: 'Power',
			path: 'power'
		},
		{
			title: 'Other',
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
			Depending on the battery status (old or new), the exact point at which the charging starts or stops might vary by up to 2 percentage points. If you enable the feature, it is recommended that you perform a Battery Gauge Reset occasionally to ensure an accurate report of the battery health.
			`
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
			When this mode is enabled, the battery will only be charged to 55-60% of capacity and the battery lifespan can be maximized. However, this will shorten the time you use your computer after it is disconnected from the AC power source.<br>Note: Express Charging and Conservation mode cannot work at the same time. IF one of the modes is turned on, the other one will be automatically turned off.	`,
				isCheckBoxVisible: false,
				isSwitchVisible: false,
				tooltipText:
					'When enabled, your battery will only charge to 55-60%. This will shorten the amount of time you can use your computer when disconnected from an AC power source, but it will maximize the amount of time before you will need to replace your computer\'s battery.'
			}
		]
	};

	powerSettings = [
		{
			readMoreText: 'Read More',
			rightImageSource: ['far', 'question-circle'],
			leftImageSource: ['far', 'gem'],
			header: 'Always on USB',
			subHeader:
				'Charge USB devices through the Always on USB connector on the computer when the computer is in sleep, hibernation, or off mode. A smartphone or tablet can be charged from the USB connector that is yellow-coded or silk-printed the specified icon.',
			isCheckBoxVisible: true,
			isSwitchVisible: true,
			isSwitchChecked: this.toggleAlwaysOnUsbFlag,
			tooltipText:
				`Charge USB devices through the Always on USB connector on the computer when the computer is in sleep, hibernation, or off mode.
				A smartphone or tablet can be charged from the USB connector that is yellow-coded or silk-printed the specified icon.`,
			checkboxDesc: "Enable USB charging from laptop battery when computer is off."
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
		if (mode !== undefined) {
			if (mode === 'expressCharging') {
				this.batterySettings.status.expressCharging = event.switchValue;
				this.batterySettings.status.conservationMode = !this.batterySettings.status.expressCharging;
			} else {
				this.batterySettings.status.conservationMode = event.switchValue;
				this.batterySettings.status.expressCharging = !this.batterySettings.status.conservationMode;
			}
		}
		// console.log(event.switchValue);
		// console.log('after conservationMode :' + this.batterySettings.status.conservationMode);
		// console.log('after expressCharging :' + this.batterySettings.status.expressCharging);
	}
	constructor(public powerService: PowerService,
		private deviceService: DeviceService,
		private commonService: CommonService,
		public modalService: NgbModal) { }

	onIntelligentCoolingToggle(event) {
		this.intelligentCooling = event.switchValue;
	}
	ngOnInit() {
		this.getMachineInfo();
		this.getVantageToolBarStatus();
		this.getDYTCRevision();
		this.getCQLCapability();
		this.getTIOCapability();
	}
	openContextModal(template: TemplateRef<any>) {
		this.modalService.open(template, {
			windowClass: 'read-more'
		});
	}
	closeContextModal() {
		this.modalService.dismissAll();
	}
	getAndSetAlwaysOnUSBForBrands(machinename: any) {
		console.log('inside getAndSetAlwaysOnUSBForBrands');
		switch (machinename) {
			case 'thinkpad':
				console.log('machine', machinename);
				this.getAirplaneModeCapabilityThinkPad();
				this.getAlwaysOnUSBCapabilityThinkPad();
				this.getAlwaysOnUSBStatusThinkPad();
				this.getEasyResumeCapabilityThinkPad();
				break;
			case 'ideapad':
				this.getConservationModeStatusIdeaPad();
				this.getAlwaysOnUSBStatusIdeaPad();
				this.getUSBChargingInBatteryModeStatusIdeaNoteBook();

				console.log('always on usb: ideapad');
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
			case 'thinkpad':
				if (this.toggleAlwaysOnUsbFlag && this.usbChargingCheckboxFlag) {
					this.powerMode = PowerMode.Shutdown;
				} else if (this.toggleAlwaysOnUsbFlag && !this.usbChargingCheckboxFlag) {
					this.powerMode = PowerMode.Sleep;
				} else {
					this.powerMode = PowerMode.Disabled;
				}
				this.setAlwaysOnUSBStatusThinkPad(this.powerMode);
				console.log('always on usb: thinkpad');
				break;
			case 'ideapad':
				this.setAlwaysOnUSBStatusIdeaPad(event);
				console.log('always on usb: ideapad');
				break;
		}
		this.updatePowerMode();
	}
	onToggleOfEasyResume(event) {
		switch (this.machineBrand) {
			case 'thinkpad':
				this.setEasyResumeThinkPad(event);
				console.log('Easy Resume: ThinkPad');
				break;
			case 'ideapad':
				console.log('easy resume: ideapad');
				break;
		}
	}
	onToggleOfAirplanePowerMode(event) {
		switch (this.machineBrand) {
			case 'thinkpad':
				this.setAirplaneModeThinkPad(event);
				console.log('Airplane Power mOde Set: ThinkPad');
				break;
			case 'ideapad':
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
			case 'thinkpad':
				console.log('always on usb: thinkpad');
				this.setAlwaysOnUSBStatusThinkPad(this.powerMode);
				break;
			case 'ideapad':
				this.setUSBChargingInBatteryModeStatusIdeaNoteBook(this.usbChargingCheckboxFlag);
				console.log('always on usb: ideapad');
				break;
		}
	}
	private getMachineInfo() {
		try {
			if (this.deviceService.isShellAvailable) {
				this.deviceService.getMachineInfo()
					.then((value: any) => {
						console.log('getMachineInfo.then', value);
						this.machineBrand = value.subBrand.toLowerCase();
						console.log('getMachineInfo.then', this.machineBrand.toLowerCase());
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
					})
					.catch(error => {
						console.error('getDYTCRevision', error);
					});
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	private getCQLCapability() {
		try {
			if (this.powerService.isShellAvailable) {
				this.powerService
					.getCQLCapability()
					.then((value: boolean) => {
						console.log('getCQLCapability.then', value);

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
						this.getUSBChargingInBatteryModeStatusIdeaNoteBook();
					})
					.catch(error => {
						console.error('setAutoModeSetting', error);
					});
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	private setManualModeSetting(event: any) {
		try {
			if (this.powerService.isShellAvailable) {
				this.powerService
					.setManualModeSetting(event.switchValue)
					.then((value: boolean) => {
						console.log('setManualModeSetting.then', value);
						this.getUSBChargingInBatteryModeStatusIdeaNoteBook();
					})
					.catch(error => {
						console.error('setManualModeSetting', error);
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
						console.log('setEasyResumeThinkPad.then', value);
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
	private setAlwaysOnUSBStatusThinkPad(event: any) {
		try {
			console.log('setAlwaysOnUSBStatusIdeaNoteBook.then', event);
			if (this.powerService.isShellAvailable) {
				this.powerService
					.setAlwaysOnUSBStatusThinkPad(event)
					.then((value: boolean) => {
						console.log('setAlwaysOnUSBStatusIdeaNoteBook.then', value);
						this.getAlwaysOnUSBStatusThinkPad();
					})
					.catch(error => {
						console.error('getAlwaysOnUSBStatusIdeaNoteBook', error);
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
					.setAirplaneModeThinkPad(event)
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
						this.usbChargingCheckboxFlag = featureStatus.status;
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
	private setConservationModeStatusIdeaNoteBook(event: any) {
		try {
			if (this.powerService.isShellAvailable) {
				this.powerService
					.setConservationModeStatusIdeaNoteBook(event.switchValue)
					.then((value: boolean) => {
						console.log('setConservationModeStatusIdeaNoteBook.then', value);
						this.getConservationModeStatusIdeaPad();
					})
					.catch(error => {
						console.error('setConservationModeStatusIdeaNoteBook', error);
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
						console.log('getConservationModeStatusIdeaNoteBook.then', featureStatus);
						this.expressChargingStatus = featureStatus;
					})
					.catch(error => {
						console.error('getConservationModeStatusIdeaNoteBook', error);
					});
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	private setRapidChargeModeStatusIdeaNoteBook(event: any) {
		try {
			if (this.powerService.isShellAvailable) {
				this.powerService
					.setRapidChargeModeStatusIdeaNoteBook(event.switchValue)
					.then((value: boolean) => {
						console.log('setConservationModeStatusIdeaNoteBook.then', value);
						this.getRapidChargeModeStatusIdeaPad();
					})
					.catch(error => {
						console.error('setConservationModeStatusIdeaNoteBook', error);
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
	// End Lenovo Vantage ToolBar
}
