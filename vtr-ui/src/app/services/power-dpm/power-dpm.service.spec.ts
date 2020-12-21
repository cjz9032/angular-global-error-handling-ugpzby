import { TestBed, tick, fakeAsync } from '@angular/core/testing';

import { PowerDpmService } from './power-dpm.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { CommonService } from '../common/common.service';
import { AllPowerPlans } from 'src/app/data-models/dpm/all-power-plans.model';
import { HttpClientModule } from '@angular/common/http';
import { PowerPlan } from 'src/app/data-models/dpm/power-plan.model';

describe('PowerDpmService', () => {
	let powerDpmService: PowerDpmService;
	let vantageShellService: VantageShellService;
	let commonService: CommonService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			schemas: [NO_ERRORS_SCHEMA],
			providers: [PowerDpmService, VantageShellService, CommonService],
			imports: [HttpClientModule],
		});
		vantageShellService = TestBed.inject(VantageShellService);
		commonService = TestBed.inject(CommonService);
	});

	it('should be created', () => {
		powerDpmService = TestBed.inject(PowerDpmService);
		expect(powerDpmService).toBeTruthy();
	});

	it('#getAllPowerPlansObs should emit AllPowerPlans', fakeAsync(() => {
		let allPowerPlans = null;
		const mockAllPowerPlans = {
			activePowerPlan: 'Balanced',
			powerPlanList: [
				{
					powerPlanName: 'Balanced',
					preDefined: true,
					hddTimeoutAC: 120,
					hiberTimeoutAC: 15,
					suspendTimeoutAC: 0,
					videoTimeoutAC: 45,
					performance: 5,
					temperature: 4,
					powerUsage: 7,
					cpuSpeed: 'cpuSpeedAdaptive',
					brightness: 100,
					settingList: [
						{
							key: 'PowerPlan',
							value: 'Balanced',
						},
						{
							key: 'PreDefined',
							value: 'SystemDefined',
						},
						{
							key: 'HDDTimeoutAC',
							value: '120',
						},
						{
							key: 'HiberTimeoutAC',
							value: '15',
						},
						{
							key: 'SuspendTimeoutAC',
							value: '0',
						},
						{
							key: 'VideoTimeoutAC',
							value: '45',
						},
						{
							key: 'Performance',
							value: '5',
						},
						{
							key: 'Temperature',
							value: '4',
						},
						{
							key: 'PowerUsage',
							value: '7',
						},
						{
							key: 'CPUSpeed',
							value: 'cpuSpeedAdaptive',
						},
						{
							key: 'Brightness',
							value: '100',
						},
					],
				} as PowerPlan,
			],
		} as AllPowerPlans;
		const mockPowerDpm = {
			getAllPowerPlans: () => new Promise((resolve) => {
					resolve(mockAllPowerPlans);
				}),
		};
		spyOn(commonService, 'getLocalStorageValue').and.returnValue(null);
		spyOn(vantageShellService, 'getPowerDPM').and.returnValue(mockPowerDpm);
		powerDpmService = TestBed.get(PowerDpmService);
		powerDpmService.getAllPowerPlansObs().subscribe((ap) => {
			allPowerPlans = ap;
		});
		expect(allPowerPlans).toBeNull();
		tick(30000);
		expect(allPowerPlans).not.toBeNull();
		powerDpmService.ngOnDestroy();
	}));

	// it('#getCurrentPowerPlanObs should emit current PowerPlan', () => {
	// 	let currentPowerPlan = null;
	// 	let mockAllPowerPlans = { activePowerPlan: 'Balanced', powerPlanList: [] } as AllPowerPlans;
	// 	powerDpmService = TestBed.get(PowerDpmService);
	// 	spyOn(powerDpmService, 'getAllPowerPlansObs').and.returnValue(of(mockAllPowerPlans));
	// 	powerDpmService.getCurrentPowerPlanObs().subscribe((p) => {
	// 		currentPowerPlan = p;
	// 	});
	// 	expect(currentPowerPlan.powerPlanName).toEqual('Balanced');
	// });

	it('#setPowerButton should call devicePowerDPM.setPowerButton', () => {
		const mockAllPowerPlans = { activePowerPlan: 'Balanced', powerPlanList: [] } as AllPowerPlans;
		const mockPowerDpm = {
			setPowerButton: () => new Promise((resolve) => {
					resolve(mockAllPowerPlans);
				}),
		};
		spyOn(vantageShellService, 'getPowerDPM').and.returnValue(mockPowerDpm);
		powerDpmService = TestBed.get(PowerDpmService);
		spyOn(mockPowerDpm, 'setPowerButton').and.callThrough();
		powerDpmService.setPowerButton('Nothing');
		expect(mockPowerDpm.setPowerButton).toHaveBeenCalled();
	});

	it('#setSignInOption should call devicePowerDPM.setSignInOption', () => {
		const mockAllPowerPlans = { activePowerPlan: 'Balanced', powerPlanList: [] } as AllPowerPlans;
		const mockPowerDpm = {
			setSignInOption: () => new Promise((resolve) => {
					resolve(mockAllPowerPlans);
				}),
		};
		spyOn(vantageShellService, 'getPowerDPM').and.returnValue(mockPowerDpm);
		powerDpmService = TestBed.get(PowerDpmService);
		spyOn(mockPowerDpm, 'setSignInOption').and.callThrough();
		powerDpmService.setSignInOption('1');
		expect(mockPowerDpm.setSignInOption).toHaveBeenCalled();
	});

	it('#setTurnoffDisplay should call devicePowerDPM.setTurnoffDisplay', () => {
		const mockAllPowerPlans = { activePowerPlan: 'Balanced', powerPlanList: [] } as AllPowerPlans;
		const mockPowerDpm = {
			setTurnoffDisplay: () => new Promise((resolve) => {
					resolve(mockAllPowerPlans);
				}),
		};
		spyOn(vantageShellService, 'getPowerDPM').and.returnValue(mockPowerDpm);
		powerDpmService = TestBed.get(PowerDpmService);
		spyOn(mockPowerDpm, 'setTurnoffDisplay').and.callThrough();
		powerDpmService.setTurnoffDisplay('1');
		expect(mockPowerDpm.setTurnoffDisplay).toHaveBeenCalled();
	});

	it('#setTurnoffHDD should call devicePowerDPM.setTurnoffHDD', () => {
		const mockAllPowerPlans = { activePowerPlan: 'Balanced', powerPlanList: [] } as AllPowerPlans;
		const mockPowerDpm = {
			setTurnoffHDD: () => new Promise((resolve) => {
					resolve(mockAllPowerPlans);
				}),
		};
		spyOn(vantageShellService, 'getPowerDPM').and.returnValue(mockPowerDpm);
		powerDpmService = TestBed.get(PowerDpmService);
		spyOn(mockPowerDpm, 'setTurnoffHDD').and.callThrough();
		powerDpmService.setTurnoffHDD('1');
		expect(mockPowerDpm.setTurnoffHDD).toHaveBeenCalled();
	});

	it('#setSleepAfter should call devicePowerDPM.setSleepAfter', () => {
		const mockAllPowerPlans = { activePowerPlan: 'Balanced', powerPlanList: [] } as AllPowerPlans;
		const mockPowerDpm = {
			setSleepAfter: () => new Promise((resolve) => {
					resolve(mockAllPowerPlans);
				}),
		};
		spyOn(vantageShellService, 'getPowerDPM').and.returnValue(mockPowerDpm);
		powerDpmService = TestBed.get(PowerDpmService);
		spyOn(mockPowerDpm, 'setSleepAfter').and.callThrough();
		powerDpmService.setSleepAfter('1');
		expect(mockPowerDpm.setSleepAfter).toHaveBeenCalled();
	});

	it('#setHibernateAfter should call devicePowerDPM.setHibernateAfter', () => {
		const mockAllPowerPlans = { activePowerPlan: 'Balanced', powerPlanList: [] } as AllPowerPlans;
		const mockPowerDpm = {
			setHibernateAfter: () => new Promise((resolve) => {
					resolve(mockAllPowerPlans);
				}),
		};
		spyOn(vantageShellService, 'getPowerDPM').and.returnValue(mockPowerDpm);
		powerDpmService = TestBed.get(PowerDpmService);
		spyOn(mockPowerDpm, 'setHibernateAfter').and.callThrough();
		powerDpmService.setHibernateAfter('1');
		expect(mockPowerDpm.setHibernateAfter).toHaveBeenCalled();
	});

	it('#setCurrentPowerPlan should call devicePowerDPM.setCurrentPowerPlan', () => {
		const mockAllPowerPlans = {
			activePowerPlan: 'Balanced',
			powerPlanList: [],
		} as AllPowerPlans;
		const mockPowerDpm = {
			setCurrentPowerPlan: () => new Promise((resolve) => {
					resolve(mockAllPowerPlans);
				}),
		};
		spyOn(vantageShellService, 'getPowerDPM').and.returnValue(mockPowerDpm);
		powerDpmService = TestBed.get(PowerDpmService);
		spyOn(mockPowerDpm, 'setCurrentPowerPlan').and.callThrough();
		powerDpmService.setCurrentPowerPlan('Balance');
		expect(mockPowerDpm.setCurrentPowerPlan).toHaveBeenCalled();
	});
});
