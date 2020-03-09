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
			providers: [VantageShellService, GamingKeyLockService]
		});
		service = TestBed.get(GamingKeyLockService);
		shellService = TestBed.get(VantageShellService);

	});

	describe(':', () => {

		function setup() {
			// tslint:disable-next-line: no-shadowed-variable
			const service = TestBed.get(GamingKeyLockService);
			return { service };
		}



		it('should call getKeyLockStatus', () => {
			// tslint:disable-next-line: no-shadowed-variable
			const { service } = setup();
			service.isShellAvailable = true;
			spyOn(service.gamingKeyLock, 'getKeyLockStatus').and.callThrough();
			service.getKeyLockStatus();
			expect(service.gamingKeyLock.getKeyLockStatus).toHaveBeenCalled();

			service.isShellAvailable = false;
			service.getKeyLockStatus();
			expect(service.gamingKeyLock.getKeyLockStatus).toHaveBeenCalled();
		});



		it('should call setKeyLockStatus', () => {
			// tslint:disable-next-line: no-shadowed-variable
			const { service } = setup();
			service.isShellAvailable = true;
			spyOn(service.gamingKeyLock, 'setKeyLockStatus').and.callThrough();
			service.setKeyLockStatus();
			expect(service.gamingKeyLock.setKeyLockStatus).toHaveBeenCalled();

			service.isShellAvailable = false;
			service.setKeyLockStatus();
			expect(service.gamingKeyLock.setKeyLockStatus).toHaveBeenCalled();
		});


	});

});
