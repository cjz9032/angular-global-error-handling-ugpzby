import { async, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA,Pipe} from '@angular/core';
import { TranslateStore } from '@ngx-translate/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { SubpageDeviceSettingsPowerComponent } from './subpage-device-settings-power.component';
import { PowerService } from 'src/app/services/power/power.service';
import { CommonService } from 'src/app/services/common/common.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { MetricService } from '../../../../../services/metric/metric.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
const featureStatus={
	'available':true,
	'status':true,
	'permission':true,
	'isLoading':true
} 

describe('SubpageDeviceSettingsPowerComponent', () => {
    let powerService: PowerService;
	let commonService: CommonService;
	let	 logger: LoggerService;
	let modalService: NgbModal;
	let shellServices: VantageShellService;
	let metrics: MetricService;
	let debugElement;
	let mode='expressCharging';
	let batteryNum=1,inputString='changedValues';
	const batteryDetails={
		'checkBoxValue':'5',
		'startValue':'3',
		'stopValue':'2'
	}
	const machineType=1;
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SubpageDeviceSettingsPowerComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslationModule, HttpClientModule, RouterTestingModule],
			providers: [TranslateStore]
		})
			.compileComponents();
	}));
	describe(':', () => {
		function setup() {
			const fixture = TestBed.createComponent(SubpageDeviceSettingsPowerComponent);
			const component = fixture.componentInstance;
			commonService = fixture.debugElement.injector.get(CommonService);
			powerService = fixture.debugElement.injector.get(PowerService);
			logger = fixture.debugElement.injector.get(LoggerService);
			modalService= fixture.debugElement.injector.get(NgbModal);
			return { fixture, component, commonService, logger, modalService,powerService };
		}

	it('should create', () => {
		const { component } = setup();
		expect(component).toBeTruthy();
	});
	it('#startMonitor should call', () => {
		const { fixture, component,powerService } = setup();
		spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
		fixture.detectChanges();
		component.startMonitor();
		expect(powerService.startMonitor).toHaveBeenCalled();

	});
	it('#getStartMonitorCallBack should call', () => {
		const { fixture, component,powerService } = setup();
		spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
		fixture.detectChanges();
		component.getStartMonitorCallBack(featureStatus);
	});
	it('#onVantageToolBarStatusToggle should call', () => {
		const { fixture, component,powerService } = setup();
		spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
		spyOn(powerService, 'setVantageToolBarStatus').and.returnValue(Promise.resolve(true));
		fixture.detectChanges();
		component.onVantageToolBarStatusToggle(new Event('click'));
		expect(powerService.setVantageToolBarStatus).toHaveBeenCalled();
	});
	it('#onAirplaneAutoModeStatusChange should call', () => {
		const { fixture, component,powerService } = setup();
		spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
		fixture.detectChanges();
		component.onAirplaneAutoModeStatusChange();
	});
	it('#checkPowerDriverMissing should call', () => {
		const { fixture, component,powerService } = setup();
		spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
		fixture.detectChanges();
		component.checkPowerDriverMissing(true);
	});
	it('#showBatteryThresholdsettings should call', () => {
		const { fixture, component,powerService } = setup();
		spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
		fixture.detectChanges();
		component.showBatteryThresholdsettings(new Event('click'));
	});
	
	it('#getGaugeResetCapability should call', () => {
		const { fixture, component,powerService } = setup();
		spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
		spyOn(powerService, 'getGaugeResetCapability').and.returnValue(Promise.resolve(true));
		fixture.detectChanges();
		component.getGaugeResetCapability();
		expect(powerService.getGaugeResetCapability).toHaveBeenCalled();

	});
	it('#hidePowerSmartSetting should call', () => {
		const { fixture, component } = setup();
		spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
		fixture.detectChanges();
		component.hidePowerSmartSetting(true);
	});
	it('#setChargeThresholdValues should call', () => {
		const { fixture, component ,powerService,commonService} = setup();
		spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
		spyOn(commonService, 'sendNotification').and.returnValue();
		fixture.detectChanges();
		component.setChargeThresholdValues(batteryDetails, batteryNum, inputString);
		expect(commonService.sendNotification).toHaveBeenCalled();


	});
	it('#changeBatteryMode should call', async() => {
		const { fixture, component,powerService } = setup();
		const myPrivateSpy = spyOn<any>(component, 'setConservationModeStatusIdeaNoteBook').and.callThrough();
		const myPrivateSpyObj = spyOn<any>(component, 'setRapidChargeModeStatusIdeaNoteBook').and.callThrough();
		spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
		fixture.detectChanges();
		await component.changeBatteryMode(new Event('click'),mode);
		component.conservationModeStatus.status=true;
		component.changeBatteryMode(new Event('click'),mode);
		expect(myPrivateSpy).toHaveBeenCalled();

	});
	it('#onUsbChargingStatusChange should call', async() => {
		const { fixture, component,powerService } = setup();
		spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
		spyOn(component,'updatePowerMode')
		fixture.detectChanges();
		await component.onUsbChargingStatusChange();
		expect(component.updatePowerMode).toHaveBeenCalled();
	});

	it('#getBatteryAndPowerSettings should call', async() => {
		const { fixture, component,powerService } = setup();
		spyOn(component,'getBatteryAndPowerSettings')
		spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
		const myPrivateSpy = spyOn<any>(component, 'getEasyResumeCapabilityThinkPad').and.callThrough();
		fixture.detectChanges();
		await component.getBatteryAndPowerSettings(machineType);
		expect(component.getBatteryAndPowerSettings).toHaveBeenCalled();
		myPrivateSpy.call(component);
	});
	it('#getAirplaneModeThinkPad should call', async() => {
		const { fixture, component,powerService } = setup();
		spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
		spyOn(powerService, 'getAirplaneModeThinkPad').and.returnValue(Promise.resolve(true));
		const myPrivateSpy = spyOn<any>(component, 'getAirplaneModeThinkPad').and.callThrough();
		fixture.detectChanges();
		myPrivateSpy.call(component);
		expect(powerService.getAirplaneModeThinkPad).toHaveBeenCalled();

	});
	it('#updatePowerMode should call', async() => {
		const { fixture, component,powerService } = setup();
		spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
		const myPrivateSpy = spyOn<any>(component, 'setAlwaysOnUSBStatusThinkPad').and.callThrough();
		fixture.detectChanges();
		myPrivateSpy.call(component);
		component.machineType=1;
		component.updatePowerMode();
		expect(myPrivateSpy).toHaveBeenCalled();
	});
	it('#getAlwaysOnUSBCapabilityThinkPad should call', async() => {
		const { fixture, component,powerService } = setup();
		spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
		spyOn(powerService, 'getAlwaysOnUSBCapabilityThinkPad').and.returnValue(Promise.resolve(true));
		const myPrivateSpy = spyOn<any>(component, 'getAlwaysOnUSBCapabilityThinkPad').and.callThrough();
		fixture.detectChanges();
		myPrivateSpy.call(component);
		expect(powerService.getAlwaysOnUSBCapabilityThinkPad).toHaveBeenCalled();

	});
	it('#setEasyResumeThinkPad should call', async() => {
		const { fixture, component,powerService } = setup();
		spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
		const myPrivateSpy = spyOn<any>(component, 'setEasyResumeThinkPad').and.callThrough();
		fixture.detectChanges();
		myPrivateSpy.call(component);
	});
	it('#getBatteryStatusEvent should call', async() => {
		const { fixture, component,powerService } = setup();
		spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
		const myPrivateSpy = spyOn<any>(component, 'getBatteryStatusEvent').and.callThrough();
		fixture.detectChanges();
		myPrivateSpy.call(component);
		await component.getBatteryThresholdInformation();
	});
	it('#setAlwaysOnUSBStatusThinkPad should call', async() => {
		const { fixture, component,powerService } = setup();
		spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
		spyOn(powerService, 'setAlwaysOnUSBStatusThinkPad').and.returnValue(Promise.resolve(true));
		const myPrivateSpy = spyOn<any>(component, 'setAlwaysOnUSBStatusThinkPad').and.callThrough();
		fixture.detectChanges();
		myPrivateSpy.call(component);
		expect(powerService.setAlwaysOnUSBStatusThinkPad).toHaveBeenCalled();
	});
	it('#getAirplaneModeCapabilityThinkPad should call', async() => {
		const { fixture, component,powerService } = setup();
		spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
		spyOn(powerService, 'getAirplaneModeCapabilityThinkPad').and.returnValue(Promise.resolve(true));
		const myPrivateSpy = spyOn<any>(component, 'getAirplaneModeCapabilityThinkPad').and.callThrough();
		fixture.detectChanges();
		myPrivateSpy.call(component);
		expect(powerService.getAirplaneModeCapabilityThinkPad).toHaveBeenCalled();
	});
	it('#getAirplaneModeAutoDetectionOnThinkPad should call', async() => {
		const { fixture, component,powerService } = setup();
		spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
		spyOn(powerService, 'getAirplaneModeAutoDetectionOnThinkPad').and.returnValue(Promise.resolve(true));
		const myPrivateSpy = spyOn<any>(component, 'getAirplaneModeAutoDetectionOnThinkPad').and.callThrough();
		fixture.detectChanges();
		myPrivateSpy.call(component);
		expect(powerService.getAirplaneModeAutoDetectionOnThinkPad).toHaveBeenCalled();
	});
	it('#getUSBChargingInBatteryModeStatusIdeaNoteBook should call', async() => {
		const { fixture, component,powerService } = setup();
		spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
		spyOn(powerService, 'getUSBChargingInBatteryModeStatusIdeaNoteBook').and.returnValue(Promise.resolve(featureStatus));
		const myPrivateSpy = spyOn<any>(component, 'getUSBChargingInBatteryModeStatusIdeaNoteBook').and.callThrough();
		fixture.detectChanges();
		myPrivateSpy.call(component);
		expect(powerService.getUSBChargingInBatteryModeStatusIdeaNoteBook).toHaveBeenCalled();
	});
	it('#getAlwaysOnUSBStatusIdeaPad should call', async() => {
		const { fixture, component,powerService } = setup();
		spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
		spyOn(powerService, 'getAlwaysOnUSBStatusIdeaNoteBook').and.returnValue(Promise.resolve(featureStatus));
		const myPrivateSpy = spyOn<any>(component, 'getAlwaysOnUSBStatusIdeaPad').and.callThrough();
		fixture.detectChanges();
		myPrivateSpy.call(component);
		expect(powerService.getAlwaysOnUSBStatusIdeaNoteBook).toHaveBeenCalled();
	});
	it('#setUSBChargingInBatteryModeStatusIdeaNoteBook should call', async() => {
		const { fixture, component,powerService } = setup();
		spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
		spyOn(powerService, 'setUSBChargingInBatteryModeStatusIdeaNoteBook').and.returnValue(Promise.resolve(true));
		const myPrivateSpy = spyOn<any>(component, 'setUSBChargingInBatteryModeStatusIdeaNoteBook').and.callThrough();
		fixture.detectChanges();
		myPrivateSpy.call(component);
		expect(powerService.setUSBChargingInBatteryModeStatusIdeaNoteBook).toHaveBeenCalled();
	});
	it('#getRapidChargeModeStatusIdeaPad should call', async() => {
		const { fixture, component,powerService } = setup();
		spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
		spyOn(powerService, 'getRapidChargeModeStatusIdeaNoteBook').and.returnValue(Promise.resolve(featureStatus));
		const myPrivateSpy = spyOn<any>(component, 'getRapidChargeModeStatusIdeaPad').and.callThrough();
		fixture.detectChanges();
		myPrivateSpy.call(component);
		expect(powerService.getRapidChargeModeStatusIdeaNoteBook).toHaveBeenCalled();
	});
	it('#setConservationModeStatusIdeaNoteBook should call', async() => {
		const { fixture, component,powerService } = setup();
		spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
		spyOn(powerService, 'setConservationModeStatusIdeaNoteBook').and.returnValue(Promise.resolve(true));
		const myPrivateSpy = spyOn<any>(component, 'setConservationModeStatusIdeaNoteBook').and.callThrough();
		fixture.detectChanges();
		myPrivateSpy.call(component);
		expect(powerService.setConservationModeStatusIdeaNoteBook).toHaveBeenCalled();
	});
	it('#getConservationModeStatusIdeaPad should call', async() => {
		const { fixture, component,powerService } = setup();
		spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
		spyOn(powerService, 'getConservationModeStatusIdeaNoteBook').and.returnValue(Promise.resolve(featureStatus));
		const myPrivateSpy = spyOn<any>(component, 'getConservationModeStatusIdeaPad').and.callThrough();
		fixture.detectChanges();
		myPrivateSpy.call(component);
		expect(powerService.getConservationModeStatusIdeaNoteBook).toHaveBeenCalled();
	});

	it('#onNotification should call', async() => {
		const { fixture, component,powerService } = setup();
		spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
		const myPrivateSpy = spyOn<any>(component, 'onNotification').and.callThrough();
		fixture.detectChanges();
		myPrivateSpy.call(component);
		
	});

	it('#getAlwaysOnUSBStatusThinkPad should call', async() => {
		const { fixture, component,powerService } = setup();
		spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
		spyOn(powerService, 'getAlwaysOnUSBStatusThinkPad').and.returnValue(Promise.resolve(true));
		const myPrivateSpy = spyOn<any>(component, 'getAlwaysOnUSBStatusThinkPad').and.callThrough();
		fixture.detectChanges();
		myPrivateSpy.call(component);
		expect(powerService.getAlwaysOnUSBStatusThinkPad).toHaveBeenCalled();
	});
	it('#getEasyResumeStatusThinkPad should call', async() => {
		const { fixture, component,powerService } = setup();
		spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
		spyOn(powerService, 'getEasyResumeStatusThinkPad').and.returnValue(Promise.resolve(true));
		const myPrivateSpy = spyOn<any>(component, 'getEasyResumeStatusThinkPad').and.callThrough();
		fixture.detectChanges();
		myPrivateSpy.call(component);
		expect(powerService.getEasyResumeStatusThinkPad).toHaveBeenCalled();
	});
	it('#setAlwaysOnUSBStatusIdeaPad should call', async() => {
		const { fixture, component,powerService } = setup();
		spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
		const myPrivateSpy = spyOn<any>(component, 'setAlwaysOnUSBStatusIdeaPad').and.callThrough();
		fixture.detectChanges();
		myPrivateSpy.call(component);
	});

	it('#setAirplaneModeThinkPad should call', async() => {
		const { fixture, component,powerService } = setup();
		spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
		const myPrivateSpy = spyOn<any>(component, 'setAirplaneModeThinkPad').and.callThrough();
		fixture.detectChanges();
		myPrivateSpy.call(component);
	});


	it('#onToggleOfEasyResume should call', () => {
		const { fixture, component,powerService} = setup();
		const myPrivateSpy = spyOn<any>(component, 'setEasyResumeThinkPad').and.callThrough();
		spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
		fixture.detectChanges();
		component.machineType=1;
		component.onToggleOfEasyResume({switchValue: true});
		expect(myPrivateSpy).toHaveBeenCalled();
		component.machineType=0;
		component.onToggleOfEasyResume({switchValue: true});
		expect(component.machineType).toBe(0);
	});
	it('#onToggleOfAirplanePowerMode should call', () => {
		const { fixture, component,powerService} = setup();
		const myPrivateSpy = spyOn<any>(component, 'setAirplaneModeThinkPad').and.callThrough();
		spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
		fixture.detectChanges();
		component.machineType=1;
		component.onToggleOfAirplanePowerMode({switchValue: true});
		expect(myPrivateSpy).toHaveBeenCalled();
		component.machineType=0;
		component.onToggleOfAirplanePowerMode({switchValue: true});
		expect(component.machineType).toBe(0);		
	});

	it('#onToggleOfAlwaysOnUsb should call', async() => {
		const { fixture, component,powerService } = setup();
		spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
		const myPrivateSpy = spyOn<any>(component, 'setAlwaysOnUSBStatusThinkPad').and.callThrough();
		fixture.detectChanges();
		component.machineType=1;
		await component.onToggleOfAlwaysOnUsb(new Event('click'));
		expect(myPrivateSpy).toHaveBeenCalled();
		component.machineType=0;
		component.onToggleOfAlwaysOnUsb({switchValue: true});
		expect(myPrivateSpy).toHaveBeenCalled();
	});
	it('#closeContextModal should call', () => {
		const { fixture, component } = setup();
		spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
		spyOn(modalService, 'dismissAll').and.returnValue();
		fixture.detectChanges();
		component.closeContextModal();
		expect(modalService.dismissAll).toHaveBeenCalled();
	     });
   });
});
