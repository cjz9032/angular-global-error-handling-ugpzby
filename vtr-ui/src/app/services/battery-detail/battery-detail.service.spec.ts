import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { LocalCacheService } from '../local-cache/local-cache.service';
import { PowerService } from '../power/power.service';
import { BatteryDetailService } from './battery-detail.service';

describe('Battery Detail Service', () => {
	let service: BatteryDetailService;
	let localCacheServiceSpy: jasmine.SpyObj<LocalCacheService>;
	const batteryThresholdFixture = { battery: 'battery' };
	const powerServiceFixture = { 
		isShellAvailable: true,
		getChargeThresholdInfo() {
			return new Promise((resolve) => { resolve(batteryThresholdFixture) });
		}
	};

	beforeEach(() => {
		const spy = jasmine.createSpyObj('LocalCacheService', ['setLocalCacheValue']);
		TestBed.configureTestingModule({
			imports: [HttpClientModule],
			providers: [
				BatteryDetailService,
				{ provide: LocalCacheService, useValue: spy },
				{ provide: PowerService, 
					useValue:  powerServiceFixture
				},
			]
		});
		service = TestBed.inject(BatteryDetailService);
		localCacheServiceSpy = TestBed.inject(LocalCacheService) as jasmine.SpyObj<LocalCacheService>;
	});

	describe('#getBatteryThresholdInformation', () => {
		it('should set local cache value for BatteryChargeThresholdCapability', () => {
			service.getBatteryThresholdInformation().then(() => {
				expect(localCacheServiceSpy.setLocalCacheValue)
					.toHaveBeenCalledWith(
						LocalStorageKey.BatteryChargeThresholdCapability, 
						batteryThresholdFixture
					);
			});
		});
	});
});
