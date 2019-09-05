import { TestBed } from '@angular/core/testing';

import { BatteryDetailService } from './battery-detail.service';
import { HttpClientModule } from '@angular/common/http';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';

describe('BatteryDetailService', () => {
	let shellService: VantageShellService;
	let service: BatteryDetailService;
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule],
			providers: [VantageShellService]
		});
		service = TestBed.get(BatteryDetailService);
		shellService = TestBed.get(VantageShellService);
	});

	it('should be created', () => {
		// spyOn(shellService, 'getBatteryInfo').and.returnValue()
		expect(service).toBeTruthy();
	});
});
