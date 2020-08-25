import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { PowerDpmService } from 'src/app/services/power-dpm/power-dpm.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { DropDownInterval } from 'src/app/data-models/common/drop-down-interval.model';

@Component({
	selector: 'vtr-power-use',
	templateUrl: './power-use.component.html',
	styleUrls: ['./power-use.component.scss']
})
export class PowerUseComponent implements OnInit, OnDestroy {

	@Input() powerplan: any;
	constructor(
		public dpmService: PowerDpmService,
		private translate: TranslateService) { }

	timeItems: DropDownInterval[];
	turnoffDisplay: number;
	turnoffHDD: number;
	sleepAfter: number;
	hibernateAfter: number;
	private currentPowerPlanSubscription: Subscription;

	ngOnInit() {
		this.initIntervals();
		this.currentPowerPlanSubscription = this.dpmService.getCurrentPowerPlanObs().subscribe(p => {
			if (p) {
				this.turnoffDisplay = p.videoTimeoutAC;
				this.turnoffHDD = p.hddTimeoutAC;
				this.sleepAfter = p.suspendTimeoutAC;
				this.hibernateAfter = p.hiberTimeoutAC;
			}
		});
	}
	ngOnDestroy(): void {
		if (this.currentPowerPlanSubscription) {
			this.currentPowerPlanSubscription.unsubscribe();
		}
	}

	private initIntervals() {
		const minute = this.translate.instant('device.deviceSettings.power.dpm.powerUse.items.minute');
		const minutes = this.translate.instant('device.deviceSettings.power.dpm.powerUse.items.minutes');
		const hour = this.translate.instant('device.deviceSettings.power.dpm.powerUse.items.hour');
		const hours = this.translate.instant('device.deviceSettings.power.dpm.powerUse.items.hours');
		const never = this.translate.instant('device.deviceSettings.power.dpm.powerUse.items.never');

		this.timeItems = [
			{
				name: `1 ${minute}`,
				value: 1,
				text: `1 ${minute}`,
				placeholder: '',
				metricsValue: '1 minute'
			},
			{
				name: `2 ${minutes}`,
				value: 2,
				text: `2 ${minutes}`,
				placeholder: '',
				metricsValue: '2 minutes'
			},
			{
				name: `3 ${minutes}`,
				value: 3,
				text: `3 ${minutes}`,
				placeholder: '',
				metricsValue: '3 minutes'
			},
			{
				name: `5 ${minutes}`,
				value: 5,
				text: `5 ${minutes}`,
				placeholder: '',
				metricsValue: '5 minutes'
			},
			{
				name: `10 ${minutes}`,
				value: 10,
				text: `10 ${minutes}`,
				placeholder: '',
				metricsValue: '10 minutes'
			},
			{
				name: `15 ${minutes}`,
				value: 15,
				text: `15 ${minutes}`,
				placeholder: '',
				metricsValue: '10 minutes'
			},
			{
				name: `20 ${minutes}`,
				value: 20,
				text: `20 ${minutes}`,
				placeholder: '',
				metricsValue: '20 minutes'
			},
			{
				name: `25 ${minutes}`,
				value: 25,
				text: `25 ${minutes}`,
				placeholder: '',
				metricsValue: '25 minutes'
			},
			{
				name: `30 ${minutes}`,
				value: 30,
				text: `30 ${minutes}`,
				placeholder: '',
				metricsValue: '30 minutes'
			},
			{
				name: `45 ${minutes}`,
				value: 45,
				text: `45 ${minutes}`,
				placeholder: '',
				metricsValue: '45 minutes'
			},
			{
				name: `1 ${hour}`,
				value: 60,
				text: `1 ${hour}`,
				placeholder: '',
				metricsValue: '1 hour'
			},
			{
				name: `2 ${hours}`,
				value: 120,
				text: `2 ${hours}`,
				placeholder: '',
				metricsValue: '2 hours'
			},
			{
				name: `3 ${hours}`,
				value: 180,
				text: `3 ${hours}`,
				placeholder: '',
				metricsValue: '3 hours'
			},
			{
				name:  `4 ${hours}`,
				value: 240,
				text: `4 ${hours}`,
				placeholder: '',
				metricsValue: '4 hours'
			},
			{
				name: `5 ${hours}`,
				value: 300,
				text: `5 ${hours}`,
				placeholder: '',
				metricsValue: '5 hours'
			},
			{
				name: never,
				value: 0,
				text: never,
				placeholder: '',
				metricsValue: 'never'
			}];

		this.turnoffDisplay = 0;
		this.turnoffHDD = 0;
		this.sleepAfter = 0;
		this.hibernateAfter = 0;
	}

	public onTurnOffDisplayChange($event: DropDownInterval) {
		if ($event) {
			this.turnoffDisplay = $event.value;
			this.dpmService.setTurnoffDisplay($event.value.toString());
		}
	}

	public onTurnOffHDDChange($event: DropDownInterval) {
		if ($event) {
			this.turnoffHDD = $event.value;
			this.dpmService.setTurnoffHDD($event.value.toString());
		}
	}

	public onSleepChange($event: DropDownInterval) {
		if ($event) {
			this.sleepAfter = $event.value;
			this.dpmService.setSleepAfter($event.value.toString());
		}
	}

	public onHibernateChange($event: DropDownInterval) {
		if ($event) {
			this.hibernateAfter = $event.value;
			this.dpmService.setHibernateAfter($event.value.toString());
		}
	}
}
