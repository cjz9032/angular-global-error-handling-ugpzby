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
				providers: [VantageShellService]
			});
			service = TestBed.get(GamingAutoCloseService);
			shellService = TestBed.get(VantageShellService);
		});
		describe(':', () => {

			function setup() {
				const service = TestBed.get(GamingAutoCloseService);

				return { service };
			}

			it('should call getAutoCloseStatus', () => {
				const { service } = setup();
				spyOn(service.gamingAutoClose, 'getStatus').and.callThrough();
				service.getAutoCloseStatus();
				expect(service.gamingAutoClose.getStatus).toHaveBeenCalled();

				service.isShellAvailable = false;
				service.getAutoCloseStatus();
				expect(service.gamingAutoClose.getStatus).toHaveBeenCalled();
			});

			it('should call setAutoCloseStatus', () => {
				const { service } = setup();
				spyOn(service.gamingAutoClose, 'setStatus').and.callThrough();
				service.setAutoCloseStatus(true);
				expect(service.gamingAutoClose.setStatus).toHaveBeenCalled();

				service.isShellAvailable = false;
				service.setAutoCloseStatus(true);
				expect(service.gamingAutoClose.setStatus).toHaveBeenCalled();

			});

			it('should call getAppsAutoCloseList', () => {
				const { service } = setup();

				spyOn(service.gamingAutoClose, 'getAutoCloseList').and.callThrough();
				service.getAppsAutoCloseList();
				expect(service.gamingAutoClose.getAutoCloseList).toHaveBeenCalled();

				service.isShellAvailable = false;
				service.getAppsAutoCloseList();
				expect(service.gamingAutoClose.getAutoCloseList).toHaveBeenCalled();

			});

			it('should call getAppsAutoCloseRunningList', () => {
				const { service } = setup();

				spyOn(service.gamingAutoClose, 'getRunningList').and.callThrough();
				service.getAppsAutoCloseRunningList();
				expect(service.gamingAutoClose.getRunningList).toHaveBeenCalled();

				service.isShellAvailable = false;
				service.getAppsAutoCloseRunningList();
				expect(service.gamingAutoClose.getRunningList).toHaveBeenCalled();

			});

			it('should call addAppsAutoCloseList', () => {
				const { service } = setup();
				spyOn(service.gamingAutoClose, 'addAutoCloseList').and.callThrough();
				service.addAppsAutoCloseList(true);
				expect(service.gamingAutoClose.addAutoCloseList).toHaveBeenCalled();

				service.isShellAvailable = false;
				service.addAppsAutoCloseList(true);
				expect(service.gamingAutoClose.addAutoCloseList).toHaveBeenCalled();

			});

			it('should call delAppsAutoCloseList', () => {
				const { service } = setup();
				spyOn(service.gamingAutoClose, 'delAutoCloseList').and.callThrough();
				service.delAppsAutoCloseList(true);
				expect(service.gamingAutoClose.delAutoCloseList).toHaveBeenCalled();

				service.isShellAvailable = false;
				service.delAppsAutoCloseList(true);
				expect(service.gamingAutoClose.delAutoCloseList).toHaveBeenCalled();

			});

			it('should call setNeedToAsk', () => {
				const { service } = setup();
				spyOn(service.gamingAutoClose, 'setNeedToAsk').and.callThrough();
				service.setNeedToAsk(true);
				expect(service.gamingAutoClose.setNeedToAsk).toHaveBeenCalled();

				service.isShellAvailable = false;
				service.setNeedToAsk(true);
				expect(service.gamingAutoClose.setNeedToAsk).toHaveBeenCalled();

			});

			it('should call getNeedToAsk', () => {
				const { service } = setup();
				spyOn(service.gamingAutoClose, 'getNeedToAsk').and.callThrough();
				service.getNeedToAsk(true);
				expect(service.gamingAutoClose.getNeedToAsk).toHaveBeenCalled();

				service.isShellAvailable = false;
				service.getNeedToAsk(true);
				expect(service.gamingAutoClose.getNeedToAsk).toHaveBeenCalled();

			});

			it('should call functions throw error', () => {
				const { service } = setup();
				try{
					spyOn(service.gamingAutoClose, 'getStatus').and.throwError(new Error('new getStatus error'));
					service.getAutoCloseStatus();			
				} catch(error) {
					expect(service.gamingAutoClose.getStatus).toThrowError('new getStatus error');	
				}

				try{					
					spyOn(service.gamingAutoClose, 'setStatus').and.throwError(new Error('new setStatus error'));
					service.setAutoCloseStatus(true);
				} catch(error) {
					expect(service.gamingAutoClose.setStatus).toThrowError('new setStatus error');
				}

				try{
					spyOn(service.gamingAutoClose, 'getAutoCloseList').and.throwError(new Error('new getAutoCloseList error'));
					service.getAppsAutoCloseList();
				} catch(error) {
					expect(service.gamingAutoClose.getAutoCloseList).toThrowError('new getAutoCloseList error');
				}

				try{
					spyOn(service.gamingAutoClose, 'getRunningList').and.throwError(new Error('new getRunningList error'));
					service.getAppsAutoCloseRunningList();
				} catch(error) {
					expect(service.gamingAutoClose.getRunningList).toThrowError('new getRunningList error');
				}

				try{
					spyOn(service.gamingAutoClose, 'addAutoCloseList').and.throwError(new Error('new addAutoCloseList error'));
					service.addAppsAutoCloseList(true);
				} catch(error) {
					expect(service.gamingAutoClose.addAutoCloseList).toThrowError('new addAutoCloseList error');
				}

				try{
					spyOn(service.gamingAutoClose, 'delAutoCloseList').and.throwError(new Error('new delAutoCloseList error'));
					service.delAppsAutoCloseList(true);
				} catch(error) {
					expect(service.gamingAutoClose.delAutoCloseList).toThrowError('new delAutoCloseList error');
				}

				try{
					spyOn(service.gamingAutoClose, 'setNeedToAsk').and.throwError(new Error('new setNeedToAsk error'));
					service.setNeedToAsk(true);
				} catch(error) {
					expect(service.gamingAutoClose.setNeedToAsk).toThrowError('new setNeedToAsk error');
				}

				try{
					spyOn(service.gamingAutoClose, 'getNeedToAsk').and.throwError(new Error('new getNeedToAsk error'));
					service.getNeedToAsk();
				} catch(error) {
					expect(service.gamingAutoClose.getNeedToAsk).toThrowError('new getNeedToAsk error');
				}
			});

			it('should call setAutoCloseStatusCache', () => {
				const { service } = setup();
				spyOn(service, 'setAutoCloseStatusCache').and.callThrough();
				service.setAutoCloseStatusCache();
				expect(service.setAutoCloseStatusCache).toHaveBeenCalled();
				service.isShellAvailable = false;
				service.setAutoCloseStatusCache();
				expect(service.setAutoCloseStatusCache).toHaveBeenCalled();
			});


			it('should call getAutoCloseStatusCache', () => {
				const { service } = setup();
				spyOn(service, 'getAutoCloseStatusCache').and.callThrough();
				service.getAutoCloseStatusCache();
				expect(service.getAutoCloseStatusCache).toHaveBeenCalled();
				service.isShellAvailable = false;
				service.getAutoCloseStatusCache();
				expect(service.getAutoCloseStatusCache).toHaveBeenCalled();
			});

			it('should call setNeedToAskStatusCache', () => {
				const { service } = setup();
				spyOn(service, 'setNeedToAskStatusCache').and.callThrough();
				service.setNeedToAskStatusCache();
				expect(service.setNeedToAskStatusCache).toHaveBeenCalled();
				service.isShellAvailable = false;
				service.setNeedToAskStatusCache();
				expect(service.setNeedToAskStatusCache).toHaveBeenCalled();
			});

			it('should call getNeedToAskStatusCache', () => {
				const { service } = setup();
				spyOn(service, 'getNeedToAskStatusCache').and.callThrough();
				service.getNeedToAskStatusCache();
				expect(service.getNeedToAskStatusCache).toHaveBeenCalled();
				service.isShellAvailable = false;
				service.getNeedToAskStatusCache();
				expect(service.getNeedToAskStatusCache).toHaveBeenCalled();
			});

			it('should call setAutoCloseListCache', () => {
				const { service } = setup();
				spyOn(service, 'setAutoCloseListCache').and.callThrough();
				service.setAutoCloseListCache();
				expect(service.setAutoCloseListCache).toHaveBeenCalled();
				service.isShellAvailable = false;
				service.setAutoCloseListCache();
				expect(service.setAutoCloseListCache).toHaveBeenCalled();
			});

			it('should call getAutoCloseListCache', () => {
				const { service } = setup();
				spyOn(service, 'getAutoCloseListCache').and.callThrough();
				service.getAutoCloseListCache();
				expect(service.getAutoCloseListCache).toHaveBeenCalled();
				service.isShellAvailable = false;
				service.getAutoCloseListCache();
				expect(service.getAutoCloseListCache).toHaveBeenCalled();
			});

		});

	});
});



