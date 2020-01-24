import { TestBed } from '@angular/core/testing';

import { AudioService } from './audio.service';
import { VantageShellService } from '../vantage-shell/vantage-shell-mock.service';
import { HttpClientModule } from '@angular/common/http';

describe('AudioService', () => {
  describe('AudioService:', () => {
    let shellService: VantageShellService;
     let service: AudioService;
     
    beforeEach(() => {
           TestBed.configureTestingModule({
             imports: [HttpClientModule],
             providers: [VantageShellService]
           });
           service = TestBed.get(AudioService);
           shellService = TestBed.get(VantageShellService);
         });
         describe(':', () => {
  
          function setup() {
            const service = TestBed.get(AudioService);
           // const batteryDetailComponent = TestBed.get(BatteryDetailComponent);
            return { service };
          }

          
			// it('should call getMicrophoneSettings', () => {
			// 	const { service } = setup();
				
			// 	  spyOn(service.microphone,'getMicrophoneSettings').and.callThrough();
			// 	  service.getMicrophoneSettings();
			// 	  expect(service.microphone.getMicrophoneSettings).toHaveBeenCalled();

			// 	  service.isShellAvailable=false;
			// 	  service.getMicrophoneSettings();
			// 	  expect(service.microphone.getMicrophoneSettings).toHaveBeenCalled();

      //   });

        // it('should call getSupportedModes', () => {
        //   const { service } = setup();
          
        //     spyOn(service.microphone,'getSupportedModes').and.callThrough();
        //     service.getSupportedModes();
        //     expect(service.microphone.getSupportedModes).toHaveBeenCalled();
  
        //     service.isShellAvailable=false;
        //     service.getSupportedModes();
        //     expect(service.microphone.getSupportedModes).toHaveBeenCalled();
  
        //   });
        
        it('should call getDolbyMode', () => {
          const { service } = setup();
          
            spyOn(service.dolby,'getDolbyMode').and.callThrough();
            service.getDolbyMode();
            expect(service.dolby.getDolbyMode).toHaveBeenCalled();
  
            service.isShellAvailable=false;
            service.getDolbyMode();
            expect(service.dolby.getDolbyMode).toHaveBeenCalled();
  
          });

          it('should call setMicrophoneVolume', () => {
            const { service } = setup();
            spyOn(service.microphone,'setMicrophoneVolume').and.callThrough();
            service.setMicrophoneVolume(true);
            expect(service.microphone.setMicrophoneVolume).toHaveBeenCalled();
  
            service.isShellAvailable=false;
            service.setMicrophoneVolume(true);
            expect(service.microphone.setMicrophoneVolume).toHaveBeenCalled();
            
            });

            it('should call getDolbyFeatureStatus', () => {
              const { service } = setup();
              spyOn(service.smartSettings.absFeature,'getDolbyFeatureStatus').and.callThrough();
              service.getDolbyFeatureStatus(true);
              expect(service.smartSettings.absFeature.getDolbyFeatureStatus).toHaveBeenCalled();
    
              service.isShellAvailable=false;
              service.getDolbyFeatureStatus(true);
              expect(service.smartSettings.absFeature.getDolbyFeatureStatus).toHaveBeenCalled();
              
              });

              it('should call setMicophoneOnMute', () => {
                const { service } = setup();
                spyOn(service.microphone,'setMicophoneMute').and.callThrough();
                service.setMicophoneOnMute(true);
                expect(service.microphone.setMicophoneMute).toHaveBeenCalled();
      
                service.isShellAvailable=false;
                service.setMicophoneOnMute(true);
                expect(service.microphone.setMicophoneMute).toHaveBeenCalled();
                
                });

                it('should call setDolbyOnOff', () => {
                  const { service } = setup();
                  spyOn(service.smartSettings.absFeature,'setDolbyFeatureStatus').and.callThrough();
                  service.setDolbyOnOff(true);
                  expect(service.smartSettings.absFeature.setDolbyFeatureStatus).toHaveBeenCalled();
        
                  service.isShellAvailable=false;
                  service.setDolbyOnOff(true);
                  expect(service.smartSettings.absFeature.setDolbyFeatureStatus).toHaveBeenCalled();
                  
                  });

                  it('should call setMicrophoneAutoOptimization', () => {
                    const { service } = setup();
                    spyOn(service.microphone,'setMicrophoneAutoOptimization').and.callThrough();
                    service.setMicrophoneAutoOptimization(true);
                    expect(service.microphone.setMicrophoneAutoOptimization).toHaveBeenCalled();
          
                    service.isShellAvailable=false;
                    service.setMicrophoneAutoOptimization(true);
                    expect(service.microphone.setMicrophoneAutoOptimization).toHaveBeenCalled();
                    
                    });

                    it('should call setSuppressKeyboardNoise', () => {
                      const { service } = setup();
                      spyOn(service.microphone,'setMicrophoneKeyboardNoiseSuppression').and.callThrough();
                      service.setSuppressKeyboardNoise(true);
                      expect(service.microphone.setMicrophoneKeyboardNoiseSuppression).toHaveBeenCalled();
            
                      service.isShellAvailable=false;
                      service.setSuppressKeyboardNoise(true);
                      expect(service.microphone.setMicrophoneKeyboardNoiseSuppression).toHaveBeenCalled();
                      
                      });
  
                      
                    it('should call setMicrophoneAEC', () => {
                      const { service } = setup();
                      spyOn(service.microphone,'setMicrophoneAEC').and.callThrough();
                      service.setMicrophoneAEC(true);
                      expect(service.microphone.setMicrophoneAEC).toHaveBeenCalled();
            
                      service.isShellAvailable=false;
                      service.setMicrophoneAEC(true);
                      expect(service.microphone.setMicrophoneAEC).toHaveBeenCalled();
                      
                      });

                      it('should call setDolbyMode', () => {
                        const { service } = setup();
                        spyOn(service.dolby,'setDolbyMode').and.callThrough();
                        service.setDolbyMode(true);
                        expect(service.dolby.setDolbyMode).toHaveBeenCalled();
              
                        service.isShellAvailable=false;
                        service.setDolbyMode(true);
                        expect(service.dolby.setDolbyMode).toHaveBeenCalled();
                        
                        });


                        it('should call setMicrophoneOpitimaztion', () => {
                          const { service } = setup();
                          spyOn(service.microphone,'setMicrophoneOpitimaztion').and.callThrough();
                          service.setMicrophoneOpitimaztion(true);
                          expect(service.microphone.setMicrophoneOpitimaztion).toHaveBeenCalled();
                
                          service.isShellAvailable=false;
                          service.setMicrophoneOpitimaztion(true);
                          expect(service.microphone.setMicrophoneOpitimaztion).toHaveBeenCalled();
                          
                          });

                          it('should call startMicrophoneMonitor', () => {
                            const { service } = setup();
                            spyOn(service.microphone,'startMonitor').and.callThrough();
                            service.startMicrophoneMonitor(true);
                            expect(service.microphone.startMonitor).toHaveBeenCalled();
                  
                            service.isShellAvailable=false;
                            service.startMicrophoneMonitor(true);
                            expect(service.microphone.startMonitor).toHaveBeenCalled();
                            
                            });

                            it('should call stopMicrophoneMonitor', () => {
                              const { service } = setup();
                              spyOn(service.microphone,'stopMonitor').and.callThrough();
                              service.stopMicrophoneMonitor(true);
                              expect(service.microphone.stopMonitor).toHaveBeenCalled();
                    
                              service.isShellAvailable=false;
                              service.stopMicrophoneMonitor(true);
                              expect(service.microphone.stopMonitor).toHaveBeenCalled();
                              
                              });

                              it('should call stopMonitorForDolby', () => {
                                const { service } = setup();
                                spyOn(service.dolby,'stopMonitor').and.callThrough();
                                service.stopMonitorForDolby(true);
                                expect(service.dolby.stopMonitor).toHaveBeenCalled();
                      
                                service.isShellAvailable=false;
                                service.stopMonitorForDolby(true);
                                expect(service.dolby.stopMonitor).toHaveBeenCalled();
                                
                                });
                                it('should call startMonitorForDolby', () => {
                                  const { service } = setup();
                                  spyOn(service.dolby,'startMonitor').and.callThrough();
                                  service.startMonitorForDolby(true);
                                  expect(service.dolby.startMonitor).toHaveBeenCalled();
                        
                                  service.isShellAvailable=false;
                                  service.startMonitorForDolby(true);
                                  expect(service.dolby.startMonitor).toHaveBeenCalled();
                                  
                                  });
                        

        });
        
  });
});



	