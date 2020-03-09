import { TestBed } from '@angular/core/testing';
import { HwInfoService } from './hw-info.service';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';
import { HttpClientModule } from '@angular/common/http';

describe('HwInfoService', () => {
	let shellService: VantageShellService;
	let service: HwInfoService;
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule],
			providers: [VantageShellService, HwInfoService]
		});
		service = TestBed.get(HwInfoService);
		shellService = TestBed.get(VantageShellService);
	});

	describe(':', () => {

		function setup() {
			const service = TestBed.get(HwInfoService);
			return { service };
		}

		it('should call getDynamicInformation', () => {
			const { service } = setup();
			service.isShellAvailable = true;
			spyOn(service.gamingHwInfo, 'getDynamicInformation').and.callThrough();
			service.getDynamicInformation();
			expect(service.gamingHwInfo.getDynamicInformation).toHaveBeenCalled();

			service.isShellAvailable = false;
			service.getDynamicInformation();
			expect(service.gamingHwInfo.getDynamicInformation).toHaveBeenCalled();
		});


		it('should call getMachineInfomation', () => {
			const { service } = setup();
			service.isShellAvailable = true;
			spyOn(service.gamingHwInfo, 'getMachineInfomation').and.callThrough();
			service.getMachineInfomation();
			expect(service.gamingHwInfo.getMachineInfomation).toHaveBeenCalled();
			service.isShellAvailable = false;
			service.getMachineInfomation();
			expect(service.gamingHwInfo.getMachineInfomation).toHaveBeenCalled();
		});


	});
});
