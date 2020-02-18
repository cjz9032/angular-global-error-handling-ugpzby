import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { DropDownInterval } from '../../../data-models/common/drop-down-interval.model';
import { TranslateService } from '@ngx-translate/core';
import { DisplayService } from 'src/app/services/display/display.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { EMPTY } from 'rxjs';

@Component({
	selector: 'vtr-oled-power-settings',
	templateUrl: './oled-power-settings.component.html',
	styleUrls: ['./oled-power-settings.component.scss']
})
export class OledPowerSettingsComponent implements OnInit {
	@Input() description: any;
	@Input() hasOLEDPowerControlCapability;
	title: string;
	public intervals: DropDownInterval[];
	public taskBarDimmerValue: number;
	public backgroundDimmerValue: number;
	public displayDimmerValue: number;

	constructor(
		public displayService: DisplayService,
		private logger: LoggerService,
		private translate: TranslateService) { }

	ngOnInit() {
		this.populateIntervals();
		this.initOledSettings();
	}

	ngOnChanges(changes: SimpleChanges) {
		// only run when property "data" changed
		if (changes.hasOLEDPowerControlCapability) {
			this.logger.info(' hasOLEDPowerControlCapability value changed', this.hasOLEDPowerControlCapability);
			this.initOledSettings();
		}
	}

	private populateIntervals() {
		const seconds = this.translate.instant('device.deviceSettings.displayCamera.display.oledPowerSettings.dropDown.seconds'); // '';
		const minute = this.translate.instant('device.deviceSettings.displayCamera.display.oledPowerSettings.dropDown.minute'); // 'minute';
		const minutes = this.translate.instant('device.deviceSettings.displayCamera.display.oledPowerSettings.dropDown.minutes');  // 'minutes';
		const alwaysOn = this.translate.instant('device.deviceSettings.displayCamera.display.oledPowerSettings.dropDown.alwaysOn'); // 'Always on';
		const never = this.translate.instant('device.deviceSettings.displayCamera.display.oledPowerSettings.dropDown.never'); // 'Never';
		const halfTime = this.translate.instant('device.deviceSettings.displayCamera.display.oledPowerSettings.dropDown.halfTime'); // 'Half time of display off timer';

		this.intervals = [{
			name: alwaysOn,
			value: 0,
			placeholder: '',
			text: alwaysOn
		},
		{
			name: '30',
			value: 1,
			placeholder: seconds,
			text: `30 ${seconds}`
		},
		{
			name: '1',
			value: 2,
			placeholder: minute,
			text: `1 ${minute}`
		},
		{
			name: '2',
			value: 3,
			placeholder: minutes,
			text: `2 ${minutes}`
		},
		{
			name: '3',
			value: 4,
			placeholder: minutes,
			text: `3 ${minutes}`
		},
		{
			name: '5',
			value: 5,
			placeholder: minutes,
			text: `5 ${minutes}`
		},
		{
			name: '10',
			value: 6,
			placeholder: minutes,
			text: `10 ${minutes}`
		},
		{
			name: '15',
			value: 7,
			placeholder: minutes,
			text: `15 ${minutes}`
		},
		{
			name: '20',
			value: 8,
			placeholder: minutes,
			text: `20 ${minutes}`
		},
		{
			name: never,
			value: 9,
			placeholder: '',
			text: never
		},
		{
			name: halfTime,
			value: 10,
			placeholder: '',
			text: halfTime
		}];
	}

	public initOledSettings() {
		try {
			if (this.displayService.isShellAvailable) {
				this.displayService.getOLEDPowerControlCapability()
					.then((result: boolean) => {
						this.logger.info('OLED-Power-Settings : getOLEDPowerControlCapability.then', result);
						this.hasOLEDPowerControlCapability = result;
						if (this.hasOLEDPowerControlCapability === true) {
							this.getTaskbarDimmerSetting();
							this.getBackgroundDimmerSetting();
							this.getDisplayDimmerSetting();
						}

					}).catch(error => {
						this.logger.error('OLED-Power-Settings : getOLEDPowerControlCapability', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('OLED-Power-Settings : getOLEDPowerControlCapability', error.message);
			return EMPTY;


		}
	}


	public onTaskBarDimmerChange($event: DropDownInterval) {
		this.logger.info('OLED-Power-Settings : onTaskBarDimmerChange', String($event.value));
		if ($event) {
			this.title = $event.placeholder;
			this.taskBarDimmerValue = $event.value;
			this.setTaskbarDimmerSetting($event.value);
		}

	}

	public onBackgroundDimmerChange($event: DropDownInterval) {
		this.logger.info('OLED-Power-Settings : onBackgroundDimmerChange', String($event.value));
		if ($event) {
			this.title = $event.placeholder;
			this.backgroundDimmerValue = $event.value;
			this.setBackgroundDimmerSetting($event.value);
		}
	}

	public onDisplayDimmerChange($event: DropDownInterval) {
		this.logger.info('OLED-Power-Settings : onDisplayDimmerChange', String($event.value));
		if ($event) {
			this.title = $event.placeholder;
			this.displayDimmerValue = $event.value;
			this.setDisplayDimmerSetting($event.value);
		}
	}



	getTaskbarDimmerSetting() {
		try {
			if (this.displayService.isShellAvailable && this.hasOLEDPowerControlCapability) {
				this.displayService.getTaskbarDimmerSetting()
					.then((result: any) => {
						this.logger.info('OLED-Power-Settings : getTaskbarDimmerSetting.then', result.displayStrIndex);
						// this.taskbarDimmerSetting = result;
						this.taskBarDimmerValue = result.displayStrIndex;

					}).catch(error => {
						this.logger.error('OLED-Power-Settings : getTaskbarDimmerSetting error', error.message);
						return EMPTY;

					});
			}
		} catch (error) {
			this.logger.error('OLED-Power-Settings : getTaskbarDimmerSetting error', error.message);
			return EMPTY;
		}
	}

	getBackgroundDimmerSetting() {
		try {
			if (this.displayService.isShellAvailable && this.hasOLEDPowerControlCapability) {
				this.displayService.getBackgroundDimmerSetting()
					.then((result: any) => {
						this.logger.info('OLED-Power-Settings : getBackgroundDimmerSetting.then', result.displayStrIndex);
						/* this.backgroundDimmerSetting = result; */
						this.backgroundDimmerValue = result.displayStrIndex;

					}).catch(error => {
						this.logger.error('OLED-Power-Settings : getBackgroundDimmerSetting error', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('OLED-Power-Settings : getBackgroundDimmerSetting error', error.message);
			return EMPTY;
		}
	}

	getDisplayDimmerSetting() {
		try {
			if (this.displayService.isShellAvailable && this.hasOLEDPowerControlCapability) {
				this.displayService.getDisplayDimmerSetting()
					.then((result: any) => {
						this.logger.info('OLED-Power-Settings : getDisplayDimmerSetting.then', result.displayStrIndex);
						/* this.displayDimmerSetting = result; */
						this.displayDimmerValue = result.displayStrIndex;

					}).catch(error => {
						this.logger.error('OLED-Power-Settings : getDisplayDimmerSetting error', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('OLED-Power-Settings : getDisplayDimmerSetting error', error.message);
			return EMPTY;
		}
	}


	private setTaskbarDimmerSetting(value: number) {
		try {
			this.logger.info('OLED-Power-Settings : setTaskbarDimmerSetting changed in display', value);
			if (this.displayService.isShellAvailable && this.hasOLEDPowerControlCapability) {
				this.displayService
					.setTaskbarDimmerSetting(String(value)).then((result: boolean) => {
						this.logger.info('OLED-Power-Settings : setTaskbarDimmerSetting.then', result);

					}).catch(error => {
						this.logger.error('OLED-Power-Settings : setTaskbarDimmerSetting error ', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('OLED-Power-Settings : setTaskbarDimmerSetting error ', error.message);
			return EMPTY;
		}
	}


	private setBackgroundDimmerSetting(value: number) {
		try {
			this.logger.info('OLED-Power-Settings : setBackgroundDimmerSetting changed in display', value);

			if (this.displayService.isShellAvailable && this.hasOLEDPowerControlCapability) {
				this.displayService
					.setBackgroundDimmerSetting(String(value)).then((result: boolean) => {
						this.logger.info('OLED-Power-Settings : setBackgroundDimmerSetting.then', result);


					}).catch(error => {
						this.logger.error('OLED-Power-Settings : setBackgroundDimmerSetting error', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('OLED-Power-Settings : setBackgroundDimmerSetting error', error.message);
			return EMPTY;
		}
	}


	private setDisplayDimmerSetting(value: number) {
		try {
			this.logger.info('OLED-Power-Settings : setDisplayDimmerSetting changed in display', value);


			if (this.displayService.isShellAvailable && this.hasOLEDPowerControlCapability) {
				this.displayService
					.setDisplayDimmerSetting(String(value)).then((result: boolean) => {
						this.logger.info('OLED-Power-Settings : setDisplayDimmerSetting.then', result);


					}).catch(error => {
						this.logger.error('OLED-Power-Settings : setDisplayDimmerSetting error', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('OLED-Power-Settings : setDisplayDimmerSetting error', error.message);
			return EMPTY;
		}
	}
}
