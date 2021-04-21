import { TestBed } from '@angular/core/testing';
import { GamingAllCapabilitiesService } from './gaming-all-capabilities.service';
import { HttpClientModule } from '@angular/common/http';
import { VantageShellService } from '../../vantage-shell/vantage-shell-mock.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

describe('Shared service:', () => {
	let shellService: VantageShellService;
	let service: GamingAllCapabilitiesService;
	const capabilities: any = {
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
		});
		service = TestBed.get(GamingAllCapabilitiesService);
		shellService = TestBed.get(VantageShellService);
	});

	describe('GamingAllCapabilitiesService', () => {
		const setup = () => {
			const getService = TestBed.get(GamingAllCapabilitiesService);
			return { service: getService };
		};
		it('should be created', () => {
			const getService: GamingAllCapabilitiesService = TestBed.get(GamingAllCapabilitiesService);
			expect(getService).toBeTruthy();
		});

		it('should call getCapabilities', () => {
			const { service: setUpService } = setup();
			spyOn(setUpService.gamingAllCapabilities, 'getCapabilities').and.callThrough();
			setUpService.getCapabilities();
			expect(setUpService.gamingAllCapabilities.getCapabilities).toHaveBeenCalled();

			setUpService.isShellAvailable = false;
			setUpService.getCapabilities();
			expect(setUpService.gamingAllCapabilities.getCapabilities).toHaveBeenCalled();
		});

		it('should call getCapabilities return err', () => {
			const { service: setUpService } = setup();
			spyOn(setUpService.gamingAllCapabilities, 'getCapabilities').and.throwError(
				'GamingAllCapabilitiesService .getCapabilities error'
			);
			expect(() => {
				setUpService.getCapabilities();
			}).toThrow(new Error('GamingAllCapabilitiesService .getCapabilities error'));
		});

		it('should call setCapabilityValuesGlobally', () => {
			const { service: setUpService } = setup();
			spyOn(setUpService, 'setCapabilityValuesGlobally').and.callThrough();
			setUpService.setCapabilityValuesGlobally(capabilities);
			expect(setUpService.setCapabilityValuesGlobally).toHaveBeenCalled();

			setUpService.isShellAvailable = false;
			setUpService.setCapabilityValuesGlobally(capabilities);
			expect(setUpService.setCapabilityValuesGlobally).toHaveBeenCalled();
		});

		it('should call getCapabilityFromCache', () => {
			const { service: setUpService } = setup();
			spyOn(setUpService, 'getCapabilityFromCache').and.callThrough();
			setUpService.getCapabilityFromCache();
			expect(setUpService.getCapabilityFromCache).toHaveBeenCalled();

			setUpService.isShellAvailable = false;
			setUpService.getCapabilityFromCache();
			expect(setUpService.getCapabilityFromCache).toHaveBeenCalled();
		});
	});
});
