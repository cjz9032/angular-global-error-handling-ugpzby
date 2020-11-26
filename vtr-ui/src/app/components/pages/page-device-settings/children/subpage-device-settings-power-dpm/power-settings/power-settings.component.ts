import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { PowerDpmService } from 'src/app/services/power-dpm/power-dpm.service';
import { Subscription, from } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DPMDropDownInterval } from 'src/app/data-models/common/dpm-drop-down-interval.model';

@Component({
	selector: 'vtr-power-settings',
	templateUrl: './power-settings.component.html',
	styleUrls: ['./power-settings.component.scss'],
})
export class PowerSettingsComponent implements OnInit, OnDestroy {
	constructor(public dpmService: PowerDpmService, private translate: TranslateService) {}

	powerButtonActions: DPMDropDownInterval[];
	signInOptions: DPMDropDownInterval[];
	selectAction: number;
	selectedSignInOptionVal: number;
	allPowerPlansSubscription: Subscription;
	private readonly powerButtonOptions = [
		'DoNothing',
		'Sleep',
		'Hibernate',
		'Shutdown',
		'PowerOffDisplay',
	];

	ngOnInit() {
		this.initPowerActions();
		this.initSignInOptions();
		this.allPowerPlansSubscription = this.dpmService.getAllPowerPlansObs().subscribe((v) => {
			if (v) {
				this.selectAction = v.powerButtonAction;
				this.selectedSignInOptionVal = v.passwordOnStandby;
			}
		});
	}
	ngOnDestroy(): void {
		if (this.allPowerPlansSubscription) {
			this.allPowerPlansSubscription.unsubscribe();
		}
	}

	private initPowerActions() {
		const doNothing = this.translate.instant(
			'device.deviceSettings.power.dpm.globalPowerSettings.powerButton.items.doNothing'
		);
		const sleep = this.translate.instant(
			'device.deviceSettings.power.dpm.globalPowerSettings.powerButton.items.sleep'
		);
		const hibernate = this.translate.instant(
			'device.deviceSettings.power.dpm.globalPowerSettings.powerButton.items.hibernate'
		);
		const shutDown = this.translate.instant(
			'device.deviceSettings.power.dpm.globalPowerSettings.powerButton.items.shutDown'
		);
		const turnOfDisplay = this.translate.instant(
			'device.deviceSettings.power.dpm.globalPowerSettings.powerButton.items.turnOffTheDisplay'
		);

		this.powerButtonActions = [
			{
				name: doNothing,
				value: 0,
				text: this.translate.instant(
					'device.deviceSettings.power.dpm.globalPowerSettings.powerButton.items.doNothing'
				), // 'Do nothing'
			},
			{
				name: sleep,
				value: 1,
				text: this.translate.instant(
					'device.deviceSettings.power.dpm.globalPowerSettings.powerButton.items.sleep'
				), // 'Sleep'
			},
			{
				name: hibernate,
				value: 2,
				text: this.translate.instant(
					'device.deviceSettings.power.dpm.globalPowerSettings.powerButton.items.hibernate'
				), // 'Hibernate'
			},
			{
				name: shutDown,
				value: 3,
				text: this.translate.instant(
					'device.deviceSettings.power.dpm.globalPowerSettings.powerButton.items.shutDown'
				), // 'Shutdown'
			},
			{
				name: turnOfDisplay,
				value: 4,
				text: this.translate.instant(
					'device.deviceSettings.power.dpm.globalPowerSettings.powerButton.items.turnOffTheDisplay'
				), // 'Turn off the display'
			},
		];
		this.selectAction = 0;
	}
	private initSignInOptions() {
		const never = this.translate.instant(
			'device.deviceSettings.power.dpm.globalPowerSettings.requiredSignIn.items.never'
		);
		const fromSleep = this.translate.instant(
			'device.deviceSettings.power.dpm.globalPowerSettings.requiredSignIn.items.fromSleep'
		);
		this.signInOptions = [
			{
				name: never, // 'Never',
				value: 0,
				text: this.translate.instant(
					'device.deviceSettings.power.dpm.globalPowerSettings.requiredSignIn.items.never'
				), // 'Never'
			},
			{
				name: fromSleep, // 'When PC wakes up from sleep',
				value: 1,
				text: this.translate.instant(
					'device.deviceSettings.power.dpm.globalPowerSettings.requiredSignIn.items.fromSleep'
				), // 'When PC wakes up from sleep'
			},
		];
		this.selectedSignInOptionVal = 0;
	}

	public onActionChange($event: DPMDropDownInterval) {
		if ($event) {
			this.selectAction = $event.value;
			const value = this.powerButtonOptions[$event.value];
			this.dpmService.setPowerButton(value);
		}
	}
	public onSignInOptionChanged($event: DPMDropDownInterval) {
		if ($event) {
			this.selectedSignInOptionVal = $event.value;
			this.dpmService.setSignInOption($event.value === 1 ? 'Yes' : 'No');
		}
	}
}
