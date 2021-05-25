import { TestBed } from '@angular/core/testing';

import { AudioService } from './hwsettings.service';
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

describe('DisplayService', () => {
	beforeEach(() => TestBed.configureTestingModule({
		schemas: [NO_ERRORS_SCHEMA],
		imports: [HttpClientModule],
		providers: [DisplayService, DevService, VantageShellService, CommonService, LoggerService, HttpClient]
	}));
	let displayService: DisplayService;
	let devServices: DevService;
	let loggerService: LoggerService;
	let shellService: VantageShellService;
	let commonService: CommonService;
	let http: HttpClient;
	beforeEach(() => {
		commonService = new CommonService();
		shellService = new VantageShellService(commonService, http);
		loggerService = new LoggerService(shellService);
		devServices = new DevService(loggerService);
		displayService = new DisplayService(devServices, shellService, commonService);
	});

	it('should be created', () => {
		const service: DisplayService = TestBed.inject(DisplayService);
		expect(service).toBeTruthy();
	});

	it('should start loading', () => {
		displayService.startLoading();
		expect(displayService.loading).toBe(1);
	});

	it('should stop loading', () => {
		displayService.endLoading();
		expect(displayService.loading).toBe(0);
	});

	it('should stop loading -else case', () => {
		displayService.loading = 1;
		displayService.endLoading();
		expect(displayService.loading).toBe(0);
	});

	it('should clear loading', () => {
		displayService.clearLoading();
		expect(displayService.loading).toBe(0);
	});

	it('should emit window resize', () => {
		const service = { windowWidth: '', windowHeight: '' };
		const spy = spyOn(displayService.windowResize, 'emit');
		displayService.calcSize(service);
		expect(spy).toHaveBeenCalled();
	});

	it('should dispatch new resize event', fakeAsync(() => {
		const evt = new Event('resize');
		const spy = spyOn(window, 'dispatchEvent');
		displayService.resizeWindow();
		tick(100);
		expect(spy).toHaveBeenCalledWith(evt);
	}));

	it('should listen to window resizing', () => {
		displayService.windowResizeListener();
		expect(displayService.windowResize).toBeTruthy();
	});

	it('should get EyeCareMode State', () => {
		displayService.displayEyeCareMode = {
			getEyeCareModeState() {
				return;
			}
		};
		const spy = spyOn(displayService.displayEyeCareMode, 'getEyeCareModeState');
		displayService.getEyeCareModeState();
		expect(spy).toHaveBeenCalled();
	});

	it('should get EyeCareMode State - else', () => {
		displayService.displayEyeCareMode = undefined;
		const res = displayService.getEyeCareModeState();
		expect(res).toBeUndefined();
	});

	it('should get eyeCareMode Status', async () => {
		let status = false;
		let available = false;
		await displayService.getEyeCareAutoMode().then((item: any) => {
			status = item.status;
			available = item.available;
		});
		expect(status).toBeTruthy();
		expect(available).toBeTruthy();
	});

	it('should get Camera Privacy mode state', async () => {
		let status = false;
		let available = false;
		await displayService.getCameraPrivacyModeState().then((item: any) => {
			status = item.status;
			available = item.available;
		});
		expect(status).toBeTruthy();
		expect(available).toBeTruthy();

	});

	it('should get Camera Privacy mode status else case', () => {
		displayService.cameraPrivacyStatus = undefined;
		displayService.getCameraPrivacyModeState();
		const spy = spyOn(shellService, 'getCameraPrivacy');
		expect(spy).not.toHaveBeenCalled();
	});

	it('should start Camera privacy monitor', async () => {
		let monitor = false;
		await displayService
			.startCameraPrivacyMonitor(() => { })
			.then((flag: any) => {
				monitor = flag; // expecting a FeatureStatus, mocked with a boolean
			});
		expect(monitor).toBeTruthy();
	});

	it('should start Camera privacy monitor - else', () => {
		const callback = () => {
			return;
		};
		displayService.cameraPrivacyStatus = undefined;
		const res = displayService.startCameraPrivacyMonitor(callback);
		expect(res).toBeUndefined();
		expect(displayService.startCameraPrivacyMonitor).toThrow();

	});

	it('should stop Camera privacy monitor', async () => {
		let monitor = false;
		await displayService
			.stopCameraPrivacyMonitor()
			.then((flag: any) => {
				monitor = flag; // expecting a FeatureStatus, mocked with a boolean
			});
		expect(monitor).toBeTruthy();
		expect(displayService.stopCameraPrivacyMonitor).toThrow();
	});

	it('should stop Camera privacy monitor -else case', () => {
		displayService.cameraPrivacyStatus = undefined;
		displayService.stopCameraPrivacyMonitor();
		const spy = spyOn(shellService, 'getCameraPrivacy');
		expect(spy).not.toHaveBeenCalled();
	});

	it('should set eyeCareMode State', async () => {
		let status = false;
		await displayService.setEyeCareModeState(true)
			.then((flag: boolean) => {
				status = flag;
			});
		expect(status).toBeTruthy();
		expect(displayService.setEyeCareModeState).toThrow();
	});

	it('should set eyeCareMode State - else', () => {
		const value = true;
		displayService.displayEyeCareMode = undefined;
		const res = displayService.setEyeCareModeState(value);
		expect(res).toBeUndefined();
		expect(displayService.setEyeCareModeState).toThrow();

	});

	it('should set Camera Privacy mode', async () => {
		let monitor = false;
		await displayService
			.setCameraPrivacyModeState(true)
			.then((flag: any) => {
				monitor = flag; // expecting a FeatureStatus, mocked with a boolean
			});
		expect(monitor).toBeTruthy();
	});

	it('should set Camera Privacy mode - else', () => {
		const value = true;
		displayService.cameraPrivacyStatus = undefined;
		const res = displayService.setCameraPrivacyModeState(value);
		expect(res).toBeUndefined();
		expect(displayService.setCameraPrivacyModeState).toThrow();

	});

	it('should get camera settings', async () => {
		let status = false;
		await displayService.getCameraSettingsInfo()
			.then((flag) => {
				status = flag;
			});
		expect(status).toBeTruthy();
	});

	it('should get camera settings - else', () => {
		displayService.cameraSettings = undefined;
		const res = displayService.getCameraSettingsInfo();
		expect(res).toBeUndefined();
		expect(displayService.getCameraSettingsInfo).toThrow();

	});

	it('should set Camera Brightness', async () => {
		let status = false;
		const brightness = 10;
		await displayService.setCameraBrightness(brightness)
			.then((flag) => {
				status = flag;
			});
		expect(status).toBeTruthy();

		(displayService as any).cameraSettings = false;
		const returnValue = await displayService.setCameraBrightness(brightness);
		expect(returnValue).toBe(undefined);
	});

	it('should set Camera Contrast', async () => {
		let status = false;
		const contrast = 7;
		await displayService.setCameraContrast(contrast)
			.then((flag) => {
				status = flag;
			});
		expect(status).toBeTruthy();

		(displayService as any).cameraSettings = false;
		const returnValue = await displayService.setCameraContrast(contrast);
		expect(returnValue).toBe(undefined);
	});

	it('should set Camera Auto Exposure', async () => {
		let status = false;
		const exposure = true;
		await displayService.setCameraAutoExposure(exposure)
			.then((flag) => {
				status = flag;
			});
		expect(status).toBeTruthy();

		(displayService as any).cameraSettings = false;
		const returnValue = await displayService.setCameraAutoExposure(exposure);
		expect(returnValue).toBe(undefined);
	});

	it('should set Camera Exposure', async () => {
		let status = false;
		const exposure = 6;
		await displayService.setCameraExposureValue(exposure)
			.then((flag) => {
				status = flag;
			});
		expect(status).toBeTruthy();

		(displayService as any).cameraSettings = false;
		const returnValue = await displayService.setCameraExposureValue(exposure);
		expect(returnValue).toBe(undefined);
	});

	it('should set Camera autofocus', async () => {
		let status = false;
		const focus = 6;
		await displayService.setCameraAutoFocus(focus)
			.then((flag) => {
				status = flag;
			});
		expect(status).toBeTruthy();

		(displayService as any).cameraSettings = false;
		const returnValue = await displayService.setCameraAutoFocus(focus);
		expect(returnValue).toBe(undefined);
	});

	it('should set Camera reset', async () => {
		let status = false;
		await displayService.resetCameraSettings()
			.then((flag) => {
				status = flag;
			});
		expect(status).toBeTruthy();

		(displayService as any).cameraSettings = false;
		const returnValue = await displayService.resetCameraSettings();
		expect(returnValue).toBe(undefined);
	});

	it('should get Display Color Temp', async () => {
		let status = false;
		await displayService.getDisplayColorTemperature()
			.then((res) => {
				status = res.available;
			});
		expect(status).toBeTruthy();

		(displayService as any).displayEyeCareMode = false;
		const returnValue = await displayService.getDisplayColorTemperature();
		expect(returnValue).toBe(undefined);
	});

	it('should set Display Color Temp', async () => {
		let status = false;
		const value = 10;
		await displayService.setDisplayColorTemperature(value)
			.then((flag) => {
				status = flag;
			});
		expect(status).toBeTruthy();

		(displayService as any).displayEyeCareMode = false;
		const returnValue = await displayService.setDisplayColorTemperature(value);
		expect(returnValue).toBe(undefined);
	});

	it('should reset EyeCare mode', async () => {
		let status = false;
		await displayService.resetEyeCareMode()
			.then((flag) => {
				status = flag;
			});
		expect(status).toBeTruthy();

		(displayService as any).displayEyeCareMode = false;
		const returnValue = await displayService.resetEyeCareMode();
		expect(returnValue).toBe(undefined);
	});

	it('should set Auto EyeCare mode', async () => {
		let status = false;
		const value = true;
		await displayService.setEyeCareAutoMode(value)
			.then((flag) => {
				status = flag;
			});
		expect(status).toBeTruthy();

		(displayService as any).displayEyeCareMode = false;
		const returnValue = await displayService.setEyeCareAutoMode(value);
		expect(returnValue).toBe(undefined);
	});

	it('should get Auto EyeCare mode', async () => {
		let status = false;
		await displayService.getEyeCareAutoMode()
			.then((res) => {
				status = res.available;
			});
		expect(status).toBeTruthy();

		(displayService as any).displayEyeCareMode = false;
		const returnValue = await displayService.getEyeCareAutoMode();
		expect(returnValue).toBe(undefined);
	});

	it('should get Daytime Color Temp', async () => {
		let status = false;
		await displayService.getDaytimeColorTemperature()
			.then((res) => {
				status = res.available;
			});
		expect(status).toBeTruthy();

		(displayService as any).displayEyeCareMode = false;
		const returnValue = await displayService.getDaytimeColorTemperature();
		expect(returnValue).toBe(undefined);
	});

	it('should set Daytime Color Temp', async () => {
		let status = false;
		const value = 19;
		await displayService.setDaytimeColorTemperature(value)
			.then((flag) => {
				status = flag;
			});
		expect(status).toBeTruthy();

		(displayService as any).displayEyeCareMode = false;
		const returnValue = await displayService.setDaytimeColorTemperature(value);
		expect(returnValue).toBe(undefined);
	});

	it('should reset Daytime Color Temp', async () => {
		let status = false;
		await displayService.resetDaytimeColorTemperature()
			.then((flag) => {
				status = flag;
			});
		expect(status).toBeTruthy();

		(displayService as any).displayEyeCareMode = false;
		const returnValue = await displayService.resetDaytimeColorTemperature();
		expect(returnValue).toBe(undefined);
	});

	it('should get Privacy Guard Capability', async () => {
		let status = false;
		await displayService.getPrivacyGuardCapability()
			.then(res => {
				status = res;
			});
		expect(status).toBeTruthy();

		(displayService as any).privacyGuardSettings = false;
		const returnValue = await displayService.getPrivacyGuardCapability();
		expect(returnValue).toBe(undefined);
	});

	it('should get Privacy Guard Password Capability', async () => {
		let status = false;
		await displayService.getPrivacyGuardOnPasswordCapability()
			.then(res => {
				status = res;
			});
		expect(status).toBeTruthy();

		(displayService as any).privacyGuardSettings = false;
		const returnValue = await displayService.getPrivacyGuardOnPasswordCapability();
		expect(returnValue).toBe(undefined);
	});

	it('should get Privacy Guard status', async () => {
		let status = false;
		await displayService.getPrivacyGuardStatus()
			.then(res => {
				status = res;
			});
		expect(status).toBeTruthy();

		(displayService as any).privacyGuardSettings = false;
		const returnValue = await displayService.getPrivacyGuardStatus();
		expect(returnValue).toBe(undefined);
	});

	it('should get Privacy Password Guard status', async () => {
		let status = false;
		await displayService.getPrivacyGuardOnPasswordStatus()
			.then(res => {
				status = res;
			});
		expect(status).toBeTruthy();

		(displayService as any).privacyGuardSettings = false;
		const returnValue = await displayService.getPrivacyGuardOnPasswordStatus();
		expect(returnValue).toBe(undefined);
	});

	it('should set Privacy Guard status', async () => {
		let status = false;
		const value = true;
		await displayService.setPrivacyGuardStatus(value)
			.then(res => {
				status = res;
			});
		expect(status).toBeTruthy();

		(displayService as any).privacyGuardSettings = false;
		const returnValue = await displayService.setPrivacyGuardStatus(value);
		expect(returnValue).toBe(undefined);
	});

	it('should set Privacy Guard password status', async () => {
		let status = false;
		const value = true;
		await displayService.setPrivacyGuardOnPasswordStatus(value)
			.then(res => {
				status = res;
			});
		expect(status).toBeTruthy();

		(displayService as any).privacyGuardSettings = false;
		const returnValue = await displayService.setPrivacyGuardOnPasswordStatus(value);
		expect(returnValue).toBe(undefined);
	});

	it('should get status changed location permission', () => {
		const handler = () => {
			return;
		};
		displayService.isShellAvailable = true;
		const spy = spyOn(displayService.displayEyeCareMode, 'statusChangedLocationPermission');
		displayService.statusChangedLocationPermission(handler);
		expect(spy).toHaveBeenCalled();
		expect(displayService.statusChangedLocationPermission).toThrow();
	});

	it('should get status changed location permission', () => {
		const handler = () => {
			return;
		};
		displayService.isShellAvailable = false;
		const res = displayService.statusChangedLocationPermission(handler);
		expect(res).toBeUndefined();
	});

	it('should start eye care monitor', async () => {
		let status = false;
		await displayService
			.startEyeCareMonitor(() => { })
			.then(flag => {
				status = flag;
			});
		expect(status).toBeTruthy();


		(displayService as any).isShellAvailable = false;
		const returnValue = displayService.startEyeCareMonitor(() => { });
		expect(returnValue).toBe(undefined);


		expect(displayService.startEyeCareMonitor).toThrow();
	});

	it('should start camera permission monitor', async () => {
		let status = false;
		await displayService
			.startMonitorForCameraPermission()
			.then(flag => {
				status = flag;
			});
		expect(status).toBeTruthy();

		(displayService as any).cameraSettings = {
			startMonitor() {
				return Promise.resolve({ permission: true });
			}
		};
		/* const spySN = spyOn(commonService, 'sendNotification');
		const returnValue = displayService.startMonitorForCameraPermission();
		expect(spySN).toHaveBeenCalled(); */

		// expect(returnValue).toBe(undefined);

		expect(displayService.startMonitorForCameraPermission).toThrow();
	});

	it('should start camera permission monitor - else', () => {
		displayService.isShellAvailable = false;
		const res = displayService.startMonitorForCameraPermission();
		expect(res).toBeUndefined();
		expect(displayService.startMonitorForCameraPermission).toThrow();
	});


	it('should stop camera permission monitor', async () => {
		let status = false;
		await displayService
			.stopMonitorForCameraPermission()
			.then(flag => {
				status = flag;
			});
		expect(status).toBeTruthy();

	});

	it('should stop camera permission monitor', () => {
		displayService.isShellAvailable = false;
		const res = displayService.stopMonitorForCameraPermission();
		expect(res).toBeUndefined();
		expect(displayService.stopMonitorForCameraPermission).toThrow();
	});

	it('should stop eyecare monitor', async () => {
		let status = false;
		await displayService
			.stopEyeCareMonitor()
			.then(flag => {
				status = flag;
			});
		expect(status).toBeTruthy();
	});

	it('should stop eyecare monitor', () => {
		displayService.isShellAvailable = false;
		const res = displayService.stopEyeCareMonitor();
		expect(res).toBeUndefined();
		expect(displayService.stopEyeCareMonitor).toThrow();
	});

	it('should open Privacy Location', () => {
		displayService.isShellAvailable = true;
		displayService.displayEyeCareMode = {
			openPrivacyLocation() {
				return;
			}
		};
		const spy = spyOn(displayService.displayEyeCareMode, 'openPrivacyLocation');
		displayService.openPrivacyLocation();
		expect(spy).toHaveBeenCalled();
	});

	it('should open Privacy Location -else', () => {
		displayService.isShellAvailable = false;
		const res = displayService.openPrivacyLocation();
		expect(res).toBeUndefined();
	});

	it('should init eyecare mode', async () => {
		let status = false;
		await displayService.initEyecaremodeSettings()
			.then(flag => {
				status = flag;
			});
		expect(status).toBeTruthy();
	});

	it('should init eyecare mode -else', () => {
		displayService.displayEyeCareMode = false;
		const res = displayService.initEyecaremodeSettings();
		expect(res).toBeUndefined();
	});

	it('should get OLED Capabiliity', async () => {
		let status = false;
		await displayService.getOLEDPowerControlCapability()
			.then(flag => {
				status = flag;
			});
		expect(status).toBeTruthy();
	});

	it('should get OLED Capabiliity -else', () => {
		displayService.oledSettings = false;
		const res = displayService.getOLEDPowerControlCapability();
		expect(res).toBeUndefined();
	});

	it('should get taskdimmer settings', async () => {
		let status = false;
		await displayService.getTaskbarDimmerSetting()
			.then(flag => {
				status = flag;
			});
		expect(status).toBeTruthy();
	});

	it('should get taskdimmer setting -else', () => {
		displayService.oledSettings = false;
		const res = displayService.getTaskbarDimmerSetting();
		expect(res).toBeUndefined();
	});

	it('should get backgronddimmer settings', async () => {
		let status = false;
		await displayService.getBackgroundDimmerSetting()
			.then(flag => {
				status = flag;
			});
		expect(status).toBeTruthy();
	});

	it('should get backgronddimmer setting -else', () => {
		displayService.oledSettings = false;
		const res = displayService.getBackgroundDimmerSetting();
		expect(res).toBeUndefined();
	});

	it('should get display dimmer settings', async () => {
		let status = false;
		await displayService.getDisplayDimmerSetting()
			.then(flag => {
				status = flag;
			});
		expect(status).toBeTruthy();
	});

	it('should get display dimmer setting -else', () => {
		displayService.oledSettings = false;
		const res = displayService.getDisplayDimmerSetting();
		expect(res).toBeUndefined();
	});

	it('should set taskbar dimmer settings', async () => {
		let status = false;
		const value = '10';
		await displayService.setTaskbarDimmerSetting(value)
			.then(flag => {
				status = flag;
			});
		expect(status).toBeTruthy();
	});

	it('should set taskbar dimmer setting -else', () => {
		displayService.oledSettings = false;
		const value = 'abc';
		const res = displayService.setTaskbarDimmerSetting(value);
		expect(res).toBeUndefined();
	});

	it('should set background dimmer settings', async () => {
		let status = false;
		const value = '10';
		await displayService.setBackgroundDimmerSetting(value)
			.then(flag => {
				status = flag;
			});
		expect(status).toBeTruthy();
	});

	it('should set background dimmer setting -else', () => {
		displayService.oledSettings = false;
		const value = 'abc';
		const res = displayService.setBackgroundDimmerSetting(value);
		expect(res).toBeUndefined();
	});

	it('should set display dimmer settings', async () => {
		let status = false;
		const value = '10';
		await displayService.setDisplayDimmerSetting(value)
			.then(flag => {
				status = flag;
			});
		expect(status).toBeTruthy();
	});

	it('should set display dimmer setting -else', () => {
		displayService.oledSettings = false;
		const value = 'abc';
		const res = displayService.setDisplayDimmerSetting(value);
		expect(res).toBeUndefined();
	});

	it('should reset Eye care mode all settings', () => {
		displayService.displayEyeCareMode = {
			resetEyecaremodeAllSettings() {
				return;
			}
		};
		const spy = spyOn(displayService.displayEyeCareMode, 'resetEyecaremodeAllSettings');
		displayService.resetEyecaremodeAllSettings();
		expect(spy).toHaveBeenCalled();
	});

	it('should be able to get whiteList', () => {
		displayService.displayEyeCareMode = {
			getWhiteListCapability() {
				return;
			}
		};
		const spy = spyOn(displayService.displayEyeCareMode, 'getWhiteListCapability');
		displayService.getWhiteListCapability();
		expect(spy).toHaveBeenCalled();
	});

	it('should be able to get getPriorityControlCapability', () => {
		const priorityControl = {
			GetCapability() {
				return;
			}
		};
		(displayService as any).priorityControl = priorityControl;
		const spy = spyOn(priorityControl, 'GetCapability');
		displayService.getPriorityControlCapability();
		expect(spy).toHaveBeenCalled();

		(displayService as any).priorityControl = false;
		const returnValue = displayService.getPriorityControlCapability();
		expect(returnValue).toBe(undefined);
	});

	it('should be able to get getPriorityControlSetting', () => {
		const priorityControl = {
			GetPriorityControlSetting() {
				return;
			}
		};
		(displayService as any).priorityControl = priorityControl;
		const spy = spyOn(priorityControl, 'GetPriorityControlSetting');
		displayService.getPriorityControlSetting();
		expect(spy).toHaveBeenCalled();

		(displayService as any).priorityControl = false;
		const returnValue = displayService.getPriorityControlSetting();
		expect(returnValue).toBe(undefined);
	});

	it('should be able to get getPriorityControlCapability', () => {
		const priorityControl = {
			SetPriorityControlSetting(value: string) {
				return;
			}
		};
		(displayService as any).priorityControl = priorityControl;
		const spy = spyOn(priorityControl, 'SetPriorityControlSetting');
		displayService.setPriorityControlSetting('test');
		expect(spy).toHaveBeenCalled();

		(displayService as any).priorityControl = false;
		const returnValue = displayService.setPriorityControlSetting('test');
		expect(returnValue).toBe(undefined);
	});

});


	