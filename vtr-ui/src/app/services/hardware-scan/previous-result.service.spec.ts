import { TestBed } from '@angular/core/testing';
import { VantageShellService } from '../vantage-shell/vantage-shell-mock.service';
import { HttpClientModule } from '@angular/common/http';

import { PreviousResultService } from './previous-result.service';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('PreviousResultService', () => {
	let service: PreviousResultService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule, TranslateModule.forRoot(), RouterTestingModule],
			providers: [VantageShellService]
		});
		service = TestBed.inject(PreviousResultService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
