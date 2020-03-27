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



		it('should call setAutoSwitchStatus on true', () => {
			// tslint:disable-next-line: no-shadowed-variable
			const { service } = setup();
			service.isShellAvailable = true;
			spyOn(service.gamingThermalMode, 'setAutoSwitchStatus').and.callThrough();
			service.setAutoSwitchStatus();
			expect(service.gamingThermalMode.setAutoSwitchStatus).toHaveBeenCalled();
		});

		it('should call setAutoSwitchStatus on false', () => {
			// tslint:disable-next-line: no-shadowed-variable
			const { service } = setup();
			service.isShellAvailable = false;
			spyOn(service.gamingThermalMode, 'setAutoSwitchStatus').and.callThrough();
			try { service.setAutoSwitchStatus();
			expect(service.gamingThermalMode.setAutoSwitchStatus).not.toBeNull();
		   } catch (e) {
			expect(e).not.toBeNull();
		  }
		});


		it('should call getThermalModeSettingStatus on true', () => {
			// tslint:disable-next-line: no-shadowed-variable
			const { service } = setup();
			service.isShellAvailable = true;
			spyOn(service.gamingThermalMode, 'getThermalModeStatus').and.callThrough();
			service.getThermalModeSettingStatus();
			expect(service.gamingThermalMode.getThermalModeStatus).toHaveBeenCalled();
		});



		it('should call getThermalModeSettingStatus on false', () => {
			// tslint:disable-next-line: no-shadowed-variable
			const { service } = setup();
			service.isShellAvailable = false;
			spyOn(service.gamingThermalMode, 'getThermalModeStatus').and.callThrough();
			service.getThermalModeSettingStatus();
			expect(service.gamingThermalMode.getThermalModeStatus).not.toBeNull();
		});




		it('should call setThermalModeSettingStatus on true', () => {
			// tslint:disable-next-line: no-shadowed-variable
			const { service } = setup();
			service.isShellAvailable = true;
			spyOn(service.gamingThermalMode, 'setThermalModeStatus').and.callThrough();
			service.setThermalModeSettingStatus(1);
			expect(service.gamingThermalMode.setThermalModeStatus).toHaveBeenCalled();
		});



		it('should call setThermalModeSettingStatus on false', () => {
			// tslint:disable-next-line: no-shadowed-variable
			const { service } = setup();
			service.isShellAvailable = false;
			spyOn(service.gamingThermalMode, 'setThermalModeStatus').and.callThrough();
			service.setThermalModeSettingStatus(1);
			expect(service.gamingThermalMode.setThermalModeStatus).not.toBeNull();
		});


		it('should call getAutoSwitchStatus on true', () => {
			// tslint:disable-next-line: no-shadowed-variable
			const { service } = setup();
			service.isShellAvailable = true;
			spyOn(service.gamingThermalMode, 'getAutoSwitchStatus').and.callThrough();
			service.getAutoSwitchStatus();
			expect(service.gamingThermalMode.getAutoSwitchStatus).toHaveBeenCalled();
		});



		it('should call getAutoSwitchStatus on false', () => {
			// tslint:disable-next-line: no-shadowed-variable
			const { service } = setup();
			service.isShellAvailable = false;
			spyOn(service.gamingThermalMode, 'getAutoSwitchStatus').and.callThrough();
			service.getAutoSwitchStatus();
			expect(service.gamingThermalMode.getAutoSwitchStatus).not.toBeNull();
		});


		it('should call setAutoSwitchStatus on true', () => {
			// tslint:disable-next-line: no-shadowed-variable
			const { service } = setup();
			service.isShellAvailable = true;
			spyOn(service.gamingThermalMode, 'setAutoSwitchStatus').and.callThrough();
			service.setAutoSwitchStatus(1);
			expect(service.gamingThermalMode.setAutoSwitchStatus).toHaveBeenCalled();
		});



		it('should call setAutoSwitchStatus on false', () => {
			// tslint:disable-next-line: no-shadowed-variable
			const { service } = setup();
			service.isShellAvailable = false;
			spyOn(service.gamingThermalMode, 'setAutoSwitchStatus').and.callThrough();
			service.setAutoSwitchStatus(1);
			expect(service.gamingThermalMode.setAutoSwitchStatus).not.toBeNull();
		});


		it('should call regThermalModeChangeEvent on true', () => {
			// tslint:disable-next-line: no-shadowed-variable
			const { service } = setup();
			service.isShellAvailable = true;
			spyOn(service.gamingThermalMode, 'regThermalModeEvent').and.callThrough();
			service.regThermalModeChangeEvent();
			expect(service.gamingThermalMode.regThermalModeEvent).toHaveBeenCalled();
		});



		it('should call regThermalModeChangeEvent on false', () => {
			// tslint:disable-next-line: no-shadowed-variable
			const { service } = setup();
			service.isShellAvailable = false;
			spyOn(service.gamingThermalMode, 'regThermalModeEvent').and.callThrough();
			service.regThermalModeChangeEvent();
			expect(service.gamingThermalMode.regThermalModeEvent).not.toBeNull();
		});



		it('should call getThermalModeRealStatus on true', () => {
			// tslint:disable-next-line: no-shadowed-variable
			const { service } = setup();
			service.isShellAvailable = true;
			spyOn(service.gamingThermalMode, 'getThermalModeRealStatus').and.callThrough();
			service.getThermalModeRealStatus();
			expect(service.gamingThermalMode.getThermalModeRealStatus).toHaveBeenCalled();
		});


		it('should call getThermalModeRealStatus on false', () => {
			// tslint:disable-next-line: no-shadowed-variable
			const { service } = setup();
			service.isShellAvailable = false;
			spyOn(service.gamingThermalMode, 'getThermalModeRealStatus').and.callThrough();
			service.getThermalModeRealStatus();
			expect(service.gamingThermalMode.getThermalModeRealStatus).not.toBeNull();
		});


		it('should call regThermalModeRealStatusEvent on true', () => {
			// tslint:disable-next-line: no-shadowed-variable
			const { service } = setup();
			service.isShellAvailable = true;
			spyOn(service.gamingThermalMode, 'regThermalModeRealStatusEvent').and.callThrough();
			service.regThermalModeRealStatusChangeEvent();
			expect(service.gamingThermalMode.regThermalModeRealStatusEvent).toHaveBeenCalled();
		});





		it('should call regThermalModeRealStatusEvent on false', () => {
			// tslint:disable-next-line: no-shadowed-variable
			const { service } = setup();
			service.isShellAvailable = false;
			spyOn(service.gamingThermalMode, 'regThermalModeRealStatusEvent').and.callThrough();
			service.regThermalModeRealStatusChangeEvent();
			expect(service.gamingThermalMode.regThermalModeRealStatusEvent).not.toBeNull();
		});


	});

});

