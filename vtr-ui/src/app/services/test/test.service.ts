import { Injectable } from '@angular/core';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { LocalCacheService } from '../local-cache/local-cache.service';

// this is a test service for PA test, need to remove after test complete
declare let window; 

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(
    private localCacheService: LocalCacheService
  ) {     
		window.newFeatureTips = this;
  }

  enableNewFeatureTips()
	{
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.NewFeatureTipsVersion, 3.006
		);
	}
}
