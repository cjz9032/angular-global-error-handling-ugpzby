import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { AllPowerPlans } from 'src/app/data-models/dpm/all-power-plans.model';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { PowerPlan } from 'src/app/data-models/dpm/power-plan.model';
import { map } from 'rxjs/operators';
import { LoggerService } from '../logger/logger.service';
import { LocalCacheService } from '../local-cache/local-cache.service';

@Injectable({
	providedIn: 'root'
})
export class PowerDpmService implements OnDestroy {
	private devicePowerDPM: any;
	private allPowerPlansSubject: BehaviorSubject<AllPowerPlans>;
	private currentPowerPlanObs: Observable<PowerPlan>;
	private allPowerPlansCache: AllPowerPlans;
	private refreshInterval;
	private currentRequestId = 0;

	constructor(
		private loggerService: LoggerService,
		private shellService: VantageShellService,
		private localCacheService: LocalCacheService
	) {
		this.devicePowerDPM = this.shellService.getPowerDPM();
	}
	ngOnDestroy(): void {
		if (this.refreshInterval) {
			clearInterval(this.refreshInterval);
			this.refreshInterval = null;
		}
	}
	getAllPowerPlansObs(): Observable<AllPowerPlans> {
		if (!this.allPowerPlansSubject) {
			const localCacheVal = this.localCacheService.getLocalCacheValue(
				LocalStorageKey.DPMAllPowerPlans,
				null
			);
			this.allPowerPlansCache = JSON.parse(localCacheVal);
			this.allPowerPlansSubject = new BehaviorSubject<AllPowerPlans>(this.allPowerPlansCache);
			this.startRefreshPowerPlans();
		}
		return this.allPowerPlansSubject.pipe(
			map((allPowerPlans) => this.preprocessAllPowerPlans(allPowerPlans))
		);
	}

	getCurrentPowerPlanObs(): Observable<PowerPlan> {
		if (!this.currentPowerPlanObs) {
			this.currentPowerPlanObs = this.getAllPowerPlansObs().pipe(
				map((allPowerPlans) => this.getCurrentPowerPlan(allPowerPlans))
			);
		}
		return this.currentPowerPlanObs;
	}

	setPowerButton(action: string) {
		if (this.devicePowerDPM) {
			const requestId = new Date().getTime();
			this.currentRequestId = requestId;
			this.loggerService.info('DPM setPowerButton, requestId:' + requestId);
			return this.devicePowerDPM.setPowerButton(action).then((response) => {
				// response = this.mockResponse;
				this.resolveCommonResponse(response, requestId);
			});
		}
		return undefined;
	}

	setSignInOption(option: string) {
		if (this.devicePowerDPM) {
			const requestId = new Date().getTime();
			this.currentRequestId = requestId;
			this.loggerService.info('DPM setSignInOption, requestId:' + requestId);
			return this.devicePowerDPM.setSignInOption(option).then((response) => {
				// response = this.mockResponse;
				this.resolveCommonResponse(response, requestId);
			});
		}
	}

	setTurnoffDisplay(option: string) {
		if (this.devicePowerDPM) {
			const requestId = new Date().getTime();
			this.currentRequestId = requestId;
			this.loggerService.info('DPM setTurnoffDisplay, requestId:' + requestId);
			return this.devicePowerDPM.setTurnoffDisplay(option).then((response) => {
				// response = this.mockResponse;
				this.resolveCommonResponse(response, requestId);
			});
		}
	}

	setTurnoffHDD(option: string) {
		if (this.devicePowerDPM) {
			const requestId = new Date().getTime();
			this.currentRequestId = requestId;
			this.loggerService.info('DPM setTurnoffHDD, requestId:' + requestId);
			return this.devicePowerDPM.setTurnoffHDD(option).then((response) => {
				// response = this.mockResponse;
				this.resolveCommonResponse(response, requestId);
			});
		}
	}

	setSleepAfter(option: string) {
		if (this.devicePowerDPM) {
			const requestId = new Date().getTime();
			this.currentRequestId = requestId;
			this.loggerService.info('DPM setSleepAfter, requestId:' + requestId);
			return this.devicePowerDPM.setSleepAfter(option).then((response) => {
				// response = this.mockResponse;
				this.resolveCommonResponse(response, requestId);
			});
		}
	}

	setHibernateAfter(option: string) {
		if (this.devicePowerDPM) {
			const requestId = new Date().getTime();
			this.currentRequestId = requestId;
			this.loggerService.info('DPM setHibernateAfter, requestId:' + requestId);
			return this.devicePowerDPM.setHibernateAfter(option).then((response) => {
				// response = this.mockResponse;
				this.resolveCommonResponse(response, requestId);
			});
		}
	}

	setCurrentPowerPlan(planName: string) {
		if (this.allPowerPlansCache) {
			this.allPowerPlansCache.activePowerPlan = planName;
		}
		if (this.allPowerPlansSubject) {
			this.loggerService.info(
				'DPM setCurrentPowerPlan notify UI to refresh by cache, planName:' + planName
			);
			this.allPowerPlansSubject.next(this.allPowerPlansCache);
		}
		if (this.devicePowerDPM) {
			const requestId = new Date().getTime();
			this.currentRequestId = requestId;
			this.loggerService.info('DPM setCurrentPowerPlan, requestId:' + requestId);
			return this.devicePowerDPM.setCurrentPowerPlan(planName).then((response) => {
				// response = this.mockResponse;
				this.resolveCommonResponse(response, requestId);
			});
		}
	}

	private preprocessAllPowerPlans(allPowerPlans: AllPowerPlans): AllPowerPlans {
		if (allPowerPlans) {
			allPowerPlans.powerPlanList.forEach((p) => {
				p.settingList.forEach((s) => {
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
						default:
							break;
					}
				});
			});
		}

		return allPowerPlans;
	}

	private getCurrentPowerPlan(allPowerPlans: AllPowerPlans): PowerPlan {
		let currentPowerPlan = null;
		if (allPowerPlans) {
			const currentPowerPlanName = allPowerPlans.activePowerPlan;
			if (currentPowerPlanName && allPowerPlans.powerPlanList) {
				currentPowerPlan = allPowerPlans.powerPlanList.find(
					(p) => p.powerPlanName === currentPowerPlanName
				);
			}
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
			const requestId = new Date().getTime();
			this.currentRequestId = requestId;
			this.loggerService.info('DPM getAllPowerPlans, requestId:' + requestId);
			this.devicePowerDPM.getAllPowerPlans().then((response) => {
				// response = this.mockResponse;
				this.resolveCommonResponse(response, requestId);
			});
		}
	}

	private resolveCommonResponse(response: any, requestId: number) {
		if (response && this.currentRequestId === requestId) {
			if (this.allPowerPlansSubject) {
				this.loggerService.info(
					'DPM resolveCommonResponse notify UI to refresh, requestId:' +
						requestId +
						',currentRequestId:' +
						this.currentRequestId
				);
				this.allPowerPlansSubject.next(response);
			}
			this.updateCache(response);
		}
	}

	private updateCache(allPowerPlans) {
		if (allPowerPlans) {
			const localCacheVal = JSON.stringify(allPowerPlans);
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.DPMAllPowerPlans,
				localCacheVal
			);
			this.allPowerPlansCache = allPowerPlans;
		}
	}
}
