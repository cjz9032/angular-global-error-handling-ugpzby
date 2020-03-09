import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { VantageShellService } from '../../vantage-shell/vantage-shell-mock.service';
import { GamingSystemUpdateService } from './gaming-system-update.service';

describe('GamingSystemUpdateService', () => {
	let shellService: VantageShellService;
	let service: GamingSystemUpdateService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule],
		});
		service = TestBed.get(GamingSystemUpdateService);
		shellService = TestBed.get(VantageShellService);
	});
	describe(':', () => {

		function setup() {
			const service = TestBed.get(GamingSystemUpdateService);
			return { service };
		}

		it('should be created', () => {
			const service: GamingSystemUpdateService = TestBed.get(GamingSystemUpdateService);
			expect(service).toBeTruthy();
		});

		it('should call getCpuOCStatus on false', async () => {
			const { service } = setup();
			spyOn(service, 'getCpuOCStatus').and.callThrough();
			service.isShellAvailable = false;
			service.getCpuOCStatus();
			expect(service.getCpuOCStatus).toHaveBeenCalled();
			service.isShellAvailable = true;
			service.getCpuOCStatus();
			expect(service.getCpuOCStatus).toHaveBeenCalled();
		});

		it('should call setCpuOCStatus on false', async () => {
			const { service } = setup();
			spyOn(service, 'setCpuOCStatus').and.callThrough();
			service.isShellAvailable = false;
			service.setCpuOCStatus();
			expect(service.setCpuOCStatus).toHaveBeenCalled();
			service.isShellAvailable = true;
			service.setCpuOCStatus();
			expect(service.setCpuOCStatus).toHaveBeenCalled();
		});

		it('should call getRamOCStatus on false', async () => {
			const { service } = setup();
			spyOn(service, 'getRamOCStatus').and.callThrough();
			service.isShellAvailable = false;
			service.getRamOCStatus();
			expect(service.getRamOCStatus).toHaveBeenCalled();
			service.isShellAvailable = true;
			service.getRamOCStatus();
			expect(service.getRamOCStatus).toHaveBeenCalled();
		});

		it('should call setRamOCStatus on false', async () => {
			const { service } = setup();
			spyOn(service, 'setRamOCStatus').and.callThrough();
			service.isShellAvailable = false;
			service.setRamOCStatus();
			expect(service.setRamOCStatus).toHaveBeenCalled();
			service.isShellAvailable = true;
			service.setRamOCStatus();
			expect(service.setRamOCStatus).toHaveBeenCalled();
		});

	});

});
