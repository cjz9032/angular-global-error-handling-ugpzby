import { TestBed } from '@angular/core/testing';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

import { LocalCacheService } from './local-cache.service';

describe('LocalCacheService', () => {
	let service: LocalCacheService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(LocalCacheService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should resolve correct when call loadCacheValues()', () => {
		expect(service.loadCacheValues()).not.toThrowError();
	});

	it('should resolve correct when call getLocalCacheValue()', () => {
		expect(service.getLocalCacheValue(LocalStorageKey.MachineType)).toBe(undefined);
	});

	it('should resolve correct when call setLocalCacheValue()', () => {
		expect(service.setLocalCacheValue(LocalStorageKey.MachineType, '1')).not.toThrowError();
		expect(service.getLocalCacheValue(LocalStorageKey.MachineType)).toBe('1');
	});
});
