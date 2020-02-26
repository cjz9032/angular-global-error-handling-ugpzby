import { Component, OnInit, OnDestroy } from '@angular/core';
import { PowerDpmService } from 'src/app/services/power-dpm/power-dpm.service';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

@Component({
	selector: 'vtr-subpage-device-settings-power-dpm',
	templateUrl: './subpage-device-settings-power-dpm.component.html',
	styleUrls: ['./subpage-device-settings-power-dpm.component.scss']
})
export class SubpageDeviceSettingsPowerDpmComponent implements OnInit,OnDestroy {

	allPowerPlansSubscription: Subscription;
	public isLoading: boolean;

	constructor(
		public dpmService: PowerDpmService,
		public commonService:CommonService
		) { }

	ngOnInit() {
		this.isLoading=true;
		this.commonService.setLocalStorageValue(LocalStorageKey.IsPowerPageAvailable, true);
		this.allPowerPlansSubscription = this.dpmService.getAllPowerPlansObs().subscribe(
			v => {
				if (v) {
					this.isLoading=false;
					this.allPowerPlansSubscription.unsubscribe();
				}
			}
		);
	}

	ngOnDestroy(): void {
		if (this.allPowerPlansSubscription) {
			this.allPowerPlansSubscription.unsubscribe();
		}
	}
}
