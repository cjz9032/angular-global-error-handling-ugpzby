import { TestBed } from '@angular/core/testing';
import { GamingThermalModeService } from './gaming-thermal-mode.service';
import { HttpClientModule } from '@angular/common/http';
import { VantageShellService } from '../../vantage-shell/vantage-shell-mock.service';

describe('GamingThermalModeService', () => {
	let shellService: VantageShellService;
	let service: GamingThermalModeService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule],
			providers: [GamingThermalModeService, VantageShellService],
		});
		service = TestBed.get(GamingThermalModeService);
		shellService = TestBed.get(VantageShellService);
	});
	describe(':', () => {

		function setup() {
			const service = TestBed.get(GamingThermalModeService);
			return { service };
		}

		it('should be created', () => {
			const service: GamingThermalModeService = TestBed.get(GamingThermalModeService);
			expect(service).toBeTruthy();
		});


		it('should call getThermalModeStatus on false', async () => {
			const { service } = setup();
			service.gam
			spyOn(service, 'getThermalModeStatus').and.callThrough();
			service.isShellAvailable = false;
			service.getThermalModeStatus();
			expect(service.getThermalModeStatus).toHaveBeenCalled();
			service.isShellAvailable = true;
			service.getThermalModeStatus();
			expect(service.getThermalModeStatus).toHaveBeenCalled();
		});


		it('should call setThermalModeStatus on false', async () => {
			const { service } = setup();
			spyOn(service, 'setThermalModeStatus').and.callThrough();
			service.isShellAvailable = false;
			service.setThermalModeStatus(1);
			expect(service.setThermalModeStatus).toHaveBeenCalled();
			service.isShellAvailable = true;
			service.setThermalModeStatus(1);
			expect(service.setThermalModeStatus).toHaveBeenCalled();
		});


		it('should call regThermalModeEvent on false', async () => {
			const { service } = setup();
			spyOn(service, 'regThermalModeEvent').and.callThrough();
			service.isShellAvailable = false;
			service.regThermalModeEvent();
			expect(service.regThermalModeEvent).toHaveBeenCalled();
			service.isShellAvailable = true;
			service.regThermalModeEvent();
			expect(service.regThermalModeEvent).toHaveBeenCalled();
		});


	});

});

