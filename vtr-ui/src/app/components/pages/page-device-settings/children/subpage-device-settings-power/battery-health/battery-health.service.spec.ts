import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BatteryHealthService } from './battery-health.service';
import { VantageShellService } from '../../../../../../services/vantage-shell/vantage-shell.service';
import SpyObj = jasmine.SpyObj;
import { BatteryHealthLevel, BatteryHealthTip, BatteryLifeSpan } from './battery-health.enum';
import { LocalStorageKey } from '../../../../../../enums/local-storage-key.enum';
import { Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';

describe('BatteryHealthService', () => {
	let service: BatteryHealthService;
	let vantageShellService: VantageShellService;
	let localCacheService: LocalCacheService;
	let shellServiceSpy: SpyObj<VantageShellService>;
	let localCacheServiceSpy: SpyObj<LocalCacheService>;

	beforeEach(() => {
		shellServiceSpy = jasmine.createSpyObj<VantageShellService>('VantageShellService', [
			'getSmartBatteryInfo',
		]);
		localCacheServiceSpy = jasmine.createSpyObj<LocalCacheService>('LocalCacheService', [
			'setLocalCacheValue',
			'getLocalCacheValue',
		]);
		TestBed.configureTestingModule({
			providers: [
				BatteryHealthService,
				{ provide: VantageShellService, useValue: shellServiceSpy },
				{ provide: LocalCacheService, useValue: localCacheServiceSpy },
			],
		});
		vantageShellService = TestBed.inject(VantageShellService);
		localCacheService = TestBed.inject(LocalCacheService);
	});

	it('should be created', () => {
		service = TestBed.inject(BatteryHealthService);
		expect(service).toBeTruthy();
	});

	it('should use exist cache$', fakeAsync(() => {
		const stubValue = {
			temperature: 47,
			isSupportSmartBatteryV2: true,
			batteryHealthLevel: BatteryHealthLevel.LEVEL_1,
			batteryHealthTip: BatteryHealthTip.TIPS_1,
			predictedLifeSpan: BatteryLifeSpan.GT_36,
			lifePercent: 16,
			fullChargeCapacity: 16,
			designCapacity: 20,
		};
		shellServiceSpy.getSmartBatteryInfo.and.returnValue({
			getSmartBatteryInfo: () => Promise.resolve(stubValue),
		});
		service = TestBed.inject(BatteryHealthService);

		const subscription1 = service.batteryInfo.subscribe();
		subscription1.unsubscribe();

		const subscription2 = service.batteryInfo.pipe(skip(1)).subscribe((res) => {
			expect(res).toEqual(stubValue);
		});
		subscription2.unsubscribe();

		service.clearMemoryCache();
	}));

	it('should cache new value get from low level', fakeAsync(() => {
		const stubValue = {
			temperature: 47,
			isSupportSmartBatteryV2: true,
			batteryHealthLevel: BatteryHealthLevel.LEVEL_1,
			batteryHealthTip: BatteryHealthTip.TIPS_1,
			predictedLifeSpan: BatteryLifeSpan.GT_36,
			lifePercent: 16,
			fullChargeCapacity: 16,
			designCapacity: 20,
		};
		shellServiceSpy.getSmartBatteryInfo.and.returnValue({
			getSmartBatteryInfo: () => Promise.resolve(stubValue),
		});
		service = TestBed.inject(BatteryHealthService);
		service.batteryInfo.subscribe();

		tick(0);
		expect(localCacheServiceSpy.setLocalCacheValue).toHaveBeenCalledWith(
			LocalStorageKey.BatteryHealth,
			stubValue
		);

		tick(30000);
		expect(localCacheServiceSpy.setLocalCacheValue).toHaveBeenCalledWith(
			LocalStorageKey.BatteryHealth,
			stubValue
		);

		service.clearMemoryCache();
	}));
});
