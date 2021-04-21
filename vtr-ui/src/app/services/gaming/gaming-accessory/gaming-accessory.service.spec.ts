import { TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { GamingAccessoryService } from './gaming-accessory.service';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';
import { LoggerService } from '../../logger/logger.service';
import { WinRT } from '@lenovo/tan-client-bridge';

describe('GamingAccessoryService', () => {
	let shellService: VantageShellService;
	let gamingAccessoryService: GamingAccessoryService;

	describe('isShellAvailable is false', () => {
		beforeEach(() => {
			const spy = jasmine.createSpyObj('VantageService', [
				'getGamingAccessory',
				'getRegistryUtil',
				'getSystemUpdate',
				'getLogger',
			]);
			spy.getGamingAccessory.and.returnValue(undefined);
			spy.getRegistryUtil.and.returnValue(undefined);
			spy.getSystemUpdate.and.returnValue(undefined);
			TestBed.configureTestingModule({
				imports: [HttpClientModule],
				providers: [
					GamingAccessoryService,
					LoggerService,
					{ provide: VantageShellService, useValue: spy },
				],
			});

			gamingAccessoryService = TestBed.inject(GamingAccessoryService);
			shellService = TestBed.get(VantageShellService);
		});

		it('inject gamingAccessoryService & shellService', () => {
			expect(gamingAccessoryService).toBeTruthy('can not inject gamingOCService');
			expect(shellService).toBeTruthy('can not inject shellService');
		});

		it('shellService.getGamingAccessory() should return undefined', () => {
			expect(shellService.getGamingAccessory()).toBeUndefined();
		});

		it('shellService.getRegistryUtil() should return undefined', () => {
			expect(shellService.getRegistryUtil()).toBeUndefined();
		});

		it('shellService.getSystemUpdate() should return undefined', () => {
			expect(shellService.getSystemUpdate()).toBeUndefined();
		});

		it('isShellAvailable is false', () => {
			expect(gamingAccessoryService.isShellAvailable).toBe(false);
		});

		it('isLACSupportUriProtocol should return undefinde', () => {
			expect(gamingAccessoryService.isLACSupportUriProtocol()).toBeUndefined();
		});

		it('launchAccessory should return undefinde', () => {
			expect(gamingAccessoryService.launchAccessory(true)).toBeUndefined();
			expect(gamingAccessoryService.launchAccessory(false)).toBeUndefined();
			expect(gamingAccessoryService.launchAccessory(undefined)).toBeUndefined();
		});
	});
	describe('isShellAvailable is true', () => {
		const stubRes = {
			keyList: [1, 2],
		};
		beforeEach(() => {
			const spy = jasmine.createSpyObj('VantageService', [
				'getGamingAccessory',
				'getRegistryUtil',
				'getSystemUpdate',
				'getLogger',
			]);
			const stubRegValue = {
				queryValue: (regPath: string) => {
					Promise.resolve(stubRes);
				},
			};
			spy.getGamingAccessory.and.returnValue(
				new Promise((resolve) => {
					resolve(true);
				})
			);
			spy.getRegistryUtil.and.returnValue(stubRegValue);

			TestBed.configureTestingModule({
				imports: [HttpClientModule],
				providers: [
					GamingAccessoryService,
					LoggerService,
					{ provide: VantageShellService, useValue: spy },
				],
			});

			gamingAccessoryService = TestBed.inject(GamingAccessoryService);
			shellService = TestBed.get(VantageShellService);
		});

		it('inject gamingAccessoryService & shellService', () => {
			expect(gamingAccessoryService).toBeTruthy('can not inject gamingOCService');
			expect(shellService).toBeTruthy('can not inject shellService');
		});

		it('isShellAvailable is true', () => {
			expect(gamingAccessoryService.isShellAvailable).toBe(true);
		});

		it('register existed: isLACSupportUriProtocol should return true', waitForAsync(() => {
			stubRes.keyList = [1];
			gamingAccessoryService.isLACSupportUriProtocol().then((res) => {
				expect(res).toBe(true, 'isLACSupportUriProtocol should return true');
			});
		}));

		it('register unexisted: isLACSupportUriProtocolshould should return false', waitForAsync(() => {
			stubRes.keyList = [];
			gamingAccessoryService.isLACSupportUriProtocol().then((res) => {
				expect(res).toBe(false, 'isLACSupportUriProtocol should return false');
			});
		}));

		it('register existed: launch successed, should return true', waitForAsync(() => {
			spyOn(WinRT, 'launchUri').and.returnValue(true);
			gamingAccessoryService.launchAccessory(true).then((res) => {
				expect(res).toBe(true, 'launchAccessory should return true');
			});
		}));

		it('register existed: launch fail, should return false', waitForAsync(() => {
			spyOn(WinRT, 'launchUri').and.returnValue(false);
			gamingAccessoryService.launchAccessory(true).then((res) => {
				expect(res).toBe(false, 'launchAccessory should return false');
			});
		}));

		it('register unexisted: stop launch and return undefined', () => {
			expect(gamingAccessoryService.launchAccessory(false)).toBeUndefined();
		});
	});
	describe('catch error', () => {
		beforeEach(() => {
			const spy = jasmine.createSpyObj('VantageService', [
				'getGamingAccessory',
				'getRegistryUtil',
				'getSystemUpdate',
				'getLogger',
			]);
			const stubRegValue = {
				queryValue: (regPath: string) => {
					throw new Error('queryValue error');
				},
			};
			spy.getGamingAccessory.and.returnValue(
				new Promise((resolve) => {
					resolve(true);
				})
			);
			spy.getRegistryUtil.and.returnValue(stubRegValue);

			TestBed.configureTestingModule({
				imports: [HttpClientModule],
				providers: [
					GamingAccessoryService,
					LoggerService,
					{ provide: VantageShellService, useValue: spy },
				],
			});

			gamingAccessoryService = TestBed.inject(GamingAccessoryService);
			shellService = TestBed.get(VantageShellService);
		});

		it('inject gamingAccessoryService & shellService', () => {
			expect(gamingAccessoryService).toBeTruthy('can not inject gamingOCService');
			expect(shellService).toBeTruthy('can not inject shellService');
		});

		it('isShellAvailable is true', () => {
			expect(gamingAccessoryService.isShellAvailable).toBe(true);
		});

		it('isLACSupportUriProtocol should return err', waitForAsync(() => {
			gamingAccessoryService
				.isLACSupportUriProtocol()
				.then()
				.catch((err) => {
					expect(err).toMatch('queryValue error');
				});
		}));

		it('launchAccessory should return err', async () => {
			gamingAccessoryService.isShellAvailable = true;
			spyOn(WinRT, 'launchUri').and.throwError('WinRT.launchUri error');
			try {
				gamingAccessoryService
					.launchAccessory(true)
					.then()
					.catch((err) => {
						expect(err).toMatch('WinRT.launchUri error');
					});
			} catch (err) {
				expect(err.errorMessage).toEqual('WinRT.launchUri error');
			}
		});
	});
});
