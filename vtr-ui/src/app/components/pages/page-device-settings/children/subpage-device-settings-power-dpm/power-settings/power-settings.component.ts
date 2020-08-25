import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { PowerDpmService } from 'src/app/services/power-dpm/power-dpm.service';
import { Subscription, from } from 'rxjs';
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
	private readonly powerButtonOptions = ['DoNothing', 'Sleep', 'Hibernate', 'Shutdown', 'PowerOffDisplay'];

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
		const doNothing = this.translate.instant('device.deviceSettings.power.dpm.globalPowerSettings.powerButton.items.doNothing');
		const sleep = this.translate.instant('device.deviceSettings.power.dpm.globalPowerSettings.powerButton.items.sleep');
		const hibernate = this.translate.instant('device.deviceSettings.power.dpm.globalPowerSettings.powerButton.items.hibernate');
		const shutDown = this.translate.instant('device.deviceSettings.power.dpm.globalPowerSettings.powerButton.items.shutDown');
		const turnOfDisplay = this.translate.instant('device.deviceSettings.power.dpm.globalPowerSettings.powerButton.items.turnOffTheDisplay');

		this.powerButtonActions = [
			{
				name: doNothing,
				value: 0,
				text: doNothing, // 'Do nothing'
				placeholder: '',
				metricsValue: ''
			}, {
				name: sleep,
				value: 1,
				text: sleep, // 'Sleep'
				placeholder: '',
				metricsValue: ''
			}, {
				name: hibernate,
				value: 2,
				text: hibernate, // 'Hibernate'
				placeholder: '',
				metricsValue: ''
			}, {
				name: shutDown,
				value: 3,
				text: shutDown, // 'Shutdown'
				placeholder: '',
				metricsValue: ''
			}, {
				name: turnOfDisplay,
				value: 4,
				text: turnOfDisplay, // 'Turn off the display'
				placeholder: '',
				metricsValue: ''
			},
		];
		this.selectAction = 0;
	}
	private initSignInOptions() {
		const never = this.translate.instant('device.deviceSettings.power.dpm.globalPowerSettings.requiredSignIn.items.never');
		const fromSleep = this.translate.instant('device.deviceSettings.power.dpm.globalPowerSettings.requiredSignIn.items.fromSleep');
		this.signInOptions = [
			{
				name: never, // 'Never',
				value: 0,
				text: never, // 'Never'
				placeholder: '',
				metricsValue: ''
			}, {
				name: fromSleep, // 'When PC wakes up from sleep',
				value: 1,
				text: fromSleep, // 'When PC wakes up from sleep'
				placeholder: '',
				metricsValue: ''
			}
		];
		this.selectedSignInOptionVal = 0;
	}

	public onActionChange($event: DropDownInterval) {
		if ($event) {
			this.selectAction = $event.value;
			const value = this.powerButtonOptions[$event.value];
			this.dpmService.setPowerButton(value);
		}
	}
	public onSignInOptionChanged($event: DropDownInterval) {
		if ($event) {
			this.selectedSignInOptionVal = $event.value;
			this.dpmService.setSignInOption($event.value === 1 ? 'Yes' : 'No');
		}
	}
}
