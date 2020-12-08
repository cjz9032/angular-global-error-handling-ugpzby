import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { VantageShellService } from '../../vantage-shell/vantage-shell-mock.service';
import { GamingAutoCloseService } from './gaming-autoclose.service';

describe('GamingAutoCloseService', () => {
	describe('GamingAutoCloseService:', () => {
		let shellService: VantageShellService;
		let service: GamingAutoCloseService;

		beforeEach(() => {
			TestBed.configureTestingModule({
				imports: [HttpClientModule],
				providers: [VantageShellService],
			});
			service = TestBed.get(GamingAutoCloseService);
			shellService = TestBed.get(VantageShellService);
		});
		describe(':', () => {
			const setup = () => {
				const setUpService = TestBed.get(GamingAutoCloseService);

				return { setUpService };
			};

			it('should call getAutoCloseStatus', () => {
				const { setUpService } = setup();
				spyOn(setUpService.gamingAutoClose, 'getStatus').and.callThrough();
				setUpService.getAutoCloseStatus();
				expect(setUpService.gamingAutoClose.getStatus).toHaveBeenCalled();

				setUpService.isShellAvailable = false;
				setUpService.getAutoCloseStatus();
				expect(setUpService.gamingAutoClose.getStatus).toHaveBeenCalled();
			});

			it('should call setAutoCloseStatus', () => {
				const { setUpService } = setup();
				spyOn(setUpService.gamingAutoClose, 'setStatus').and.callThrough();
				setUpService.setAutoCloseStatus(true);
				expect(setUpService.gamingAutoClose.setStatus).toHaveBeenCalled();

				setUpService.isShellAvailable = false;
				setUpService.setAutoCloseStatus(true);
				expect(setUpService.gamingAutoClose.setStatus).toHaveBeenCalled();
			});

			it('should call getAppsAutoCloseList', () => {
				const { setUpService } = setup();

				spyOn(setUpService.gamingAutoClose, 'getAutoCloseList').and.callThrough();
				setUpService.getAppsAutoCloseList();
				expect(setUpService.gamingAutoClose.getAutoCloseList).toHaveBeenCalled();

				setUpService.isShellAvailable = false;
				setUpService.getAppsAutoCloseList();
				expect(setUpService.gamingAutoClose.getAutoCloseList).toHaveBeenCalled();
			});

			it('should call getAppsAutoCloseRunningList', () => {
				const { setUpService } = setup();

				spyOn(setUpService.gamingAutoClose, 'getRunningList').and.callThrough();
				setUpService.getAppsAutoCloseRunningList();
				expect(setUpService.gamingAutoClose.getRunningList).toHaveBeenCalled();

				setUpService.isShellAvailable = false;
				setUpService.getAppsAutoCloseRunningList();
				expect(setUpService.gamingAutoClose.getRunningList).toHaveBeenCalled();
			});

			it('should call addAppsAutoCloseList', () => {
				const { setUpService } = setup();
				spyOn(setUpService.gamingAutoClose, 'addAutoCloseList').and.callThrough();
				setUpService.addAppsAutoCloseList(true);
				expect(setUpService.gamingAutoClose.addAutoCloseList).toHaveBeenCalled();

				setUpService.isShellAvailable = false;
				setUpService.addAppsAutoCloseList(true);
				expect(setUpService.gamingAutoClose.addAutoCloseList).toHaveBeenCalled();
			});

			it('should call delAppsAutoCloseList', () => {
				const { setUpService } = setup();
				spyOn(setUpService.gamingAutoClose, 'delAutoCloseList').and.callThrough();
				setUpService.delAppsAutoCloseList(true);
				expect(setUpService.gamingAutoClose.delAutoCloseList).toHaveBeenCalled();

				setUpService.isShellAvailable = false;
				setUpService.delAppsAutoCloseList(true);
				expect(setUpService.gamingAutoClose.delAutoCloseList).toHaveBeenCalled();
			});

			it('should call setNeedToAsk', () => {
				const { setUpService } = setup();
				spyOn(setUpService.gamingAutoClose, 'setNeedToAsk').and.callThrough();
				setUpService.setNeedToAsk(true);
				expect(setUpService.gamingAutoClose.setNeedToAsk).toHaveBeenCalled();

				setUpService.isShellAvailable = false;
				setUpService.setNeedToAsk(true);
				expect(setUpService.gamingAutoClose.setNeedToAsk).toHaveBeenCalled();
			});

			it('should call getNeedToAsk', () => {
				const { setUpService } = setup();
				spyOn(setUpService.gamingAutoClose, 'getNeedToAsk').and.callThrough();
				setUpService.getNeedToAsk(true);
				expect(setUpService.gamingAutoClose.getNeedToAsk).toHaveBeenCalled();

				setUpService.isShellAvailable = false;
				setUpService.getNeedToAsk(true);
				expect(setUpService.gamingAutoClose.getNeedToAsk).toHaveBeenCalled();
			});

			it('should call functions throw error', () => {
				const { setUpService } = setup();
				try {
					spyOn(setUpService.gamingAutoClose, 'getStatus').and.throwError(
						new Error('new getStatus error')
					);
					setUpService.getAutoCloseStatus();
				} catch (error) {
					expect(setUpService.gamingAutoClose.getStatus).toThrowError('new getStatus error');
				}

				try {
					spyOn(setUpService.gamingAutoClose, 'setStatus').and.throwError(
						new Error('new setStatus error')
					);
					setUpService.setAutoCloseStatus(true);
				} catch (error) {
					expect(setUpService.gamingAutoClose.setStatus).toThrowError('new setStatus error');
				}

				try {
					spyOn(setUpService.gamingAutoClose, 'getAutoCloseList').and.throwError(
						new Error('new getAutoCloseList error')
					);
					setUpService.getAppsAutoCloseList();
				} catch (error) {
					expect(setUpService.gamingAutoClose.getAutoCloseList).toThrowError(
						'new getAutoCloseList error'
					);
				}

				try {
					spyOn(setUpService.gamingAutoClose, 'getRunningList').and.throwError(
						new Error('new getRunningList error')
					);
					setUpService.getAppsAutoCloseRunningList();
				} catch (error) {
					expect(setUpService.gamingAutoClose.getRunningList).toThrowError(
						'new getRunningList error'
					);
				}

				try {
					spyOn(setUpService.gamingAutoClose, 'addAutoCloseList').and.throwError(
						new Error('new addAutoCloseList error')
					);
					setUpService.addAppsAutoCloseList(true);
				} catch (error) {
					expect(setUpService.gamingAutoClose.addAutoCloseList).toThrowError(
						'new addAutoCloseList error'
					);
				}

				try {
					spyOn(setUpService.gamingAutoClose, 'delAutoCloseList').and.throwError(
						new Error('new delAutoCloseList error')
					);
					setUpService.delAppsAutoCloseList(true);
				} catch (error) {
					expect(setUpService.gamingAutoClose.delAutoCloseList).toThrowError(
						'new delAutoCloseList error'
					);
				}

				try {
					spyOn(setUpService.gamingAutoClose, 'setNeedToAsk').and.throwError(
						new Error('new setNeedToAsk error')
					);
					setUpService.setNeedToAsk(true);
				} catch (error) {
					expect(setUpService.gamingAutoClose.setNeedToAsk).toThrowError(
						'new setNeedToAsk error'
					);
				}

				try {
					spyOn(setUpService.gamingAutoClose, 'getNeedToAsk').and.throwError(
						new Error('new getNeedToAsk error')
					);
					setUpService.getNeedToAsk();
				} catch (error) {
					expect(setUpService.gamingAutoClose.getNeedToAsk).toThrowError(
						'new getNeedToAsk error'
					);
				}
			});

			it('should call setAutoCloseStatusCache', () => {
				const { setUpService } = setup();
				spyOn(setUpService, 'setAutoCloseStatusCache').and.callThrough();
				setUpService.setAutoCloseStatusCache();
				expect(setUpService.setAutoCloseStatusCache).toHaveBeenCalled();
				setUpService.isShellAvailable = false;
				setUpService.setAutoCloseStatusCache();
				expect(setUpService.setAutoCloseStatusCache).toHaveBeenCalled();
			});

			it('should call getAutoCloseStatusCache', () => {
				const { setUpService } = setup();
				spyOn(setUpService, 'getAutoCloseStatusCache').and.callThrough();
				setUpService.getAutoCloseStatusCache();
				expect(setUpService.getAutoCloseStatusCache).toHaveBeenCalled();
				setUpService.isShellAvailable = false;
				setUpService.getAutoCloseStatusCache();
				expect(setUpService.getAutoCloseStatusCache).toHaveBeenCalled();
			});

			it('should call setNeedToAskStatusCache', () => {
				const { setUpService } = setup();
				spyOn(setUpService, 'setNeedToAskStatusCache').and.callThrough();
				setUpService.setNeedToAskStatusCache();
				expect(setUpService.setNeedToAskStatusCache).toHaveBeenCalled();
				setUpService.isShellAvailable = false;
				setUpService.setNeedToAskStatusCache();
				expect(setUpService.setNeedToAskStatusCache).toHaveBeenCalled();
			});

			it('should call getNeedToAskStatusCache', () => {
				const { setUpService } = setup();
				spyOn(setUpService, 'getNeedToAskStatusCache').and.callThrough();
				setUpService.getNeedToAskStatusCache();
				expect(setUpService.getNeedToAskStatusCache).toHaveBeenCalled();
				setUpService.isShellAvailable = false;
				setUpService.getNeedToAskStatusCache();
				expect(setUpService.getNeedToAskStatusCache).toHaveBeenCalled();
			});

			it('should call setAutoCloseListCache', () => {
				const { setUpService } = setup();
				spyOn(setUpService, 'setAutoCloseListCache').and.callThrough();
				setUpService.setAutoCloseListCache();
				expect(setUpService.setAutoCloseListCache).toHaveBeenCalled();
				setUpService.isShellAvailable = false;
				setUpService.setAutoCloseListCache();
				expect(setUpService.setAutoCloseListCache).toHaveBeenCalled();
			});

			it('should call getAutoCloseListCache', () => {
				const { setUpService } = setup();
				spyOn(setUpService, 'getAutoCloseListCache').and.callThrough();
				setUpService.getAutoCloseListCache();
				expect(setUpService.getAutoCloseListCache).toHaveBeenCalled();
				setUpService.isShellAvailable = false;
				setUpService.getAutoCloseListCache();
				expect(setUpService.getAutoCloseListCache).toHaveBeenCalled();
			});
		});
	});
});
