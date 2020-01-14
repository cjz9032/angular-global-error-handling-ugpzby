
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { VantageShellService } from '../../vantage-shell/vantage-shell-mock.service';
import { NetworkBoostService } from './networkboost.service';

describe('Shared service:', () => {
	let shellService: VantageShellService;
	let service: NetworkBoostService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule],
			providers: [VantageShellService,NetworkBoostService]
		});
		service = TestBed.get(NetworkBoostService);
		shellService = TestBed.get(VantageShellService);
	});
	describe(':', () => {

		function setup() {
			// tslint:disable-next-line: no-shadowed-variable
			const service = TestBed.get(NetworkBoostService);
			// const batteryDetailComponent = TestBed.get(BatteryDetailComponent);
			return { service };
		}


		it('should call getNetworkBoostStatus', () => {
			// tslint:disable-next-line: no-shadowed-variable
			const { service } = setup();
			const mockNetworkBoostData = {
				networkBoostFeature: true
			};

			spyOn(service.gamingNetworkBoost, 'getNetUsingProcesses').and.callThrough();
			service.getNetUsingProcesses();
			expect(service.gamingNetworkBoost.getNetUsingProcesses).toHaveBeenCalled();
			service.isShellAvailable = false;
			service.getNetUsingProcesses();
			expect(service.gamingNetworkBoost.getNetUsingProcesses).toHaveBeenCalled();

		});



		it('should call getNetworkBoostList', () => {
			// tslint:disable-next-line: no-shadowed-variable
			const { service } = setup();
			const mockNetworkBoostData = {
				networkBoostFeature: true
			};
			const myobj = spyOn(service, 'getNetworkBoostList').and.callThrough();
			service.getNetworkBoostList();
			expect(myobj).toHaveBeenCalled();

		});
		it('should call getNeedToAsk', () => {
			// tslint:disable-next-line: no-shadowed-variable
			const { service } = setup();
			const mockNetworkBoostData = {
				networkBoostFeature: true
			};
			const myobj = spyOn(service, 'getNeedToAsk').and.callThrough();
			service.getNeedToAsk();
			expect(myobj).toHaveBeenCalled();

		});
		it('should call setNeedToAsk', () => {
			// tslint:disable-next-line: no-shadowed-variable
			const { service } = setup();
			const mockNetworkBoostData = {
				networkBoostFeature: true
			};
			const myobj = spyOn(service, 'setNeedToAsk').and.callThrough();
			service.setNeedToAsk();
			expect(myobj).toHaveBeenCalled();

		});

		it('should call getNetworkBoostStatus', () => {
			// tslint:disable-next-line: no-shadowed-variable
			const { service } = setup();
			spyOn(service.gamingNetworkBoost, 'getStatus').and.callThrough();
			service.getNetworkBoostStatus();
			expect(service.gamingNetworkBoost.getStatus).toHaveBeenCalled();
			service.isShellAvailable = false;
			service.getNetworkBoostStatus();
			expect(service.gamingNetworkBoost.getStatus).toHaveBeenCalled();

		});


		it('should call setNetworkBoostStatus', () => {
			// tslint:disable-next-line: no-shadowed-variable
			const { service } = setup();
			spyOn(service.gamingNetworkBoost, 'setStatus').and.callThrough();
			service.setNetworkBoostStatus();
			expect(service.gamingNetworkBoost.setStatus).toHaveBeenCalled();
			service.isShellAvailable = false;
			service.setNetworkBoostStatus();
			expect(service.gamingNetworkBoost.setStatus).toHaveBeenCalled();

		});

		it('should call addProcessToNetworkBoost', () => {
			// tslint:disable-next-line: no-shadowed-variable
			const { service } = setup();
			spyOn(service.gamingNetworkBoost, 'addProcessToNetBoost').and.callThrough();
			service.addProcessToNetworkBoost();
			expect(service.gamingNetworkBoost.addProcessToNetBoost).toHaveBeenCalled();
			service.isShellAvailable = false;
			service.addProcessToNetworkBoost();
			expect(service.gamingNetworkBoost.addProcessToNetBoost).toHaveBeenCalled();

		});





		});

});
