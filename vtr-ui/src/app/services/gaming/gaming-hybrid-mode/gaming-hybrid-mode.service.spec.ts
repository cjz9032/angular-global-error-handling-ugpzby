import { TestBed } from '@angular/core/testing';
import { GamingHybridModeService } from './gaming-hybrid-mode.service';
import { HttpClientModule } from '@angular/common/http';
import { VantageShellService } from '../../vantage-shell/vantage-shell-mock.service';

describe('GamingHybridModeService', () => {
	let shellService: VantageShellService;
	let service: GamingHybridModeService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule],
		});
		service = TestBed.get(GamingHybridModeService);
		shellService = TestBed.get(VantageShellService);
	});
	describe(':', () => {
		const setup = () => {
			const setUpService = TestBed.get(GamingHybridModeService);
			return { setUpService };
		};

		it('should be created', () => {
			const setUpService: GamingHybridModeService = TestBed.get(GamingHybridModeService);
			expect(setUpService).toBeTruthy();
		});

		it('should call getHybridModeStatus on false', async () => {
			const { setUpService } = setup();
			spyOn(setUpService, 'getHybridModeStatus').and.callThrough();
			setUpService.isShellAvailable = false;
			setUpService.getHybridModeStatus();
			expect(setUpService.getHybridModeStatus).toHaveBeenCalled();
			setUpService.isShellAvailable = true;
			setUpService.getHybridModeStatus();
			expect(setUpService.getHybridModeStatus).toHaveBeenCalled();
		});

		it('should call getHybridModeStatus return error', async () => {
			const { setUpService } = setup();
			setUpService.isShellAvailable = true;
			spyOn(setUpService, 'getHybridModeStatus').and.callThrough();
			spyOn(setUpService.gamingHybridMode, 'getHybridModeStatus').and.throwError(
				'shellsetUpService.gamingHybridMode().getHybridModeStatus error.'
			);
			try {
				setUpService.getHybridModeStatus();
			} catch (err) {
				expect(err.message).toEqual(
					'shellsetUpService.gamingHybridMode().getHybridModeStatus error.'
				);
			}
		});

		it('should call setHybridModeStatus on false', () => {
			const { setUpService } = setup();
			spyOn(setUpService, 'setHybridModeStatus').and.callThrough();
			setUpService.isShellAvailable = false;
			setUpService.setHybridModeStatus();
			expect(setUpService.setHybridModeStatus).toHaveBeenCalled();
			setUpService.isShellAvailable = true;
			setUpService.setHybridModeStatus();
			expect(setUpService.setHybridModeStatus).toHaveBeenCalled();
		});

		it('should call setHybridModeStatus return error', async () => {
			const { setUpService } = setup();
			setUpService.isShellAvailable = true;
			spyOn(setUpService, 'setHybridModeStatus').and.callThrough();
			spyOn(setUpService.gamingHybridMode, 'setHybridModeStatus').and.throwError(
				'shellsetUpService.gamingHybridMode().setHybridModeStatus error.'
			);
			try {
				setUpService.setHybridModeStatus(true);
			} catch (err) {
				expect(err.message).toEqual(
					'shellsetUpService.gamingHybridMode().setHybridModeStatus error.'
				);
			}
		});
	});
});
