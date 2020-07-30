import { TestBed } from '@angular/core/testing';

import { GamingQuickSettingToolbarService } from './gaming-quick-setting-toolbar.service';

describe('GamingQuickSettingToolbarService', () => {
  let service: GamingQuickSettingToolbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GamingQuickSettingToolbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
