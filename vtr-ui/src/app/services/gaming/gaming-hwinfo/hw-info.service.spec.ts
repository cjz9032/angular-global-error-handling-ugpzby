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
			providers: [VantageShellService, HwInfoService],
		});
		service = TestBed.get(HwInfoService);
		shellService = TestBed.get(VantageShellService);
	});

	describe(':', () => {
		const setup = () => {
			const setUpService = TestBed.get(HwInfoService);
			return { setUpService };
		};

		it('should call getDynamicInformation', () => {
			const { setUpService } = setup();
			service.isShellAvailable = true;
			spyOn(setUpService.gamingHwInfo, 'getDynamicInformation').and.callThrough();
			service.getDynamicInformation();
			expect(setUpService.gamingHwInfo.getDynamicInformation).toHaveBeenCalled();

			service.isShellAvailable = false;
			service.getDynamicInformation();
			expect(setUpService.gamingHwInfo.getDynamicInformation).toHaveBeenCalled();
		});

		it('should call getDynamicInformation return error', () => {
			const { setUpService } = setup();
			service.isShellAvailable = true;
			spyOn(setUpService.gamingHwInfo, 'getDynamicInformation').and.throwError(
				'shellService.getGamingHwInfo().getDynamicInformation error.'
			);
			try {
				service.getDynamicInformation();
			} catch (err) {
				expect(err.message).toEqual(
					'shellService.getGamingHwInfo().getDynamicInformation error.'
				);
			}
		});

		it('should call getMachineInfomation', () => {
			const { setUpService } = setup();
			setUpService.isShellAvailable = true;
			spyOn(setUpService.gamingHwInfo, 'getMachineInfomation').and.callThrough();
			setUpService.getMachineInfomation();
			expect(setUpService.gamingHwInfo.getMachineInfomation).toHaveBeenCalled();
			setUpService.isShellAvailable = false;
			setUpService.getMachineInfomation();
			expect(setUpService.gamingHwInfo.getMachineInfomation).toHaveBeenCalled();
		});

		it('should call getMachineInfomation return error', () => {
			const { setUpService } = setup();
			setUpService.isShellAvailable = true;
			spyOn(setUpService.gamingHwInfo, 'getMachineInfomation').and.throwError(
				'shellService.getGamingHwInfo().getMachineInfomation error.'
			);
			try {
				setUpService.getMachineInfomation();
			} catch (err) {
				expect(err.message).toEqual(
					'shellService.getGamingHwInfo().getMachineInfomation error.'
				);
			}
		});
	});
});
