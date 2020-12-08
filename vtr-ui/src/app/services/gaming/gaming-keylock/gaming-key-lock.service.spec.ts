import { TestBed } from '@angular/core/testing';
import { GamingKeyLockService } from './gaming-key-lock.service';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';
import { HttpClientModule } from '@angular/common/http';

describe('GamingKeyLockService', () => {
	let shellService: VantageShellService;
	let service: GamingKeyLockService;
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule],
			providers: [VantageShellService, GamingKeyLockService],
		});
		service = TestBed.get(GamingKeyLockService);
		shellService = TestBed.get(VantageShellService);
	});

	describe(':', () => {
		const setup = () => {
			const setUpService = TestBed.get(GamingKeyLockService);
			return { setUpService };
		};

		it('should call getKeyLockStatus', () => {
			const { setUpService } = setup();
			setUpService.isShellAvailable = true;
			spyOn(setUpService.gamingKeyLock, 'getKeyLockStatus').and.callThrough();
			setUpService.getKeyLockStatus();
			expect(setUpService.gamingKeyLock.getKeyLockStatus).toHaveBeenCalled();

			setUpService.isShellAvailable = false;
			setUpService.getKeyLockStatus();
			expect(setUpService.gamingKeyLock.getKeyLockStatus).toHaveBeenCalled();
		});

		it('should call getKeyLockStatus return error', async () => {
			const { setUpService } = setup();
			setUpService.isShellAvailable = true;
			spyOn(setUpService.gamingKeyLock, 'getKeyLockStatus').and.throwError(
				'shellsetUpService.gamingKeyLock().getKeyLockStatus error.'
			);
			try {
				setUpService.getKeyLockStatus();
			} catch (err) {
				expect(err.message).toEqual('shellsetUpService.gamingKeyLock().getKeyLockStatus error.');
			}
		});

		it('should call setKeyLockStatus', () => {
			const { setUpService } = setup();
			setUpService.isShellAvailable = true;
			spyOn(setUpService.gamingKeyLock, 'setKeyLockStatus').and.callThrough();
			setUpService.setKeyLockStatus();
			expect(setUpService.gamingKeyLock.setKeyLockStatus).toHaveBeenCalled();

			setUpService.isShellAvailable = false;
			setUpService.setKeyLockStatus();
			expect(setUpService.gamingKeyLock.setKeyLockStatus).toHaveBeenCalled();
		});

		it('should call setKeyLockStatus return error', async () => {
			const { setUpService } = setup();
			setUpService.isShellAvailable = true;
			spyOn(setUpService.gamingKeyLock, 'setKeyLockStatus').and.throwError(
				'shellsetUpService.gamingKeyLock().setKeyLockStatus error.'
			);
			try {
				setUpService.setKeyLockStatus(true);
			} catch (err) {
				expect(err.message).toEqual('shellsetUpService.gamingKeyLock().setKeyLockStatus error.');
			}
		});
	});
});
