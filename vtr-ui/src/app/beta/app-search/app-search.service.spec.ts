import { TestBed } from '@angular/core/testing';

import { AppSearchService } from './app-search.service';
import { TranslationModule } from 'src/app/modules/translation.module';
import { TranslateService, TranslateStore } from '@ngx-translate/core';

xdescribe('AppSearchService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			providers: [TranslateStore],
			imports: [TranslationModule.forChild()],
		})
	);

	it('should be created', () => {
		const service: AppSearchService = TestBed.get(AppSearchService);
		expect(service).toBeTruthy();
	});
});
