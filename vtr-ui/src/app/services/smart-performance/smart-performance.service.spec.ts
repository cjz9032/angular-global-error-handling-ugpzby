import { TestBed } from '@angular/core/testing';

import { SmartPerformanceService } from './smart-performance.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { HttpClientModule } from '@angular/common/http';

describe('SmartPerformanceService', () => {
	let shellService: VantageShellService;
	let service: SmartPerformanceService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule],
			providers: [VantageShellService],
		});
		service = TestBed.get(SmartPerformanceService);
		shellService = TestBed.get(VantageShellService);
	});
	describe(':', () => {
		it('should call getReadiness', () => {

			spyOn(service, 'getReadiness').and.callThrough();
			service.getReadiness();
			expect(service.getReadiness).toHaveBeenCalled();

			service.isShellAvailable = false;
			service.getReadiness();
			expect(service.getReadiness).toHaveBeenCalled();
		});

		it('should call startScan', () => {
			spyOn(service, 'startScan').and.callThrough();
			service.startScan();
			expect(service.startScan).toHaveBeenCalled();

			service.isShellAvailable = false;
			service.startScan();
			expect(service.startScan).toHaveBeenCalled();
		});

		it('should call launchScanAndFix', () => {
			spyOn(service, 'launchScanAndFix').and.callThrough();
			service.launchScanAndFix();
			expect(service.launchScanAndFix).toHaveBeenCalled();

			service.isShellAvailable = false;
			service.launchScanAndFix();
			expect(service.launchScanAndFix).toHaveBeenCalled();
		});

		it('should call cancelScan', () => {
			spyOn(service, 'cancelScan').and.callThrough();
			service.cancelScan();
			expect(service.cancelScan).toHaveBeenCalled();

			service.isShellAvailable = false;
			service.cancelScan();
			expect(service.cancelScan).toHaveBeenCalled();
		});

		it('should call getSubscriptionDataDetail', () => {

			spyOn(service, 'getSubscriptionDataDetail').and.callThrough();
			service.getSubscriptionDataDetail();
			expect(service.getSubscriptionDataDetail).toHaveBeenCalled();

			service.isShellAvailable = false;
			service.getSubscriptionDataDetail();
			expect(service.getSubscriptionDataDetail).toHaveBeenCalled();
		});

		it('should call getScanSettings', () => {
			spyOn(service, 'getScanSettings').and.callThrough();
			service.getScanSettings('{}');
			expect(service.getScanSettings).toHaveBeenCalled();

			service.isShellAvailable = false;
			service.getScanSettings('{}');
			expect(service.getScanSettings).toHaveBeenCalled();
		});

		it('should call getScanSummary', () => {
			spyOn(service, 'getScanSummary').and.callThrough();
			service.getScanSummary('');
			expect(service.getScanSummary).toHaveBeenCalled();

			service.isShellAvailable = false;
			service.getScanSummary('');
			expect(service.getScanSummary).toHaveBeenCalled();
		});

		it('should call getSubscriptionDataDetail', () => {

			spyOn(service, 'getSubscriptionDataDetail').and.callThrough();
			service.getSubscriptionDataDetail();
			expect(service.getSubscriptionDataDetail).toHaveBeenCalled();
		});

		it('should call getExpiredStatus', () => {
			spyOn(service, 'getExpiredStatus').and.callThrough();
			const data = {
				currentTime: '2020-11-04T07:46:26.899+0000',
				expiredTime: '2021-11-04T07:46:26.899+0000'
			};
			service.getExpiredStatus(
				data
			);
			expect(service.getExpiredStatus).toHaveBeenCalled();
		});
	});
});
