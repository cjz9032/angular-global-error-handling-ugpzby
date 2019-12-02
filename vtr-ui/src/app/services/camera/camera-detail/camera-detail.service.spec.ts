import { TestBed } from '@angular/core/testing';

import { CameraDetailService } from './camera-detail.service';
import { VantageShellService } from '../../vantage-shell/vantage-shell-mock.service';
import { HttpClientModule } from '@angular/common/http';

describe('Shared service:', () => {
	
	 let service: CameraDetailService;
	 
	beforeEach(() => {
		 		TestBed.configureTestingModule({
		 			imports: [HttpClientModule],
		 			
		 		});
		 		service = TestBed.get(CameraDetailService);
		 		
		 	});
			 describe(':', () => {

				function setup() {
				  const service = TestBed.get(CameraDetailService);
				 // const batteryDetailComponent = TestBed.get(BatteryDetailComponent);
				  return { service };
        }
             
			it('should call getCameraDetail', () => {
				const { service } = setup();
				
				  spyOn(service,'getCameraDetail').and.callThrough();
				  service.getCameraDetail();
				  expect(service.getCameraDetail).toHaveBeenCalled();
		 				  

		});
		
		it('should call toggleAutoExposure', () => {
			const { service } = setup();
			
			  spyOn(service,'toggleAutoExposure').and.callThrough();
			  service.toggleAutoExposure();
			  expect(service.toggleAutoExposure).toHaveBeenCalled();
					   

	});

	it('should call toggleCameraPrivacyMode', () => {
		const { service } = setup();
		
		  spyOn(service,'toggleCameraPrivacyMode').and.callThrough();
		  service.toggleCameraPrivacyMode();
		  expect(service.toggleCameraPrivacyMode).toHaveBeenCalled();
				   

});
    
      });
    });
