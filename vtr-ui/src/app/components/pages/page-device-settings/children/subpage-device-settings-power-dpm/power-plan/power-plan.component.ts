import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { PowerDpmService } from 'src/app/services/power-dpm/power-dpm.service';
import { TranslateService } from '@ngx-translate/core';
import { PowerPlan } from 'src/app/data-models/dpm/power-plan.model';
import { Subscription } from 'rxjs';
import { DropDownInterval } from 'src/app/data-models/common/drop-down-interval.model';

@Component({
	selector: 'vtr-power-plan',
	templateUrl: './power-plan.component.html',
	styleUrls: ['./power-plan.component.scss']
})
export class PowerPlanComponent implements OnInit, OnDestroy {

	public selectedPowerPlanIndex: number;
	public selectedPowerPlanVal: PowerPlan;
	public supportedPlans: PowerPlan[];
	public powerPlanIntervals: DropDownInterval[];
	private allPowerPlansSubscription: Subscription;

	constructor(
		public dpmService: PowerDpmService,
		private translate: TranslateService
	) { }

	ngOnInit() {
		this.allPowerPlansSubscription = this.dpmService.getAllPowerPlansObs().subscribe(
			v => {
				if (v) {
					this.updatePowerPlanList(v.powerPlanList);
					this.selectedPowerPlanIndex = v.powerPlanList.findIndex(p => p.powerPlanName === v.activePowerPlan);
					this.selectedPowerPlanVal = v.powerPlanList[this.selectedPowerPlanIndex];
				}
			}
		);
	}

	ngOnDestroy(): void {
		if (this.allPowerPlansSubscription) {
			this.allPowerPlansSubscription.unsubscribe();
		}
	}

	private updatePowerPlanList(list: PowerPlan[]) {
		if (list) {
			this.supportedPlans = list;
			this.powerPlanIntervals = [];
			list.forEach((p, i) => {
				this.powerPlanIntervals.push({
					name: p.powerPlanName,
					value: i,
					text: p.powerPlanName,
					placeholder: '',
					metricsValue: `plan-${p.powerPlanName}`
				});
			});
		}
	}

	public onPowerPlanChange($event: DropDownInterval) {
		if ($event && this.supportedPlans.length > 0) {
			this.selectedPowerPlanIndex = $event.value;
			this.selectedPowerPlanVal = this.supportedPlans[$event.value];
			this.dpmService.setCurrentPowerPlan($event.name);
		}
	}
}
