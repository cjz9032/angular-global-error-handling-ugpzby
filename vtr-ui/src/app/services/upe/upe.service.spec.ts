import { TestBed } from '@angular/core/testing';
import { UPEService } from './upe.service';

describe('UpeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
	const service: UPEService = TestBed.get(UPEService);
	expect(service).toBeTruthy();
  });
});
