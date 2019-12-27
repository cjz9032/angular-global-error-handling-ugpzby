
import { TestBed } from '@angular/core/testing';
import { GamingLightingService } from './gaming-lighting.service';
import { HttpClientModule } from '@angular/common/http';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';

describe('Shared service:', () => {
	let shellService: VantageShellService;
	let service: GamingLightingService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule],
			//providers: [VantageShellService,BatteryDetailComponent]
		});
		service = TestBed.get(GamingLightingService);
		shellService = TestBed.get(VantageShellService);
	});
	describe(':', () => {

		function setup() {
			// tslint:disable-next-line: no-shadowed-variable
			const service = TestBed.get(GamingLightingService);
			// const batteryDetailComponent = TestBed.get(BatteryDetailComponent);
			return { service };
		}


		it('should call getLightingProfileById', () => {
			// tslint:disable-next-line: no-shadowed-variable
			const { service } = setup();
			const mockGamingLightingData = {
				didSuccess: 1,
				profileId: 1,
				brightness: 3,
				lightInfo: [
					{
						lightPanelType: 32,
						lightEffectType: 4,
						lightColor: 'FFFFFF',
					},
					{
						lightPanelType: 64,
						lightEffectType: 2,
						lightColor: 'FF0000',
					}
				]
			}

			spyOn(service.getGamingLighting, 'getLightingProfileById').and.callThrough();
			service.getLightingProfileById();
			expect(service.getGamingLighting.getLightingProfileById).toHaveBeenCalled();

			service.isShellAvailable = false;
			service.getLightingProfileById();
			expect(service.getGamingLighting.getLightingProfileById).toHaveBeenCalled();

		});


	});

});



