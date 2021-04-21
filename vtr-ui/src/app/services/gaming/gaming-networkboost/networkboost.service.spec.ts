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
		const setup = () => {
			const setUpService = TestBed.get(NetworkBoostService);
			return { setUpService };
		};

		it('should call getNetworkBoostStatus', () => {
			const { setUpService } = setup();
			const mockNetworkBoostData = {
				networkBoostFeature: true,
			};
			spyOn(setUpService.gamingNetworkBoost, 'getNetUsingProcesses').and.callThrough();
			setUpService.getNetUsingProcesses();
			expect(setUpService.gamingNetworkBoost.getNetUsingProcesses).toHaveBeenCalled();
			setUpService.isShellAvailable = false;
			setUpService.getNetUsingProcesses();
			expect(setUpService.gamingNetworkBoost.getNetUsingProcesses).toHaveBeenCalled();
		});

		it('should call getNetworkBoostList', () => {
			const { setUpService } = setup();
			const mockNetworkBoostData = {
				networkBoostFeature: true,
			};
			const myobj = spyOn(setUpService, 'getNetworkBoostList').and.callThrough();
			setUpService.getNetworkBoostList();
			expect(myobj).toHaveBeenCalled();
			setUpService.isShellAvailable = false;
			setUpService.getNetworkBoostList();
			expect(myobj).toHaveBeenCalled();
		});

		it('should call getNeedToAsk', () => {
			const { setUpService } = setup();
			const mockNetworkBoostData = {
				networkBoostFeature: true,
			};
			const myobj = spyOn(setUpService, 'getNeedToAsk').and.callThrough();
			setUpService.getNeedToAsk();
			expect(myobj).toHaveBeenCalled();
		});

		it('should call setNeedToAsk', () => {
			const { setUpService } = setup();
			const mockNetworkBoostData = {
				networkBoostFeature: true,
			};
			const myobj = spyOn(setUpService, 'setNeedToAsk').and.callThrough();
			setUpService.setNeedToAsk();
			expect(myobj).toHaveBeenCalled();
		});

		it('should call getNetworkBoostStatus', () => {
			const { setUpService } = setup();
			spyOn(setUpService.gamingNetworkBoost, 'getStatus').and.callThrough();
			setUpService.getNetworkBoostStatus();
			expect(setUpService.gamingNetworkBoost.getStatus).toHaveBeenCalled();
			setUpService.isShellAvailable = false;
			setUpService.getNetworkBoostStatus();
			expect(setUpService.gamingNetworkBoost.getStatus).toHaveBeenCalled();
		});

		it('should call setNetworkBoostStatus', () => {
			const { setUpService } = setup();
			spyOn(setUpService.gamingNetworkBoost, 'setStatus').and.callThrough();
			setUpService.setNetworkBoostStatus();
			expect(setUpService.gamingNetworkBoost.setStatus).toHaveBeenCalled();
			setUpService.isShellAvailable = false;
			setUpService.setNetworkBoostStatus();
			expect(setUpService.gamingNetworkBoost.setStatus).toHaveBeenCalled();
		});

		it('should call addProcessToNetworkBoost', () => {
			const { setUpService } = setup();
			spyOn(setUpService.gamingNetworkBoost, 'addProcessToNetBoost').and.callThrough();
			setUpService.addProcessToNetworkBoost();
			expect(setUpService.gamingNetworkBoost.addProcessToNetBoost).toHaveBeenCalled();
			setUpService.isShellAvailable = false;
			setUpService.addProcessToNetworkBoost();
			expect(setUpService.gamingNetworkBoost.addProcessToNetBoost).toHaveBeenCalled();
		});

		it('should call deleteProcessInNetBoost', () => {
			const { setUpService } = setup();
			spyOn(setUpService.gamingNetworkBoost, 'deleteProcessInNetBoost').and.callThrough();
			setUpService.deleteProcessInNetBoost('apps');
			expect(setUpService.gamingNetworkBoost.deleteProcessInNetBoost).toHaveBeenCalled();
			setUpService.isShellAvailable = false;
			setUpService.deleteProcessInNetBoost('apps');
			expect(setUpService.gamingNetworkBoost.deleteProcessInNetBoost).toHaveBeenCalled();
		});

		it('should call functions throw error', () => {
			const { setUpService } = setup();
			try {
				spyOn(setUpService.gamingNetworkBoost, 'getStatus').and.throwError(
					new Error('new getStatus error')
				);
				setUpService.getNetworkBoostStatus();
			} catch (error) {
				expect(setUpService.gamingNetworkBoost.getStatus).toThrowError('new getStatus error');
			}

			try {
				spyOn(setUpService.gamingNetworkBoost, 'getProcessesInNetworkBoost').and.throwError(
					new Error('new getProcessesInNetworkBoost error')
				);
				setUpService.getNetworkBoostList();
			} catch (error) {
				expect(setUpService.gamingNetworkBoost.getProcessesInNetworkBoost).toThrowError(
					'new getProcessesInNetworkBoost error'
				);
			}

			try {
				spyOn(setUpService.gamingNetworkBoost, 'getNetUsingProcesses').and.throwError(
					new Error('new getNetUsingProcesses error')
				);
				setUpService.getNetUsingProcesses();
			} catch (error) {
				expect(setUpService.gamingNetworkBoost.getNetUsingProcesses).toThrowError(
					'new getNetUsingProcesses error'
				);
			}

			try {
				spyOn(setUpService.gamingNetworkBoost, 'setStatus').and.throwError(
					new Error('new setStatus error')
				);
				setUpService.setNetworkBoostStatus();
			} catch (error) {
				expect(setUpService.gamingNetworkBoost.setStatus).toThrowError('new setStatus error');
			}

			try {
				spyOn(setUpService.gamingNetworkBoost, 'addProcessToNetBoost').and.throwError(
					new Error('new addProcessToNetBoost error')
				);
				setUpService.addProcessToNetworkBoost(true);
			} catch (error) {
				expect(setUpService.gamingNetworkBoost.addProcessToNetBoost).toThrowError(
					'new addProcessToNetBoost error'
				);
			}

			try {
				spyOn(setUpService.gamingNetworkBoost, 'deleteProcessInNetBoost').and.throwError(
					new Error('new deleteProcessInNetBoost error')
				);
				setUpService.deleteProcessInNetBoost(true);
			} catch (error) {
				expect(setUpService.gamingNetworkBoost.deleteProcessInNetBoost).toThrowError(
					'new deleteProcessInNetBoost error'
				);
			}

			try {
				spyOn(localCache, 'getLocalCacheValue').and.throwError(
					new Error('new getLocalCacheValue error')
				);
				setUpService.getNeedToAsk();
			} catch (error) {
				expect(localCache.getLocalCacheValue).toThrowError('new getLocalCacheValue error');
			}

			try {
				spyOn(localCache, 'setLocalCacheValue').and.throwError(
					new Error('new setLocalCacheValue error')
				);
				setUpService.setNeedToAsk(true);
			} catch (error) {
				expect(localCache.setLocalCacheValue).toThrowError('new setLocalCacheValue error');
			}
		});
	});
});
