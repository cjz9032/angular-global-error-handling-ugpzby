import { TestBed } from '@angular/core/testing';
import { GamingAllCapabilitiesService } from './gaming-all-capabilities.service';
import { HttpClientModule } from '@angular/common/http';
import { VantageShellService } from '../../vantage-shell/vantage-shell-mock.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

describe('Shared service:', () => {
	let shellService: VantageShellService;
	let service: GamingAllCapabilitiesService;
	let capabilities: any = {
		macroKeyFeature: true,
		cpuOCFeature: true,
		memOCFeature: true,
		optimizationFeature: true,
		networkBoostFeature: true,
		hybridModeFeature: true,
		touchpadLockFeature: true,
		xtuService: true,
		smartFanFeature: true,
		ledSetFeature: true,
		ledDriver: true,
		fbnetFilter: true,
		winKeyLockFeature: true,
		supporttedThermalMode: {
			length: 2,
		},
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule],
			//providers: [VantageShellService,BatteryDetailComponent]
		});
		service = TestBed.get(GamingAllCapabilitiesService);
		shellService = TestBed.get(VantageShellService);
	});

	describe('GamingAllCapabilitiesService', () => {
		function setup() {
			// eslint-disable-next-line no-shadow
			const service = TestBed.get(GamingAllCapabilitiesService);
			// const batteryDetailComponent = TestBed.get(BatteryDetailComponent);
			return { service };
		}
		it('should be created', () => {
			const service: GamingAllCapabilitiesService = TestBed.get(GamingAllCapabilitiesService);
			expect(service).toBeTruthy();
		});

		it('should call getCapabilities', () => {
			// eslint-disable-next-line no-shadow
			const { service } = setup();
			spyOn(service.gamingAllCapabilities, 'getCapabilities').and.callThrough();
			service.getCapabilities();
			expect(service.gamingAllCapabilities.getCapabilities).toHaveBeenCalled();

			service.isShellAvailable = false;
			service.getCapabilities();
			expect(service.gamingAllCapabilities.getCapabilities).toHaveBeenCalled();
		});

		it('should call getCapabilities return err', () => {
			const { service } = setup();
			spyOn(service.gamingAllCapabilities, 'getCapabilities').and.throwError(
				'GamingAllCapabilitiesService .getCapabilities error'
			);
			expect(function () {
				service.getCapabilities();
			}).toThrow(new Error('GamingAllCapabilitiesService .getCapabilities error'));
		});

		it('should call setCapabilityValuesGlobally', () => {
			// eslint-disable-next-line no-shadow
			const { service } = setup();
			spyOn(service, 'setCapabilityValuesGlobally').and.callThrough();
			service.setCapabilityValuesGlobally(capabilities);
			expect(service.setCapabilityValuesGlobally).toHaveBeenCalled();

			service.isShellAvailable = false;
			service.setCapabilityValuesGlobally(capabilities);
			expect(service.setCapabilityValuesGlobally).toHaveBeenCalled();
		});

		it('should call getCapabilityFromCache', () => {
			// eslint-disable-next-line no-shadow
			const { service } = setup();
			spyOn(service, 'getCapabilityFromCache').and.callThrough();
			service.getCapabilityFromCache();
			expect(service.getCapabilityFromCache).toHaveBeenCalled();

			service.isShellAvailable = false;
			service.getCapabilityFromCache();
			expect(service.getCapabilityFromCache).toHaveBeenCalled();
		});
	});
});
