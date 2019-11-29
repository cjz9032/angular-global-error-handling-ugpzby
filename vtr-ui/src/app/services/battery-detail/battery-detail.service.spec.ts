import { TestBed } from '@angular/core/testing';

import { BatteryDetailService } from './battery-detail.service';
import { HttpClientModule } from '@angular/common/http';
//import { VantageShellService } from '../vantage-shell/vantage-shell.service';

import { BatteryDetailComponent } from 'src/app/components/battery/battery-detail/battery-detail.component';
import { VantageShellService } from '../vantage-shell/vantage-shell-mock.service';


describe('Shared service:', () => {
	let shellService: VantageShellService;
	 let service: BatteryDetailService;
	 
	beforeEach(() => {
		 		TestBed.configureTestingModule({
		 			imports: [HttpClientModule],
		 			providers: [VantageShellService,BatteryDetailComponent]
		 		});
		 		service = TestBed.get(BatteryDetailService);
		 		shellService = TestBed.get(VantageShellService);
		 	});
			 describe(':', () => {

				function setup() {
				  const service = TestBed.get(BatteryDetailService);
				 // const batteryDetailComponent = TestBed.get(BatteryDetailComponent);
				  return { service };
				}
				
		
			it('should call getBatteryDetail', () => {
				const { service } = setup();
				const mockBatteryDetailData = {
					barCode: 'X2XP888JB1S',
					batteryCondition: ['Normal'],
					batteryHealth: 0,
					chargeStatus: 2,
					cycleCount: 98,
					designCapacity: 45.28,
					designVoltage: 11.1,
					deviceChemistry: 'Li-Polymer',
					firmwareVersion: '0005-0232-0100-0005',
					fruPart: '01AV446',
					fullChargeCapacity: 46.69,
					manufacturer: 'SMP',
					remainingCapacity: 23.84,
					remainingChargeCapacity: 0,
					remainingPercent: 52,
					remainingTime: 99,
					temperature: 32,
					voltage: 11.222,
					wattage: 10.57
				};
				// service.getBatteryDetail().subscribe(data => {
				// 	expect(service.getBatteryInformation).toBeUndefined();
				  //});
				  spyOn(service.battery,'getBatteryInformation').and.callThrough();
				  service.getBatteryDetail();
				  expect(service.battery.getBatteryInformation).toHaveBeenCalled();

				  service.isShellAvailable=false;
				  service.getBatteryDetail();
				  expect(service.battery.getBatteryInformation).toHaveBeenCalled();

				});



				it('should call startMonitor', () => {
					const { service } = setup();
					spyOn(service.battery,'startBatteryMonitor').and.callThrough();
				  service.startMonitor(true);
				  expect(service.battery.startBatteryMonitor).toHaveBeenCalled();

				  service.isShellAvailable=false;
				  service.startMonitor(true);
				  expect(service.battery.startBatteryMonitor).toHaveBeenCalled();
					
					});
					it('should call stopMonitor', () => {
						const { service } = setup();
						spyOn(service.battery,'stopBatteryMonitor').and.callThrough();
						service.stopMonitor();
							expect(service.battery.stopBatteryMonitor).toHaveBeenCalled();
						  
						});
			
		
		
	});

});
