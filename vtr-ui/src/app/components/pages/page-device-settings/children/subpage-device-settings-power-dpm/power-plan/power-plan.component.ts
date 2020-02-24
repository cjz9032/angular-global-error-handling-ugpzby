import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { PowerDpmService } from 'src/app/services/power-dpm/power-dpm.service';
import { TranslateService } from '@ngx-translate/core';
import { PowerPlan } from 'src/app/data-models/dpm/power-plan.model';
import { DPMDropDownInterval } from 'src/app/data-models/common/dpm-drop-down-interval.model';
import { Subscription } from 'rxjs';

@Component({
	selector: 'vtr-power-plan',
	templateUrl: './power-plan.component.html',
	styleUrls: ['./power-plan.component.scss']
})
export class PowerPlanComponent implements OnInit, OnDestroy {

	public selectedPowerPlanVal: PowerPlan;
	public powerPlanIntervals: DPMDropDownInterval[];
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
					this.selectedPowerPlanVal = v.powerPlanList.find(p => p.powerPlanName === v.activePowerPlan);
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
			this.powerPlanIntervals = [];
			list.forEach(p => {
				this.powerPlanIntervals.push({
					name: p.powerPlanName,
					value: p,
					text: p.powerPlanName
				});
			});
		}
	}

	public onPowerPlanChange($event: DPMDropDownInterval) {
		if ($event) {
			this.selectedPowerPlanVal = $event.value;
			this.dpmService.setCurrentPowerPlan($event.name);
		}
	}
}
