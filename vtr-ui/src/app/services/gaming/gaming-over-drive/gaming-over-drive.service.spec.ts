import { TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { GamingOverDriveService } from './gaming-over-drive.service';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';
import { LoggerService } from '../../logger/logger.service';

describe('GamingOverDriveService', () => {
	let shellService: VantageShellService;
	let gamingOverDriveService: GamingOverDriveService;

	describe('isShellAvailable is false', () => {
		beforeEach(() => {
			let spy = jasmine.createSpyObj('VantageService', ['getGamingOverDrive', 'getLogger']);
			spy.getGamingOverDrive.and.returnValue(undefined);
			TestBed.configureTestingModule({
				imports: [HttpClientModule],
				providers: [
					GamingOverDriveService,
					LoggerService,
					{ provide: VantageShellService, useValue: spy },
				],
			});
			gamingOverDriveService = TestBed.inject(GamingOverDriveService);
			shellService = TestBed.get(VantageShellService);
		});
		it('inject gamingOverDriveService & shellService', () => {
			expect(gamingOverDriveService).toBeTruthy('can not inject gamingOverDriveService');
			expect(shellService).toBeTruthy('can not inject shellService');
		});
		it('shellService.getGamingOverDrive() should return undefined', () => {
			expect(shellService.getGamingOverDrive()).toBeUndefined();
		});
		it('isShellAvailable is false', () => {
			expect(gamingOverDriveService.isShellAvailable).toBe(false);
		});
		it('get over drive status should return undefined', () => {
			expect(gamingOverDriveService.getOverDriveStatus()).toBeUndefined();
		});
		it('set over drive status should return undefined', () => {
			expect(gamingOverDriveService.setOverDriveStatus(true)).toBeUndefined();
			expect(gamingOverDriveService.setOverDriveStatus(false)).toBeUndefined();
		});
	});

	describe('isShellAvailable is true', () => {
		let overDriveStatus = true;
		let setReturnValue = false;
		beforeEach(() => {
			let spy = jasmine.createSpyObj('VantageService', ['getGamingOverDrive', 'getLogger']);
			let stubValue = {
				getOverDriveStatus() {
					return new Promise((resolve) => {
						resolve(overDriveStatus);
					});
				},
				setOverDriveStatus(value: boolean) {
					return new Promise((resolve) => {
						if (setReturnValue) {
							overDriveStatus = value;
						}
						resolve(setReturnValue);
					});
				},
			};
			spy.getGamingOverDrive.and.returnValue(stubValue);
			TestBed.configureTestingModule({
				imports: [HttpClientModule],
				providers: [
					GamingOverDriveService,
					LoggerService,
					{ provide: VantageShellService, useValue: spy },
				],
			});
			gamingOverDriveService = TestBed.inject(GamingOverDriveService);
			shellService = TestBed.get(VantageShellService);
		});
		it('inject gamingOverDriveService & shellService', () => {
			expect(gamingOverDriveService).toBeTruthy('can not inject gamingOverDriveService');
			expect(shellService).toBeTruthy('can not inject shellService');
		});

		it('isShellAvailable is true', () => {
			expect(gamingOverDriveService.isShellAvailable).toBe(true);
		});

		it('get over drive status should return boolean value', waitForAsync(() => {
			overDriveStatus = true;
			gamingOverDriveService.getOverDriveStatus().then((res) => {
				expect(res).toBe(true, 'getOverDriveStatus should return true');
			});

			overDriveStatus = false;
			gamingOverDriveService.getOverDriveStatus().then((res) => {
				expect(res).toBe(false, 'getOverDriveStatus should return false');
			});
		}));

		it('set over drive status should return boolean value', fakeAsync(() => {
			setReturnValue = true;
			overDriveStatus = false;
			gamingOverDriveService.setOverDriveStatus(true).then((res) => {
				expect(res).toBe(true, 'setReturnValue should be true');
				expect(overDriveStatus).toBe(
					true,
					`setReturnValue is ${setReturnValue}, set overDriveStatus to be true FAIL`
				);
			});
			tick();
			overDriveStatus = true;
			gamingOverDriveService.setOverDriveStatus(false).then((res) => {
				expect(res).toBe(true, 'setReturnValue should be true');
				expect(overDriveStatus).toBe(
					false,
					`setReturnValue is ${setReturnValue}, set overDriveStatus to be false FAIL`
				);
			});
			tick();
			setReturnValue = false;
			overDriveStatus = false;
			gamingOverDriveService.setOverDriveStatus(true).then((res) => {
				expect(res).toBe(false, 'setReturnValue should be false');
				expect(overDriveStatus).toBe(
					false,
					`setReturnValue is ${setReturnValue}, overDriveStatus should keep false`
				);
			});
			tick();
			overDriveStatus = true;
			gamingOverDriveService.setOverDriveStatus(false).then((res) => {
				expect(res).toBe(false, 'setReturnValue should be false');
				expect(overDriveStatus).toBe(
					true,
					`setReturnValue is ${setReturnValue}, overDriveStatus should keep true`
				);
			});
		}));
	});

	describe('catch error', () => {
		beforeEach(() => {
			let spy = jasmine.createSpyObj('VantageService', ['getGamingOverDrive', 'getLogger']);
			let stubValue = {
				getOverDriveStatus() {
					throw new Error('getOverDriveStatus error');
				},
				setOverDriveStatus(value: boolean) {
					throw new Error('setOverDriveStatus error');
				},
			};
			spy.getGamingOverDrive.and.returnValue(stubValue);
			TestBed.configureTestingModule({
				imports: [HttpClientModule],
				providers: [
					GamingOverDriveService,
					LoggerService,
					{ provide: VantageShellService, useValue: spy },
				],
			});
			gamingOverDriveService = TestBed.inject(GamingOverDriveService);
			shellService = TestBed.get(VantageShellService);
		});
		it('inject gamingOverDriveService & shellService', () => {
			expect(gamingOverDriveService).toBeTruthy('can not inject gamingOverDriveService');
			expect(shellService).toBeTruthy('can not inject shellService');
		});
		it('isShellAvailable is true', () => {
			expect(gamingOverDriveService.isShellAvailable).toBe(true);
		});
		it('get over drive status should return err', waitForAsync(() => {
			try {
				gamingOverDriveService.getOverDriveStatus();
			} catch (err) {
				expect(err).toMatch('getOverDriveStatus error');
			}
		}));
		it('set over drive status should return err', fakeAsync(() => {
			try {
				gamingOverDriveService.setOverDriveStatus(true);
			} catch (err) {
				expect(err).toMatch('setOverDriveStatus error');
			}
			try {
				gamingOverDriveService.setOverDriveStatus(false);
			} catch (err) {
				expect(err).toMatch('setOverDriveStatus error');
			}
		}));
	});
});
