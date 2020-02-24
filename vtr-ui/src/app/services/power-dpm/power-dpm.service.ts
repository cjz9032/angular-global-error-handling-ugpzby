import { Injectable } from '@angular/core';
import { from, Observable, BehaviorSubject } from 'rxjs';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { AllPowerPlans } from 'src/app/data-models/dpm/all-power-plans.model';
import { CommonService } from '../common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { PowerPlan } from 'src/app/data-models/dpm/power-plan.model';
import { map, filter } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class PowerDpmService {
	private devicePowerDPM: any;
	private allPowerPlansSubject: BehaviorSubject<AllPowerPlans>;
	private _currentPowerPlanObs: Observable<PowerPlan>;
	private allPowerPlansCache: AllPowerPlans;
	private refreshInterval;
	// private mockResponse = {
	// 	activePowerPlan: 'Balanced',
	// 	powerButtonAction: 1,
	// 	passwordOnStandby: 1,
	// 	dbcOnLockEvent: 0,
	// 	powerMeter: 37,
	// 	alsAdaptiveBrightness: 1,
	// 	adjustOffset: '50',
	// 	powerPlanList: [{
	// 		settingList: [{
	// 			key: 'PowerPlan',
	// 			value: 'Balanced'
	// 		}, {
	// 			key: 'PreDefined',
	// 			value: 'SystemDefined'
	// 		}, {
	// 			key: 'HDDTimeoutAC',
	// 			value: '120'
	// 		}, {
	// 			key: 'HiberTimeoutAC',
	// 			value: '15'
	// 		}, {
	// 			key: 'SuspendTimeoutAC',
	// 			value: '0'
	// 		}, {
	// 			key: 'VideoTimeoutAC',
	// 			value: '45'
	// 		}, {
	// 			key: 'Performance',
	// 			value: '5'
	// 		}, {
	// 			key: 'Temperature',
	// 			value: '4'
	// 		}, {
	// 			key: 'PowerUsage',
	// 			value: '7'
	// 		}, {
	// 			key: 'CPUSpeed',
	// 			value: 'cpuSpeedAdaptive'
	// 		}, {
	// 			key: 'Brightness',
	// 			value: '100'
	// 		},]
	// 	},
	// 	{
	// 		settingList: [{
	// 			key: 'PowerPlan',
	// 			value: '1CustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCuCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCuCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCuCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCuCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCuCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCuCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCuCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCuCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCuCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCuCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCuCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCuCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCuCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCuCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCustomCu'
	// 		}, {
	// 			key: 'PreDefined',
	// 			value: 'SystemDefined'
	// 		}, {
	// 			key: 'HDDTimeoutAC',
	// 			value: '1'
	// 		}, {
	// 			key: 'HiberTimeoutAC',
	// 			value: '3'
	// 		}, {
	// 			key: 'SuspendTimeoutAC',
	// 			value: '5'
	// 		}, {
	// 			key: 'VideoTimeoutAC',
	// 			value: '60'
	// 		}, {
	// 			key: 'Performance',
	// 			value: '5'
	// 		}, {
	// 			key: 'Temperature',
	// 			value: '4'
	// 		}, {
	// 			key: 'PowerUsage',
	// 			value: '7'
	// 		}, {
	// 			key: 'CPUSpeed',
	// 			value: 'cpuSpeedAdaptive'
	// 		}, {
	// 			key: 'Brightness',
	// 			value: '100'
	// 		},]
	// 	},
	// 	{
	// 		settingList: [{
	// 			key: 'PowerPlan',
	// 			value: 'My Custom PlanMy Custom PlanMy Custom PlanMy Custom PlanMy Custom PlanMy Custom PlanMy Custom PlanMy Custom PlanMy Custom PlanMy'
	// 		}, {
	// 			key: 'PreDefined',
	// 			value: 'SystemDefined'
	// 		}, {
	// 			key: 'HDDTimeoutAC',
	// 			value: '240'
	// 		}, {
	// 			key: 'HiberTimeoutAC',
	// 			value: '10'
	// 		}, {
	// 			key: 'SuspendTimeoutAC',
	// 			value: '45'
	// 		}, {
	// 			key: 'VideoTimeoutAC',
	// 			value: '0'
	// 		}, {
	// 			key: 'Performance',
	// 			value: '5'
	// 		}, {
	// 			key: 'Temperature',
	// 			value: '4'
	// 		}, {
	// 			key: 'PowerUsage',
	// 			value: '7'
	// 		}, {
	// 			key: 'CPUSpeed',
	// 			value: 'cpuSpeedAdaptive'
	// 		}, {
	// 			key: 'Brightness',
	// 			value: '100'
	// 		},]
	// 	}]
	// };

	constructor(
		private shellService: VantageShellService,
		private commonService: CommonService) {
		this.devicePowerDPM = this.shellService.getPowerDPM();
	}

	getAllPowerPlansObs(): Observable<AllPowerPlans> {
		if (!this.allPowerPlansSubject) {
			let localCacheVal = this.commonService.getLocalStorageValue(LocalStorageKey.DPMAllPowerPlans, null);
			this.allPowerPlansCache = JSON.parse(localCacheVal);
			this.allPowerPlansSubject = new BehaviorSubject<AllPowerPlans>(this.allPowerPlansCache);
			this.startRefreshPowerPlans();
		}
		return this.allPowerPlansSubject.pipe(
			map(allPowerPlans => this.preprocessAllPowerPlans(allPowerPlans))
		);
	}

	getCurrentPowerPlanObs(): Observable<PowerPlan> {
		if (!this._currentPowerPlanObs) {
			this._currentPowerPlanObs = this.getAllPowerPlansObs().pipe(
				map(allPowerPlans => this.getCurrentPowerPlan(allPowerPlans))
			);
		}
		return this._currentPowerPlanObs;
	}

	private preprocessAllPowerPlans(allPowerPlans: AllPowerPlans): AllPowerPlans {
		if(allPowerPlans){
			allPowerPlans.powerPlanList.forEach(p => {
				p.settingList.forEach(s => {
					switch (s.key) {
						case 'PowerPlan':
							p.powerPlanName = s.value;
							break;
						case 'PreDefined':
							p.preDefined = s.value === 'SystemDefined';
							break;
						case 'HDDTimeoutAC':
							p.hddTimeoutAC = Number(s.value);
							break;
						case 'HiberTimeoutAC':
							p.hiberTimeoutAC = Number(s.value);
							break;
						case 'SuspendTimeoutAC':
							p.suspendTimeoutAC = Number(s.value);
							break;
						case 'VideoTimeoutAC':
							p.videoTimeoutAC = Number(s.value);
							break;
						case 'Performance':
							p.performance = Number(s.value);
							break;
						case 'Temperature':
							p.temperature = Number(s.value);
							break;
						case 'PowerUsage':
							p.powerUsage = Number(s.value);
							break;
						case 'CPUSpeed':
							p.cpuSpeed = s.value;
							break;
						case 'Brightness':
							p.brightness = Number(s.value);
							break;
						default: break;
					}
				})
			});
		}

		return allPowerPlans;
	}
	private getCurrentPowerPlan(allPowerPlans: AllPowerPlans): PowerPlan {
		let currentPowerPlan = null;
		let currentPowerPlanName = allPowerPlans.activePowerPlan;
		if (currentPowerPlanName && allPowerPlans.powerPlanList) {
			currentPowerPlan = allPowerPlans.powerPlanList.find(p => p.powerPlanName == currentPowerPlanName);
		}
		return currentPowerPlan;
	}

	private startRefreshPowerPlans() {
		if (this.refreshInterval) {
			clearInterval(this.refreshInterval);
			this.refreshInterval = null;
		}
		this.getAllPowerPlans();
		this.refreshInterval = setInterval(() => {
			this.getAllPowerPlans();
		}, 30000);
	}

	private getAllPowerPlans() {
		if (this.devicePowerDPM) {
			this.devicePowerDPM.getAllPowerPlans().then(response => {
				//response = this.mockResponse;
				if(response){
					this.allPowerPlansSubject.next(response);
					this.updateCache(response);
				}
			});
		}
	}
	public setPowerButton(action: string) {
		if (this.devicePowerDPM) {
			return this.devicePowerDPM.setPowerButton(action).then(response => {
				// response = this.mockResponse;
				if(response){
					this.allPowerPlansSubject.next(response);
					this.updateCache(response);
				}
			});
		}
		return undefined;
	}
	public setSignInOption(option: string) {
		if (this.devicePowerDPM) {
			return this.devicePowerDPM.setSignInOption(option).then(response => {
				// response = this.mockResponse;
				if(response){
					this.allPowerPlansSubject.next(response);
					this.updateCache(response);
				}
			});
		}
	}

	public setTurnoffDisplay(option: string) {
		if (this.devicePowerDPM) {
			return this.devicePowerDPM.setTurnoffDisplay(option).then(response => {
				// response = this.mockResponse;
				if(response){
					this.allPowerPlansSubject.next(response);
					this.updateCache(response);
				}
			});
		}
	}
	public setTurnoffHDD(option: string) {
		if (this.devicePowerDPM) {
			return this.devicePowerDPM.setTurnoffHDD(option).then(response => {
				// response = this.mockResponse;
				if(response){
					this.allPowerPlansSubject.next(response);
					this.updateCache(response);
				}
			});
		}
	}
	public setSleepAfter(option: string) {
		if (this.devicePowerDPM) {
			return this.devicePowerDPM.setSleepAfter(option).then(response => {
				// response = this.mockResponse;
				if(response){
					this.allPowerPlansSubject.next(response);
					this.updateCache(response);
				}
			});
		}
	}
	public setHibernateAfter(option: string) {
		if (this.devicePowerDPM) {
			return this.devicePowerDPM.setHibernateAfter(option).then(response => {
				// response = this.mockResponse;
				if(response){
					this.allPowerPlansSubject.next(response);
					this.updateCache(response);
				}
			});
		}
	}

	public setCurrentPowerPlan(planName: string) {
		this.allPowerPlansCache.activePowerPlan = planName;
		this.allPowerPlansSubject.next(this.allPowerPlansCache);
		if (this.devicePowerDPM) {
			return this.devicePowerDPM.setCurrentPowerPlan(planName).then(response => {
				// response = this.mockResponse;
				if(response){
					this.allPowerPlansSubject.next(response);
					this.updateCache(response);
				}
			});
		}
	}

	private updateCache(allPowerPlans) {
		if (allPowerPlans) {
			let localCacheVal = JSON.stringify(allPowerPlans);
			this.commonService.setLocalStorageValue(LocalStorageKey.DPMAllPowerPlans, localCacheVal);
			this.allPowerPlansCache = allPowerPlans;
		}
	}
}
