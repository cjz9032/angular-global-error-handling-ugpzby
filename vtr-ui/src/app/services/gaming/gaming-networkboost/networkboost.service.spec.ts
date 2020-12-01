import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { VantageShellService } from '../../vantage-shell/vantage-shell-mock.service';
import { NetworkBoostService } from './networkboost.service';
import { LocalCacheService } from '../../local-cache/local-cache.service';

describe('Shared service:', () => {
	let shellService: VantageShellService;
	let service: NetworkBoostService;
	let localCache: LocalCacheService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule],
			providers: [VantageShellService, NetworkBoostService],
		});
		service = TestBed.get(NetworkBoostService);
		shellService = TestBed.get(VantageShellService);
		localCache = TestBed.get(LocalCacheService);
	});
	describe(':', () => {
		function setup() {
			// eslint-disable-next-line no-shadow
			const service = TestBed.get(NetworkBoostService);
			// const batteryDetailComponent = TestBed.get(BatteryDetailComponent);
			return { service };
		}

		it('should call getNetworkBoostStatus', () => {
			// eslint-disable-next-line no-shadow
			const { service } = setup();
			const mockNetworkBoostData = {
				networkBoostFeature: true,
			};
			spyOn(service.gamingNetworkBoost, 'getNetUsingProcesses').and.callThrough();
			service.getNetUsingProcesses();
			expect(service.gamingNetworkBoost.getNetUsingProcesses).toHaveBeenCalled();
			service.isShellAvailable = false;
			service.getNetUsingProcesses();
			expect(service.gamingNetworkBoost.getNetUsingProcesses).toHaveBeenCalled();
		});

		it('should call getNetworkBoostList', () => {
			// eslint-disable-next-line no-shadow
			const { service } = setup();
			const mockNetworkBoostData = {
				networkBoostFeature: true,
			};
			const myobj = spyOn(service, 'getNetworkBoostList').and.callThrough();
			service.getNetworkBoostList();
			expect(myobj).toHaveBeenCalled();
			service.isShellAvailable = false;
			service.getNetworkBoostList();
			expect(myobj).toHaveBeenCalled();
		});

		it('should call getNeedToAsk', () => {
			// eslint-disable-next-line no-shadow
			const { service } = setup();
			const mockNetworkBoostData = {
				networkBoostFeature: true,
			};
			const myobj = spyOn(service, 'getNeedToAsk').and.callThrough();
			service.getNeedToAsk();
			expect(myobj).toHaveBeenCalled();
		});

		it('should call setNeedToAsk', () => {
			// eslint-disable-next-line no-shadow
			const { service } = setup();
			const mockNetworkBoostData = {
				networkBoostFeature: true,
			};
			const myobj = spyOn(service, 'setNeedToAsk').and.callThrough();
			service.setNeedToAsk();
			expect(myobj).toHaveBeenCalled();
		});

		it('should call getNetworkBoostStatus', () => {
			// eslint-disable-next-line no-shadow
			const { service } = setup();
			spyOn(service.gamingNetworkBoost, 'getStatus').and.callThrough();
			service.getNetworkBoostStatus();
			expect(service.gamingNetworkBoost.getStatus).toHaveBeenCalled();
			service.isShellAvailable = false;
			service.getNetworkBoostStatus();
			expect(service.gamingNetworkBoost.getStatus).toHaveBeenCalled();
		});

		it('should call setNetworkBoostStatus', () => {
			// eslint-disable-next-line no-shadow
			const { service } = setup();
			spyOn(service.gamingNetworkBoost, 'setStatus').and.callThrough();
			service.setNetworkBoostStatus();
			expect(service.gamingNetworkBoost.setStatus).toHaveBeenCalled();
			service.isShellAvailable = false;
			service.setNetworkBoostStatus();
			expect(service.gamingNetworkBoost.setStatus).toHaveBeenCalled();
		});

		it('should call addProcessToNetworkBoost', () => {
			// eslint-disable-next-line no-shadow
			const { service } = setup();
			spyOn(service.gamingNetworkBoost, 'addProcessToNetBoost').and.callThrough();
			service.addProcessToNetworkBoost();
			expect(service.gamingNetworkBoost.addProcessToNetBoost).toHaveBeenCalled();
			service.isShellAvailable = false;
			service.addProcessToNetworkBoost();
			expect(service.gamingNetworkBoost.addProcessToNetBoost).toHaveBeenCalled();
		});

		it('should call deleteProcessInNetBoost', () => {
			// eslint-disable-next-line no-shadow
			const { service } = setup();
			spyOn(service.gamingNetworkBoost, 'deleteProcessInNetBoost').and.callThrough();
			service.deleteProcessInNetBoost('apps');
			expect(service.gamingNetworkBoost.deleteProcessInNetBoost).toHaveBeenCalled();
			service.isShellAvailable = false;
			service.deleteProcessInNetBoost('apps');
			expect(service.gamingNetworkBoost.deleteProcessInNetBoost).toHaveBeenCalled();
		});

		it('should call functions throw error', () => {
			const { service } = setup();
			try {
				spyOn(service.gamingNetworkBoost, 'getStatus').and.throwError(
					new Error('new getStatus error')
				);
				service.getNetworkBoostStatus();
			} catch (error) {
				expect(service.gamingNetworkBoost.getStatus).toThrowError('new getStatus error');
			}

			try {
				spyOn(service.gamingNetworkBoost, 'getProcessesInNetworkBoost').and.throwError(
					new Error('new getProcessesInNetworkBoost error')
				);
				service.getNetworkBoostList();
			} catch (error) {
				expect(service.gamingNetworkBoost.getProcessesInNetworkBoost).toThrowError(
					'new getProcessesInNetworkBoost error'
				);
			}

			try {
				spyOn(service.gamingNetworkBoost, 'getNetUsingProcesses').and.throwError(
					new Error('new getNetUsingProcesses error')
				);
				service.getNetUsingProcesses();
			} catch (error) {
				expect(service.gamingNetworkBoost.getNetUsingProcesses).toThrowError(
					'new getNetUsingProcesses error'
				);
			}

			try {
				spyOn(service.gamingNetworkBoost, 'setStatus').and.throwError(
					new Error('new setStatus error')
				);
				service.setNetworkBoostStatus();
			} catch (error) {
				expect(service.gamingNetworkBoost.setStatus).toThrowError('new setStatus error');
			}

			try {
				spyOn(service.gamingNetworkBoost, 'addProcessToNetBoost').and.throwError(
					new Error('new addProcessToNetBoost error')
				);
				service.addProcessToNetworkBoost(true);
			} catch (error) {
				expect(service.gamingNetworkBoost.addProcessToNetBoost).toThrowError(
					'new addProcessToNetBoost error'
				);
			}

			try {
				spyOn(service.gamingNetworkBoost, 'deleteProcessInNetBoost').and.throwError(
					new Error('new deleteProcessInNetBoost error')
				);
				service.deleteProcessInNetBoost(true);
			} catch (error) {
				expect(service.gamingNetworkBoost.deleteProcessInNetBoost).toThrowError(
					'new deleteProcessInNetBoost error'
				);
			}

			try {
				spyOn(localCache, 'getLocalCacheValue').and.throwError(
					new Error('new getLocalCacheValue error')
				);
				service.getNeedToAsk();
			} catch (error) {
				expect(localCache.getLocalCacheValue).toThrowError('new getLocalCacheValue error');
			}

			try {
				spyOn(localCache, 'setLocalCacheValue').and.throwError(
					new Error('new setLocalCacheValue error')
				);
				service.setNeedToAsk(true);
			} catch (error) {
				expect(localCache.setLocalCacheValue).toThrowError('new setLocalCacheValue error');
			}
		});
	});
});
