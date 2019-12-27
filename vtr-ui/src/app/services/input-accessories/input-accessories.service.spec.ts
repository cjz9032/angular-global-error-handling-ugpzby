import { TestBed } from '@angular/core/testing';

import { InputAccessoriesService } from './input-accessories.service';
import { HttpClient } from '@angular/common/http';

describe('InputAccessoriesService', () => {
 beforeEach(() => TestBed.configureTestingModule({
  providers: [
    { provide: HttpClient }
  
  ]
 }));

  it('should be created', () => {
    const service: InputAccessoriesService = TestBed.get(InputAccessoriesService);
    expect(service).toBeTruthy();
  });
});
