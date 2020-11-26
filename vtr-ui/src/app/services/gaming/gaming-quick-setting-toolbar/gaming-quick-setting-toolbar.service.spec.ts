import { TestBed } from '@angular/core/testing';
import { GamingQuickSettingToolbarService } from './gaming-quick-setting-toolbar.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';

describe('GamingQuickSettingToolbarService', () => {
	let shellService: VantageShellService;
	let gamingQuickSettingToolbarService: GamingQuickSettingToolbarService;

	describe('isShellAvailable is false: ', () => {
		beforeEach(() => {
			const spy = jasmine.createSpyObj('VantageService', ['getQuickSettingToolbar']);
			spy.getQuickSettingToolbar.and.returnValue(undefined);
			TestBed.configureTestingModule({
				imports: [HttpClientModule],
				providers: [
					HttpClient,
					GamingQuickSettingToolbarService,
					{ provide: VantageShellService, useValue: spy },
				],
			});
			gamingQuickSettingToolbarService = TestBed.inject(GamingQuickSettingToolbarService);
			shellService = TestBed.inject(VantageShellService);
		});
		it('inject shellService', () => {
			expect(shellService).toBeTruthy();
		});
		it('inject gamingQuickSettingToolbarService', () => {
			expect(gamingQuickSettingToolbarService).toBeTruthy();
		});
		it('shellService.getQuickSettingToolbar() should return undefined', () => {
			expect(shellService.getQuickSettingToolbar()).toBeUndefined();
		});
		it('gamingQuickSettingToolbarService.isShellAvailable is false', () => {
			expect(gamingQuickSettingToolbarService.isShellAvailable).toBe(false);
		});
		it('gamingQuickSettingToolbarService.registerEvent should return undefined', () => {
			expect(gamingQuickSettingToolbarService.registerEvent('NetworkBoost')).toBeUndefined();
		});
		it('gamingQuickSettingToolbarService.unregisterEvent should return undefined', () => {
			expect(
				gamingQuickSettingToolbarService.unregisterEvent('NetworkBoost')
			).toBeUndefined();
		});
	});

	describe('isShellAvailable is true: ', () => {
		beforeEach(() => {
			const spy = jasmine.createSpyObj('VantageService', ['getQuickSettingToolbar']);
			let spyValue = {
				registerEvent(type: any) {
					return new Promise((resolve, reject) => {
						if (type) {
							resolve(true);
						}
						reject('registerEvent error');
					});
				},
				unregisterEvent(type: any) {
					return new Promise((resolve, reject) => {
						if (type) {
							resolve(true);
						}
						reject('unregisterEvent error');
					});
				},
			};
			spy.getQuickSettingToolbar.and.returnValue(spyValue);
			TestBed.configureTestingModule({
				imports: [HttpClientModule],
				providers: [
					HttpClient,
					GamingQuickSettingToolbarService,
					{ provide: VantageShellService, useValue: spy },
				],
			});
			gamingQuickSettingToolbarService = TestBed.inject(GamingQuickSettingToolbarService);
			shellService = TestBed.inject(VantageShellService);
		});
		function setup() {
			const service = TestBed.get(GamingQuickSettingToolbarService);
			return { service };
		}
		it('inject shellService', () => {
			expect(shellService).toBeTruthy();
		});
		it('inject gamingQuickSettingToolbarService', () => {
			expect(gamingQuickSettingToolbarService).toBeTruthy();
		});
		it('shellService.getQuickSettingToolbar() should return response', () => {
			expect(shellService.getQuickSettingToolbar()).toBeTruthy();
		});
		it('gamingQuickSettingToolbarService.isShellAvailable is true', async () => {
			expect(gamingQuickSettingToolbarService.isShellAvailable).toBe(true);
		});

		it('gamingQuickSettingToolbarService.registerEvent should return response', async () => {
			gamingQuickSettingToolbarService.registerEvent('NetworkBoost').then((res) => {
				expect(res).toBeTruthy();
			});
		});
		it('gamingQuickSettingToolbarService.unregisterEvent should return response', async () => {
			gamingQuickSettingToolbarService.unregisterEvent('NetworkBoost').then((res) => {
				expect(res).toBeTruthy();
			});
		});
	});

	describe('catch error: ', () => {
		beforeEach(() => {
			const spy = jasmine.createSpyObj('VantageService', ['getQuickSettingToolbar']);
			const stubValue = {
				registerEvent(type: string) {
					if (typeof type !== 'string') {
						throw new Error('registerEvent error');
					}
				},
				unregisterEvent(type: string) {
					if (typeof type !== 'string') {
						throw new Error('unregisterEvent error');
					}
				},
			};
			spy.getQuickSettingToolbar.and.returnValue(stubValue);
			TestBed.configureTestingModule({
				imports: [HttpClientModule],
				providers: [
					HttpClient,
					GamingQuickSettingToolbarService,
					{ provide: VantageShellService, useValue: spy },
				],
			});
			gamingQuickSettingToolbarService = TestBed.inject(GamingQuickSettingToolbarService);
			shellService = TestBed.inject(VantageShellService);
		});

		it('registerEvent should return err', async () => {
			try {
				gamingQuickSettingToolbarService.registerEvent(false);
			} catch (err) {
				expect(err).toMatch('registerEvent error');
			}
		});

		it('unregisterEvent should return err', async () => {
			try {
				gamingQuickSettingToolbarService.unregisterEvent(false);
			} catch (err) {
				expect(err).toMatch('unregisterEvent error');
			}
		});
	});
});
