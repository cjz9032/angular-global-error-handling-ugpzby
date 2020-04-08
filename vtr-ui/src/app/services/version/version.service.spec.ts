import { TestBed } from '@angular/core/testing';

import { VersionService, VersionCodeName } from './version.service';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

describe('VersionService', () => {
  let service: VersionService;

  beforeEach(() => {
	TestBed.resetTestEnvironment();
	TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
    TestBed.configureTestingModule({});
    service = TestBed.inject(VersionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Version should be Anemone', () => {
    expect(service.currentVersion).toEqual(VersionCodeName.Anemone);
  });

  it('Version should lower than Blue', () => {
    expect(service.currentVersion < VersionCodeName.Blue).toEqual(true);
  });
});
