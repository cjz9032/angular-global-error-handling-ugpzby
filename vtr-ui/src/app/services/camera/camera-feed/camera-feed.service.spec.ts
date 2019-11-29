import { TestBed } from '@angular/core/testing';

import { CameraFeedService } from './camera-feed.service';
import { VantageShellService } from '../../vantage-shell/vantage-shell-mock.service';
import { HttpClientModule } from '@angular/common/http';



describe('Shared service:', () => {
	let shellService: VantageShellService;
	 let service: CameraFeedService;
	 
	beforeEach(() => {
		 		TestBed.configureTestingModule({
		 			imports: [HttpClientModule],
		 			providers: [VantageShellService]
		 		});
		 		service = TestBed.get(CameraFeedService);
		 		shellService = TestBed.get(VantageShellService);
		 	});
			 describe(':', () => {

				function setup() {
				  const service = TestBed.get(CameraFeedService);
				 // const batteryDetailComponent = TestBed.get(BatteryDetailComponent);
				  return { service };
        }
             
			it('should call getCameraBlurSettings', () => {
				const { service } = setup();
				
				  spyOn(service.cameraBlur,'getCameraBlurSettings').and.callThrough();
				  service.getCameraBlurSettings();
				  expect(service.cameraBlur.getCameraBlurSettings).toHaveBeenCalled();

				  service.isShellAvailable=false;
				  service.getCameraBlurSettings();
				  expect(service.cameraBlur.getCameraBlurSettings).toHaveBeenCalled();

        });
        it('should call setCameraBlurSettings', () => {
          const { service } = setup();
          
            spyOn(service.cameraBlur,'setCameraBlurSettings').and.callThrough();
            service.setCameraBlurSettings();
            expect(service.cameraBlur.setCameraBlurSettings).toHaveBeenCalled();
  
            service.isShellAvailable=false;
            service.setCameraBlurSettings();
            expect(service.cameraBlur.setCameraBlurSettings).toHaveBeenCalled();
  
          });
      });
    });