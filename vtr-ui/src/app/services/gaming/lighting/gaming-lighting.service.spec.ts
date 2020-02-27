
import { TestBed, tick } from '@angular/core/testing';
import { GamingLightingService } from './gaming-lighting.service';
import { HttpClientModule } from '@angular/common/http';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';

describe('Shared service:', () => {
	let shellService: VantageShellService;
	let service: GamingLightingService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule],
			providers: []
		});
		shellService = TestBed.get(VantageShellService);
		service = new GamingLightingService(shellService);
	});
	describe(':', () => {

		function setup() {
			// tslint:disable-next-line: no-shadowed-variable
			const service = new GamingLightingService(shellService);
			// const batteryDetailComponent = TestBed.get(BatteryDetailComponent);
			return { service };
		}




		// it('should call capabilities', () => {
		// 	spyOn(service.getGamingLighting, 'getLightingCapabilities').and.callThrough();
		// 	service.getLightingCapabilities();
		// 	expect(service.getGamingLighting.getLightingCapabilities).toHaveBeenCalled();
		// 	service.isShellAvailable = false;
		// 	service.getLightingCapabilities();
		// 	expect(service.getGamingLighting.getLightingCapabilities).toHaveBeenCalled();
		// });

		it('should call getLightingProfileId', () => {
			service.isShellAvailable = false;
			const res = service.getLightingProfileId();
			expect(res).toBe(undefined);
			service.isShellAvailable = true;
			try {
				service.getLightingProfileId();
			} catch (e) {
				expect(e).not.toBeNull();
			}
		});
		// it('should call getLightingProfileById', () => {
		// 	spyOn(service.getGamingLighting, 'getLightingProfileById').and.callThrough();
		// 	service.getLightingProfileById(1);
		// 	expect(service.getGamingLighting.getLightingProfileById).toHaveBeenCalled();
		// 	service.isShellAvailable = false;
		// 	service.getLightingProfileById(1);
		// 	expect(service.getGamingLighting.getLightingProfileById).toHaveBeenCalled();
		// });

		it('should call setLightingProfileId', () => {
			service.isShellAvailable = false;
			const res = service.setLightingProfileId(1, 1);
			expect(res).toBe(undefined);
			service.isShellAvailable = true;
			try {
				service.setLightingProfileId(1, 1);
			} catch (e) {
				expect(e).not.toBeNull();
			}
		});

		it('should call setLightingProfileEffectColor', () => {
			service.isShellAvailable = false;
			const res = service.setLightingProfileEffectColor({});
			expect(res).toBe(undefined);
			service.isShellAvailable = true;
			try {
				service.setLightingProfileEffectColor({});
			} catch (e) {
				expect(e).not.toBeNull();
			}
		});

		it('should call setLightingDefaultProfileById', () => {
			service.isShellAvailable = false;
			const res = service.setLightingDefaultProfileById(1);
			expect(res).toBe(undefined);
			service.isShellAvailable = true;
			try {
				service.setLightingDefaultProfileById(1);
			} catch (e) {
				expect(e).not.toBeNull();
			}
		});

		it('should call setLightingProfileBrightness', () => {
			service.isShellAvailable = false;
			const res = service.setLightingProfileBrightness(1);
			expect(res).toBe(undefined);
			service.isShellAvailable = true;
			try {
				service.setLightingProfileBrightness(1);
			} catch (e) {
				expect(e).not.toBeNull();
			}
		});
	});

});



