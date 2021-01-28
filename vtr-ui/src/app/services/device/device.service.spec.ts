import { fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { AndroidService } from '../android/android.service';
import { CommonService } from '../common/common.service';
import { LocalCacheService } from '../local-cache/local-cache.service';
import { LoggerService } from '../logger/logger.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';

import { DeviceService } from './device.service';

const deviceMock = {};

const sysinfoMock = {
	getMachineType: () => {
		return 1;
	},
};

describe('DeviceService', () => {
	let deviceService: DeviceService;
	const vantageShellServiceMock = <VantageShellService>{
		getDevice: null,
		getSysinfo: null,
		getMicrophoneSettings: null,
		getWindows: null,
	};
	const commonService = <CommonService>{};
	const androidService = <AndroidService>{};
	const router = <Router>{};
	const logger = <LoggerService>{};
	const hypSettings = null;
	const localCacheService = <LocalCacheService>{
		getLocalCacheValue: null,
		setLocalCacheValue: null,
	};

	beforeEach(() => {
		spyOn(vantageShellServiceMock, 'getDevice').and.returnValue(deviceMock);
		spyOn(vantageShellServiceMock, 'getSysinfo').and.returnValue(sysinfoMock);
		spyOn(vantageShellServiceMock, 'getMicrophoneSettings');
		spyOn(vantageShellServiceMock, 'getWindows');

		deviceService = new DeviceService(
			vantageShellServiceMock,
			commonService,
			androidService,
			router,
			logger,
			hypSettings,
			localCacheService
		);
	});

	it('Given the cache and local variable does not have values When call getMachineType then should call the getMachineType service and return the machine type', fakeAsync(() => {
		spyOn(deviceService['localCacheService'], 'getLocalCacheValue')
			.withArgs(LocalStorageKey.MachineType, -1)
			.and.returnValue(-1);
		const setLocalCache = spyOn(deviceService['localCacheService'], 'setLocalCacheValue');
		const desktopMachineCache = setLocalCache
			.withArgs(LocalStorageKey.DesktopMachine, false)
			.and.returnValue(Promise.resolve());
		const machineTypeCache = setLocalCache
			.withArgs(LocalStorageKey.MachineType, 1)
			.and.returnValue(Promise.resolve());

		let machineType: any = -10;
		deviceService.getMachineType().then((value) => (machineType = value));

		tick();
		expect(machineType).toBe(1);
		expect(desktopMachineCache).toHaveBeenCalled();
		expect(machineTypeCache).toHaveBeenCalled();
	}));

	it('#identifySMBMachine should identify smb machine', fakeAsync(() => {
		(deviceService as any).identifySMBMachine('thinkbook 16p gen2');
		expect(deviceService.isSMB).toBe(true);
		expect(deviceService.isSMB).toBe(true);
	}));
});
