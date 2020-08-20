import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { PowerDpmService } from 'src/app/services/power-dpm/power-dpm.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DropDownInterval } from 'src/app/data-models/common/drop-down-interval.model';

@Component({
	selector: 'vtr-power-settings',
	templateUrl: './power-settings.component.html',
	styleUrls: ['./power-settings.component.scss']
})
export class PowerSettingsComponent implements OnInit, OnDestroy {

	constructor(
		public dpmService: PowerDpmService,
		private translate: TranslateService) { }

	powerButtonActions: DropDownInterval[];
	signInOptions: DropDownInterval[];
	selectAction: number;
	selectedSignInOptionVal: number;
	allPowerPlansSubscription: Subscription;
	ngOnInit() {
		this.initPowerActions();
		this.initSignInOptions();
		this.allPowerPlansSubscription = this.dpmService.getAllPowerPlansObs().subscribe(
			v => {
				if (v) {
					this.selectAction = v.powerButtonAction;
					this.selectedSignInOptionVal = v.passwordOnStandby;
				}
			}
		);
	}
	ngOnDestroy(): void {
		if (this.allPowerPlansSubscription) {
			this.allPowerPlansSubscription.unsubscribe();
		}
	}

	private initPowerActions() {
		this.powerButtonActions = [
			{
				name: 'DoNothing',
				value: 0,
				text: this.translate.instant('device.deviceSettings.power.dpm.globalPowerSettings.powerButton.items.doNothing'), // 'Do nothing'
				placeholder: '',
				metricsValue: ''
			}, {
				name: 'Sleep',
				value: 1,
				text: this.translate.instant('device.deviceSettings.power.dpm.globalPowerSettings.powerButton.items.sleep'), // 'Sleep'
				placeholder: '',
				metricsValue: ''
			}, {
				name: 'Hibernate',
				value: 2,
				text: this.translate.instant('device.deviceSettings.power.dpm.globalPowerSettings.powerButton.items.hibernate'), // 'Hibernate'
				placeholder: '',
				metricsValue: ''
			}, {
				name: 'Shutdown',
				value: 3,
				text: this.translate.instant('device.deviceSettings.power.dpm.globalPowerSettings.powerButton.items.shutDown'), // 'Shutdown'
				placeholder: '',
				metricsValue: ''
			}, {
				name: 'PowerOffDisplay',
				value: 4,
				text: this.translate.instant('device.deviceSettings.power.dpm.globalPowerSettings.powerButton.items.turnOffTheDisplay'), // 'Turn off the display'
				placeholder: '',
				metricsValue: ''
			},
		];
		this.selectAction = 0;
	}
	private initSignInOptions() {
		this.signInOptions = [
			{
				name: this.translate.instant('device.deviceSettings.power.dpm.globalPowerSettings.requiredSignIn.items.never'), // 'Never',
				value: 0,
				text: this.translate.instant('device.deviceSettings.power.dpm.globalPowerSettings.requiredSignIn.items.never'), // 'Never'
				placeholder: '',
				metricsValue: ''
			}, {
				name: this.translate.instant('device.deviceSettings.power.dpm.globalPowerSettings.requiredSignIn.items.fromSleep'), // 'When PC wakes up from sleep',
				value: 1,
				text: this.translate.instant('device.deviceSettings.power.dpm.globalPowerSettings.requiredSignIn.items.fromSleep'), // 'When PC wakes up from sleep'
				placeholder: '',
				metricsValue: ''
			}
		];
		this.selectedSignInOptionVal = 0;
	}

	public onActionChange($event: DropDownInterval) {
		if ($event) {
			this.selectAction = $event.value;
			this.dpmService.setPowerButton($event.name);
		}
	}
	public onSignInOptionChanged($event: DropDownInterval) {
		if ($event) {
			this.selectedSignInOptionVal = $event.value;
			this.dpmService.setSignInOption($event.value === 1 ? 'Yes' : 'No');
		}
	}
}
