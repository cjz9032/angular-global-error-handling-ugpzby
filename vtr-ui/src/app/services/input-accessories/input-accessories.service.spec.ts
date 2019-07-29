import { TestBed } from '@angular/core/testing';

import { InputAccessoriesService } from './input-accessories.service';

xdescribe('InputAccessoriesService', () => {
 beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InputAccessoriesService = TestBed.get(InputAccessoriesService);
    expect(service).toBeTruthy();
  });
});
