import { TestBed } from '@angular/core/testing';

import { SelfSelectService } from './self-select.service';

xdescribe('SelfSelectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SelfSelectService = TestBed.get(SelfSelectService);
    expect(service).toBeTruthy();
  });

  it('IsMatch case insensitive, source: Lenovo V330-14ARR, pattern: /^lenovo V/i', () => {
	const service: SelfSelectService = TestBed.get(SelfSelectService);
	const source = 'Lenovo V330-14ARR';
	const sourceUpper = source.toLocaleLowerCase();
	const sourceLower = source.toLocaleLowerCase();
	const pattern = /^lenovo V/i;

	expect(service).toBeTruthy();
	expect(service.IsMatch(pattern, source)).toBe(true);
	expect(service.IsMatch(pattern, sourceUpper)).toBe(true);
	expect(service.IsMatch(pattern, sourceLower)).toBe(true);
  });
});
