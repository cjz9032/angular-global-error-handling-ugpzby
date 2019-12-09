import { TestBed } from '@angular/core/testing';

import { RouteHandlerService } from './route-handler.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { TranslationModule } from 'src/app/modules/translation.module';
import { TranslateStore } from '@ngx-translate/core';

describe('RouteHandlerService', () => {
	beforeEach(() => TestBed.configureTestingModule({
		imports: [RouterTestingModule, TranslationModule, HttpClientModule],
		providers: [TranslateStore]
	}));

	it('should be created', () => {
		const service: RouteHandlerService = TestBed.get(RouteHandlerService);
		expect(service).toBeTruthy();
	});
});
