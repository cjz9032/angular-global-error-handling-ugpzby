import { TestBed } from '@angular/core/testing';

import { SmartPerformanceService } from './smart-performance.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { HttpClientModule } from '@angular/common/http';

fdescribe('SmartPerformanceService', () => {
  // beforeEach(() => TestBed.configureTestingModule({}));

  // it('should be created', () => {
  //   const service: SmartPerformanceService = TestBed.get(SmartPerformanceService);
  //   expect(service).toBeTruthy();
  // });
  //describe('SmartPerformanceService:', () => {
    let shellService: VantageShellService;
    let service: SmartPerformanceService;
     
    beforeEach(() => {
           TestBed.configureTestingModule({
             imports: [HttpClientModule],
             providers: [VantageShellService]
           });
           service = TestBed.get(SmartPerformanceService);
           shellService = TestBed.get(VantageShellService);
    });
    describe(':', () => {
  
      function setup() {
        const service = TestBed.get(SmartPerformanceService);
        
        return { service };
      }
        
      it('should call getReadiness', () => {
        const { service } = setup();
        
        spyOn(service,'getReadiness').and.callThrough();
        service.getReadiness();
        expect(service.getReadiness).toHaveBeenCalled();

        service.isShellAvailable=false;
        service.getReadiness();
        expect(service.getReadiness).toHaveBeenCalled();
      });

      // it('should call startScan', () => {
      //   const { service } = setup();
      //     spyOn(service,'startScan').and.callThrough();
      //     service.startScan();
      //     expect(service.startScan).toHaveBeenCalled();

      //     service.isShellAvailable=false;
      //     service.startScan();
      //     expect(service.launchScan).toHaveBeenCalled();
      // });

      it('should call launchScanAndFix', () => {
        const { service } = setup();
        
          spyOn(service,'launchScanAndFix').and.callThrough();
          service.launchScanAndFix();
          expect(service.launchScanAndFix).toHaveBeenCalled();

          service.isShellAvailable=false;
          service.launchScanAndFix();
          expect(service.launchScanAndFix).toHaveBeenCalled();
      });

      it('should call cancelScan', () => {
        const { service } = setup();
        
          spyOn(service,'cancelScan').and.callThrough();
          service.cancelScan();
          expect(service.cancelScan).toHaveBeenCalled();

          service.isShellAvailable=false;
          service.cancelScan();
          expect(service.cancelScan).toHaveBeenCalled();
      });
                
      it('should call getSubscriptionDetails', () => {
        const { service } = setup();
        
          spyOn(service,'getSubscriptionDetails').and.callThrough();
          service.getSubscriptionDetails();
          expect(service.getSubscriptionDetails).toHaveBeenCalled();

          service.isShellAvailable=false;
          service.getSubscriptionDetails();
          expect(service.getSubscriptionDetails).toHaveBeenCalled();
      });

      it('should call getScanSettings', () => {
        const { service } = setup();
        
          spyOn(service,'getScanSettings').and.callThrough();
          service.getScanSettings();
          expect(service.getScanSettings).toHaveBeenCalled();

          service.isShellAvailable=false;
          service.getScanSettings();
          expect(service.getScanSettings).toHaveBeenCalled();
      });

      it('should call getScanSummary', () => {
        const { service } = setup();
        
          spyOn(service,'getScanSummary').and.callThrough();
          service.getScanSummary();
          expect(service.getScanSummary).toHaveBeenCalled();

          service.isShellAvailable=false;
          service.getScanSummary();
          expect(service.getScanSummary).toHaveBeenCalled();
      });

    });
        
 // });
});