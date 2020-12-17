import { TestBed, waitForAsync } from '@angular/core/testing';
import { GamingAdvancedOCService } from './gaming-advanced-oc.service';
import { HttpClientModule } from '@angular/common/http';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';

describe('GamingAdvancedOCService', () => {
	let shellService: VantageShellService;
	let gamingAdvancedOCService: GamingAdvancedOCService;

	describe('isShellAvailable is false: ', () => {
		beforeEach(() => {
			const spy = jasmine.createSpyObj('VantageService', ['getGamingAdvancedOC']);
			spy.getGamingAdvancedOC.and.returnValue(undefined);
			TestBed.configureTestingModule({
				imports: [HttpClientModule],
				providers: [
					GamingAdvancedOCService,
					{ provide: VantageShellService, useValue: spy },
				],
			});
			gamingAdvancedOCService = TestBed.inject(GamingAdvancedOCService);
			shellService = TestBed.inject(VantageShellService);
		});
		it('inject shellService', () => {
			expect(shellService).toBeTruthy();
		});
		it('inject gamingAdvancedOCService', () => {
			expect(gamingAdvancedOCService).toBeTruthy();
		});
		it('shellService.getGamingAdvancedOC() should return undefined', () => {
			expect(shellService.getGamingAdvancedOC()).toBeUndefined();
		});
		it('gamingAdvancedOCService.isShellAvailable is false', () => {
			expect(gamingAdvancedOCService.isShellAvailable).toBe(false);
		});
		it('gamingAdvancedOCService.getAdvancedOCInfo should return undefined', () => {
			expect(gamingAdvancedOCService.getAdvancedOCInfo()).toBeUndefined();
		});
		it('gamingAdvancedOCService.setAdvancedOCInfo should return undefined', () => {
			spyOn(gamingAdvancedOCService, 'getAdvancedOCInfo').and.callThrough();
			expect(
				gamingAdvancedOCService.setAdvancedOCInfo(
					gamingAdvancedOCService.getAdvancedOCInfo()
				)
			).toBeUndefined();
		});
	});

	describe('isShellAvailable is true: ', () => {
		const advancedOCInfo: any = {
			cpuParameterList: [
				{
					tuneId: 116,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 117,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
			],
			gpuParameterList: [
				{
					tuneId: 0,
					defaultValue: '100',
					OCValue: '100',
					minValue: '200',
					maxValue: '300',
					stepValue: '1',
				},
				{
					tuneId: 1,
					defaultValue: '100',
					OCValue: '100',
					minValue: '200',
					maxValue: '300',
					stepValue: '1',
				},
			],
		};
		beforeEach(() => {
			const spy = jasmine.createSpyObj('VantageService', ['getGamingAdvancedOC']);
			const spyValue = {
				getAdvancedOCInfo: () =>
					new Promise((resolve, reject) => {
						if (advancedOCInfo) {
							resolve(advancedOCInfo);
						}
						reject('advancedOCInfo error');
					}),
				setAdvancedOCInfo: (value: any) =>
					new Promise((resolve, reject) => {
						if (value) {
							resolve(true);
						} else {
							resolve(false);
						}
						reject('setAdvancedOCInfo error');
					}),
			};
			spy.getGamingAdvancedOC.and.returnValue(spyValue);
			TestBed.configureTestingModule({
				imports: [HttpClientModule],
				providers: [
					GamingAdvancedOCService,
					{ provide: VantageShellService, useValue: spy },
				],
			});
			gamingAdvancedOCService = TestBed.inject(GamingAdvancedOCService);
			shellService = TestBed.inject(VantageShellService);
		});
		const setup = () => {
			const service = TestBed.get(GamingAdvancedOCService);
			return { service };
		};
		it('inject shellService', () => {
			expect(shellService).toBeTruthy();
		});
		it('inject gamingAdvancedOCService', () => {
			expect(gamingAdvancedOCService).toBeTruthy();
		});
		it('shellService.getGamingAdvancedOC() should return response', () => {
			expect(shellService.getGamingAdvancedOC()).toBeTruthy();
		});
		it('gamingAdvancedOCService.isShellAvailable is true', async () => {
			expect(gamingAdvancedOCService.isShellAvailable).toBe(true);
		});

		it('gamingAdvancedOCService.getAdvancedOCInfo should return response', async () => {
			gamingAdvancedOCService.getAdvancedOCInfo().then((res) => {
				expect(res).toBeTruthy();
			});
		});
		it('gamingAdvancedOCService.setAdvancedOCInfo should return ture', async () => {
			gamingAdvancedOCService
				.setAdvancedOCInfo(gamingAdvancedOCService.getAdvancedOCInfo())
				.then((res) => {
					expect(res).toBe(true);
				});
		});

		it('should call gamingAdvancedOCService.getAdvancedOCInfoCache', () => {
			const { service } = setup();
			spyOn(service, 'getAdvancedOCInfoCache').and.callThrough();
			service.getAdvancedOCInfoCache();
			expect(service.getAdvancedOCInfoCache).toHaveBeenCalled();
		});

		it('should call gamingAdvancedOCService.setAdvancedOCInfoCache', () => {
			const { service } = setup();
			spyOn(service, 'setAdvancedOCInfoCache').and.callThrough();
			service.setAdvancedOCInfoCache();
			expect(service.setAdvancedOCInfoCache).toHaveBeenCalled();
		});
	});

	describe('catch error: ', () => {
		beforeEach(() => {
			const spy = jasmine.createSpyObj('VantageService', ['getGamingAdvancedOC']);
			const stubValue = {
				getAdvancedOCInfo: () => {
					throw new Error('getAdvancedOCInfo error');
				},
				setAdvancedOCInfo: (value: any) => {
					throw new Error('setAdvancedOCInfo error');
				},
			};
			spy.getGamingAdvancedOC.and.returnValue(stubValue);
			TestBed.configureTestingModule({
				imports: [HttpClientModule],
				providers: [
					GamingAdvancedOCService,
					{ provide: VantageShellService, useValue: spy },
				],
			});
			gamingAdvancedOCService = TestBed.inject(GamingAdvancedOCService);
			shellService = TestBed.inject(VantageShellService);
		});

		it('getAdvancedOCInfo should return err', async () => {
			try {
				gamingAdvancedOCService.getAdvancedOCInfo();
			} catch (err) {
				expect(err).toMatch('getAdvancedOCInfo error');
			}
		});

		it('setAdvancedOCInfo should return err', async () => {
			const advancedOCInfo: any = {
				cpuParameterList: [
					{
						tuneId: 116,
						OCValue: '41',
						defaultValue: '40',
						minValue: '28',
						maxValue: '80',
						stepValue: '1',
					},
					{
						tuneId: 117,
						OCValue: '41',
						defaultValue: '40',
						minValue: '28',
						maxValue: '80',
						stepValue: '1',
					},
				],
				gpuParameterList: [
					{
						tuneId: 0,
						defaultValue: '100',
						OCValue: '100',
						minValue: '200',
						maxValue: '300',
						stepValue: '1',
					},
					{
						tuneId: 1,
						defaultValue: '100',
						OCValue: '100',
						minValue: '200',
						maxValue: '300',
						stepValue: '1',
					},
				],
			};
			try {
				gamingAdvancedOCService.setAdvancedOCInfo(advancedOCInfo);
			} catch (err) {
				expect(err).toMatch('setAdvancedOCInfo error');
			}
		});
	});
});
