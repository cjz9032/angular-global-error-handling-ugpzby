import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { VantageShellService } from '../../vantage-shell/vantage-shell-mock.service';
import { GamingAutoCloseService } from './gaming-autoclose.service';


describe('Shared service:', () => {
	let shellService: VantageShellService;
	let service: GamingAutoCloseService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule],
			providers: [VantageShellService, GamingAutoCloseService]
		});
		service = TestBed.get(GamingAutoCloseService);
		shellService = TestBed.get(VantageShellService);
	});
	describe(':', () => {

		function setup() {
			// tslint:disable-next-line: no-shadowed-variable
			const service = TestBed.get(GamingAutoCloseService);
			// const batteryDetailComponent = TestBed.get(BatteryDetailComponent);
			return { service };
		}




		it('should call setAutoCloseStatusCache', () => {
			// tslint:disable-next-line: no-shadowed-variable
			const { service } = setup();

			const myobj = spyOn(service, 'setAutoCloseStatusCache').and.callThrough();
			service.setAutoCloseStatusCache();
			expect(myobj).toHaveBeenCalled();

		});
		it('should call getAutoCloseStatusCache', () => {
			// tslint:disable-next-line: no-shadowed-variable
			const { service } = setup();

			const myobj = spyOn(service, 'getAutoCloseStatusCache').and.callThrough();
			service.getAutoCloseStatusCache();
			expect(myobj).toHaveBeenCalled();

		});


		it('should call setNeedToAskStatusCache', () => {
			// tslint:disable-next-line: no-shadowed-variable
			const { service } = setup();

			const myobj = spyOn(service, 'setNeedToAskStatusCache').and.callThrough();
			service.setNeedToAskStatusCache();
			expect(myobj).toHaveBeenCalled();

		});

		it('should call getNeedToAskStatusCache', () => {
			// tslint:disable-next-line: no-shadowed-variable
			const { service } = setup();

			const myobj = spyOn(service, 'getNeedToAskStatusCache').and.callThrough();
			service.getNeedToAskStatusCache();
			expect(myobj).toHaveBeenCalled();

		});


		it('should call setAutoCloseListCache', () => {
			// tslint:disable-next-line: no-shadowed-variable
			const { service } = setup();

			const myobj = spyOn(service, 'setAutoCloseListCache').and.callThrough();
			service.setAutoCloseListCache();
			expect(myobj).toHaveBeenCalled();

		});


		it('should call getAutoCloseListCache', () => {
			// tslint:disable-next-line: no-shadowed-variable
			const { service } = setup();

			const myobj = spyOn(service, 'getAutoCloseListCache').and.callThrough();
			service.getAutoCloseListCache();
			expect(myobj).toHaveBeenCalled();

		});






		});

});
