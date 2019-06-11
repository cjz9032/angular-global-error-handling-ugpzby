import { TestBed } from '@angular/core/testing';

import { GamingQuickSettingsService } from './gaming-quick-settings.service';

describe('GamingQuickSettingsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GamingQuickSettingsService = TestBed.get(GamingQuickSettingsService);
    expect(service).toBeTruthy();
  });
});
