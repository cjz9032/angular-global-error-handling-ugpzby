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

		it('should call getHybridModeStatus return error', async () => {
			const { service } = setup();
			service.isShellAvailable = true;
			spyOn(service, 'getHybridModeStatus').and.callThrough();
			spyOn(service.gamingHybridMode, 'getHybridModeStatus').and.throwError('shellService.gamingHybridMode().getHybridModeStatus error.');
			try {
				service.getHybridModeStatus();
			} catch (err) {
				expect(err.message).toEqual('shellService.gamingHybridMode().getHybridModeStatus error.');
			}
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

		it('should call setHybridModeStatus return error', async () => {
			const { service } = setup();
			service.isShellAvailable = true;
			spyOn(service, 'setHybridModeStatus').and.callThrough();
			spyOn(service.gamingHybridMode, 'setHybridModeStatus').and.throwError('shellService.gamingHybridMode().setHybridModeStatus error.');
			try {
				service.setHybridModeStatus(true);
			} catch (err) {
				expect(err.message).toEqual('shellService.gamingHybridMode().setHybridModeStatus error.');
			}
		});
	});

});
