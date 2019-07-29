import { TestBed } from '@angular/core/testing';

import { GamingAllCapabilitiesService } from './gaming-all-capabilities.service';

xdescribe('GamingAllCapabilitiesService', () => {
 beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GamingAllCapabilitiesService = TestBed.get(GamingAllCapabilitiesService);
    expect(service).toBeTruthy();
  });
});
