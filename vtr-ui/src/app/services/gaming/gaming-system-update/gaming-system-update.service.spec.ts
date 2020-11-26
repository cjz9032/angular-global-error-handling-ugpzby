import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { VantageShellService } from '../../vantage-shell/vantage-shell-mock.service';
import { GamingSystemUpdateService } from './gaming-system-update.service';

describe('GamingSystemUpdateService', () => {
	let shellService: VantageShellService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule],
		});
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
			service.isShellAvailable = true;
			service.getCpuOCStatus();
			expect(service.getCpuOCStatus).toHaveBeenCalled();
			service.isShellAvailable = false;
			service.getCpuOCStatus();
			expect(service.getCpuOCStatus).toHaveBeenCalled();
		});

		it('should call getCpuOCStatus return error', async () => {
			const { service } = setup();
			try {
				spyOn(service.gamingOverClock, 'getCpuOCStatus').and.throwError(
					new Error('new getCpuOCStatus error')
				);
				service.getCpuOCStatus();
			} catch (error) {
				expect(service.gamingOverClock.getCpuOCStatus).toThrowError(
					'new getCpuOCStatus error'
				);
			}
		});

		it('should call setCpuOCStatus on false', async () => {
			const { service } = setup();
			spyOn(service, 'setCpuOCStatus').and.callThrough();
			service.isShellAvailable = true;
			service.setCpuOCStatus();
			expect(service.setCpuOCStatus).toHaveBeenCalled();
			service.isShellAvailable = false;
			service.setCpuOCStatus();
			expect(service.setCpuOCStatus).toHaveBeenCalled();
		});

		it('should call setCpuOCStatus return error', async () => {
			const { service } = setup();
			try {
				spyOn(service.gamingOverClock, 'setCpuOCStatus').and.throwError(
					new Error('new setCpuOCStatus error')
				);
				service.setCpuOCStatus();
			} catch (error) {
				expect(service.gamingOverClock.setCpuOCStatus).toThrowError(
					'new setCpuOCStatus error'
				);
			}
		});

		it('should call getRamOCStatus on false', async () => {
			const { service } = setup();
			spyOn(service, 'getRamOCStatus').and.callThrough();
			service.isShellAvailable = true;
			service.getRamOCStatus();
			expect(service.getRamOCStatus).toHaveBeenCalled();
			service.isShellAvailable = false;
			service.getRamOCStatus();
			expect(service.getRamOCStatus).toHaveBeenCalled();
		});

		it('should call getRamOCStatus return error', async () => {
			const { service } = setup();
			try {
				spyOn(service.gamingOverClock, 'getRamOCStatus').and.throwError(
					new Error('new getRamOCStatus error')
				);
				service.getRamOCStatus();
			} catch (error) {
				expect(service.gamingOverClock.getRamOCStatus).toThrowError(
					'new getRamOCStatus error'
				);
			}
		});

		it('should call setRamOCStatus on false', async () => {
			const { service } = setup();
			spyOn(service, 'setRamOCStatus').and.callThrough();
			service.isShellAvailable = true;
			service.setRamOCStatus();
			expect(service.setRamOCStatus).toHaveBeenCalled();
			service.isShellAvailable = false;
			service.setRamOCStatus();
			expect(service.setRamOCStatus).toHaveBeenCalled();
		});

		it('should call setRamOCStatus return error', async () => {
			const { service } = setup();
			try {
				spyOn(service.gamingOverClock, 'setRamOCStatus').and.throwError(
					new Error('new setRamOCStatus error')
				);
				service.setRamOCStatus();
			} catch (error) {
				expect(service.gamingOverClock.setRamOCStatus).toThrowError(
					'new setRamOCStatus error'
				);
			}
		});
	});
});
