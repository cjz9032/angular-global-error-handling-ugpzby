import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { PowerDpmService } from 'src/app/services/power-dpm/power-dpm.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { DPMDropDownInterval } from 'src/app/data-models/common/dpm-drop-down-interval.model';

@Component({
	selector: 'vtr-power-use',
	templateUrl: './power-use.component.html',
	styleUrls: ['./power-use.component.scss']
})
export class PowerUseComponent implements OnInit {

	@Input() powerplan: any;
	constructor(
		public dpmService: PowerDpmService,
		private translate: TranslateService) { }

	timeItems: DPMDropDownInterval[];
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
		let minute = this.translate.instant('device.deviceSettings.power.dpm.powerUse.items.minute');
		let minutes = this.translate.instant('device.deviceSettings.power.dpm.powerUse.items.minutes');
		let hour = this.translate.instant('device.deviceSettings.power.dpm.powerUse.items.hour');
		let hours = this.translate.instant('device.deviceSettings.power.dpm.powerUse.items.hours');
		let never = this.translate.instant('device.deviceSettings.power.dpm.powerUse.items.never');

		this.timeItems = [
			{
				name: '1',
				value: 1,
				text: `1 ${minute}`
			},
			{
				name: '2',
				value: 2,
				text: `2 ${minutes}`
			},
			{
				name: '3',
				value: 3,
				text: `3 ${minutes}`
			},
			{
				name: '5',
				value: 5,
				text: `5 ${minutes}`
			},
			{
				name: '10',
				value: 10,
				text: `10 ${minutes}`
			},
			{
				name: '15',
				value: 15,
				text: `15 ${minutes}`
			},
			{
				name: '20',
				value: 20,
				text: `20 ${minutes}`
			},
			{
				name: '25',
				value: 25,
				text: `25 ${minutes}`
			},
			{
				name: '30',
				value: 30,
				text: `30 ${minutes}`
			},
			{
				name: '45',
				value: 45,
				text: `45 ${minutes}`
			},
			{
				name: '60',
				value: 60,
				text: `1 ${hour}`
			},
			{
				name: '120',
				value: 120,
				text: `2 ${hours}`
			},
			{
				name: '180',
				value: 180,
				text: `3 ${hours}`
			},
			{
				name: '240',
				value: 240,
				text: `4 ${hours}`
			},
			{
				name: '300',
				value: 300,
				text: `5 ${hours}`
			},
			{
				name: '0',
				value: 0,
				text: never
			}];

		this.turnoffDisplay = 0;
		this.turnoffHDD = 0;
		this.sleepAfter = 0;
		this.hibernateAfter = 0;
	}

	public onTurnOffDisplayChange($event: DPMDropDownInterval) {
		if ($event) {
			this.turnoffDisplay = $event.value;
			this.dpmService.setTurnoffDisplay($event.name);
		}
	}

	public onTurnOffHDDChange($event: DPMDropDownInterval) {
		if ($event) {
			this.turnoffHDD = $event.value;
			this.dpmService.setTurnoffHDD($event.name);
		}
	}

	public onSleepChange($event: DPMDropDownInterval) {
		if ($event) {
			this.sleepAfter = $event.value;
			this.dpmService.setSleepAfter($event.name);
		}
	}

	public onHibernateChange($event: DPMDropDownInterval) {
		if ($event) {
			this.hibernateAfter = $event.value;
			this.dpmService.setHibernateAfter($event.name);
		}
	}
}
