import { TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { GamingThirdPartyAppService } from './gaming-third-party-app.service';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';
import { LoggerService } from '../../logger/logger.service';
import { WinRT } from '@lenovo/tan-client-bridge';

describe('GamingThirdPartyAppService', () => {
	let shellService: VantageShellService;
	let gamingThirdPartyAppService: GamingThirdPartyAppService;

	describe('isShellAvailable is false', () => {
		beforeEach(() => {
			const spy = jasmine.createSpyObj('VantageService', [
				'getRegistryUtil',
				'getLogger',
			]);
			spy.getRegistryUtil.and.returnValue(undefined);
			TestBed.configureTestingModule({
				imports: [HttpClientModule],
				providers: [
					GamingThirdPartyAppService,
					LoggerService,
					{ provide: VantageShellService, useValue: spy },
				],
			});
			gamingThirdPartyAppService = TestBed.inject(GamingThirdPartyAppService);
			shellService = TestBed.get(VantageShellService);
		});

		it('inject shellService', () => {
			expect(shellService).toBeTruthy('can not inject shellService');
		});

		it('shellService.getRegistryUtil() should return undefined', () => {
			expect(shellService.getRegistryUtil()).toBeUndefined();
		});

		it('isShellAvailable is false', () => {
			expect(gamingThirdPartyAppService.isShellAvailable).toBe(false);
		});

		it('isLACSupportUriProtocol should return undefinde', () => {
			expect(gamingThirdPartyAppService.isLACSupportUriProtocol('accessory')).toBeUndefined();
		});

		it('launchThirdPartyApp should return undefinde', () => {
			expect(gamingThirdPartyAppService.launchThirdPartyApp(true, 'accessory')).toBeUndefined();
			expect(gamingThirdPartyAppService.launchThirdPartyApp(false, `accessory`)).toBeUndefined();
			expect(gamingThirdPartyAppService.launchThirdPartyApp(undefined, `accessory`)).toBeUndefined();
		});
	});
	describe('isShellAvailable is true', () => {
		const stubRes = {
			keyList: [1, 2],
		};
		beforeEach(() => {
			const spy = jasmine.createSpyObj('VantageService', [
				'getRegistryUtil',
				'getLogger',
			]);
			const stubRegValue = {
				queryValue: (regPath: string) => {
					return Promise.resolve(stubRes);
				},
			};
			spy.getRegistryUtil.and.returnValue(stubRegValue);
			TestBed.configureTestingModule({
				imports: [HttpClientModule],
				providers: [
					GamingThirdPartyAppService,
					LoggerService,
					{ provide: VantageShellService, useValue: spy },
				],
			});

			gamingThirdPartyAppService = TestBed.inject(GamingThirdPartyAppService);
			shellService = TestBed.get(VantageShellService);
		});

		it('inject shellService', () => {
			expect(shellService).toBeTruthy('can not inject shellService');
		});

		it('isShellAvailable is true', () => {
			expect(gamingThirdPartyAppService.isShellAvailable).toBe(true);
		});

		it('register existed: isLACSupportUriProtocol should return true', waitForAsync(() => {
			stubRes.keyList = [1];
			gamingThirdPartyAppService.isLACSupportUriProtocol('accessory').then((res) => {
				expect(res).toBe(true, 'isLACSupportUriProtocol should return true');
			});
		}));

		it('register unexisted: isLACSupportUriProtocolshould should return false', waitForAsync(() => {
			stubRes.keyList = [];
			gamingThirdPartyAppService.isLACSupportUriProtocol('accessory').then((res) => {
				expect(res).toBe(false, 'isLACSupportUriProtocol should return false');
			});
		}));

		it('register existed: launch successed, should return true', waitForAsync(() => {
			spyOn(WinRT, 'launchUri').and.returnValue(true);
			gamingThirdPartyAppService.launchThirdPartyApp(true, `accessory`).then((res) => {
				expect(res).toBe(true, 'launchThirdPartyApp should return true');
			});
		}));

		it('register existed: launch fail, should return false', waitForAsync(() => {
			spyOn(WinRT, 'launchUri').and.returnValue(false);
			gamingThirdPartyAppService.launchThirdPartyApp(true, `accessory`).then((res) => {
				expect(res).toBe(false, 'launchThirdPartyApp should return false');
			});
		}));

		it('register unexisted: stop launch and return undefined', () => {
			expect(gamingThirdPartyAppService.launchThirdPartyApp(false, `accessory`)).toBeUndefined();
		});
	});
	describe('catch error', () => {
		beforeEach(() => {
			const spy = jasmine.createSpyObj('VantageService', [
				'getRegistryUtil',
				'getLogger',
			]);
			const stubRegValue = {
				queryValue: (regPath: string) => {
					throw new Error('queryValue error');
				},
			};
			spy.getRegistryUtil.and.returnValue(stubRegValue);

			TestBed.configureTestingModule({
				imports: [HttpClientModule],
				providers: [
					GamingThirdPartyAppService,
					LoggerService,
					{ provide: VantageShellService, useValue: spy },
				],
			});

			gamingThirdPartyAppService = TestBed.inject(GamingThirdPartyAppService);
			shellService = TestBed.get(VantageShellService);
		});

		it('inject shellService', () => {
			expect(shellService).toBeTruthy('can not inject shellService');
		});

		it('isShellAvailable is true', () => {
			expect(gamingThirdPartyAppService.isShellAvailable).toBe(true);
		});

		it('isLACSupportUriProtocol should return err', waitForAsync(() => {
			gamingThirdPartyAppService.isLACSupportUriProtocol('accessory')
				.then()
				.catch((err) => {
					expect(err).toMatch('queryValue error');
				});
		}));

		it('launchThirdPartyApp should return err', async() => {
      // TODO
			gamingThirdPartyAppService.isShellAvailable = true;
      spyOn(WinRT, 'launchUri').and.throwError('WinRT.launchUri error');
			try {
        gamingThirdPartyAppService.launchThirdPartyApp(true, `accessory`)
        .then()
        .catch((err) => {
          expect(err.errorMessage).toMatch('WinRT.launchUri error');
        });
			} catch (err) {
				expect(err.errorMessage).toMatch('WinRT.launchUri error');
			}
		});
	});
});
