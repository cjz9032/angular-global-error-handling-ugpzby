import { TestBed } from '@angular/core/testing';
import { GamingHybridModeService } from './gaming-hybrid-mode.service';
import { HttpClientModule } from '@angular/common/http';
import { VantageShellService } from '../../vantage-shell/vantage-shell-mock.service';

describe('GamingHybridModeService', () => {
	let shellService: VantageShellService;
	let service: GamingHybridModeService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule],
		});
		service = TestBed.get(GamingHybridModeService);
		shellService = TestBed.get(VantageShellService);
	});
	describe(':', () => {

		function setup() {
			const service = TestBed.get(GamingHybridModeService);
			return { service };
		}

		it('should be created', () => {
			const service: GamingHybridModeService = TestBed.get(GamingHybridModeService);
			expect(service).toBeTruthy();
		});

		it('should call getHybridModeStatus on false', async () => {
			const { service } = setup();
			spyOn(service, 'getHybridModeStatus').and.callThrough();
			service.isShellAvailable = false;
			service.getHybridModeStatus();
			expect(service.getHybridModeStatus).toHaveBeenCalled();
			service.isShellAvailable = true;
			service.getHybridModeStatus();
			expect(service.getHybridModeStatus).toHaveBeenCalled();
		});

		it('should call setHybridModeStatus on false', () => {
			const { service } = setup();
			spyOn(service, 'setHybridModeStatus').and.callThrough();
			service.isShellAvailable = false;
			service.setHybridModeStatus();
			expect(service.setHybridModeStatus).toHaveBeenCalled();
			service.isShellAvailable = true;
			service.setHybridModeStatus();
			expect(service.setHybridModeStatus).toHaveBeenCalled();
		});

	});

});
