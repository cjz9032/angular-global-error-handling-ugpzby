import { TestBed } from '@angular/core/testing';

import { LenovoSupportService } from './lenovo-support.service';
import { DeviceService } from '../../../services/device/device.service';
import { HardwareScanService } from './hardware-scan.service';
import { MyDevice } from 'src/app/data-models/device/my-device.model';
import { formatDate } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoggerService } from '../../../services/logger/logger.service';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';

describe('LenovoSupportService', () => {
	// let service: LenovoSupportService;
	// // Mocked values returned by mocked services
	// let deviceInfo = new MyDevice();
	// deviceInfo.sn = 'ABC1234';
	// const finalResultCode: string = 'W3P1NRRP5HX4-AW85SJ';
	// let eTicketSupported: boolean = false;
	// beforeEach(() => {
	// 	// Mocked service's dependencies and their methods
	// 	const spyDeviceService = jasmine.createSpyObj('DeviceService', ['getDeviceInfo']);
	// 	const spyHardwareScanService = jasmine.createSpyObj('HardwareScanService',
	// 		['getFinalResultCode', 'getPluginVersion', 'isPluginCompatible']);
	// 	const spyVantageShellService = jasmine.createSpyObj('VantageShellService', ['getHardwareScan']);
	// 	const spyLoggerService = jasmine.createSpyObj('Logger', ['exception', 'info']);
	// 	TestBed.configureTestingModule({
	// 		imports: [HttpClientTestingModule],
	// 		providers: [
	// 			LenovoSupportService,
	// 			{ provide: VantageShellService, useValue: spyVantageShellService },
	// 			{ provide: DeviceService, useValue: spyDeviceService },
	// 			{ provide: HardwareScanService, useValue: spyHardwareScanService },
	// 			{ provide: LoggerService, useValue: spyLoggerService }
	// 		]
	// 	});
	// 	// Registering return values for mocked methods that don't vary per test case
	// 	spyDeviceService.getDeviceInfo.and.returnValue(Promise.resolve(deviceInfo));
	// 	spyHardwareScanService.getPluginVersion.and.returnValue('1.0.44');
	// 	spyHardwareScanService.isPluginCompatible.and.returnValue(true);
	// 	spyHardwareScanService.getFinalResultCode.and.returnValue(finalResultCode);
	// 	spyVantageShellService.getHardwareScan.and.callFake(() => {
	// 		const hardwareScanBridge = {
	// 			isETicketAvailable: async function (serialNumber) {
	// 				return { isETicketAvailable: eTicketSupported };
	// 			}
	// 		};
	// 		return hardwareScanBridge;
	// 	});
	// 	service = TestBed.get(LenovoSupportService);
	// });
	// it('should be created', () => {
	// 	expect(service).toBeTruthy();
	// });
	// it('getPremierUrl() should return right url', async () => {
	// 	const url = await service.getPremierUrl();
	// 	expect(url).toBe('https://pcsupport.lenovo.com/premierhome?sn=' + deviceInfo.sn);
	// });
	// it('getSupportUrl() should return the eTicket url as e-Ticket is supported', async () => {
	// 	const scanDate = new Date(2020, 4, 30);
	// 	const expectedBase64EncodedData = btoa('SerialNumber=' + deviceInfo.sn +
	// 		'&DiagCode=' + finalResultCode +
	// 		'&Channel=vantage' +
	// 		'TestDate=' + formatDate(scanDate, 'yyyyMMdd', 'en-US'));
	// 	// set the value up that will be returned by the mocked bridge
	// 	eTicketSupported = true;
	// 	service.startCheckingIfETicketIsAvailable();
	// 	const url = await service.getSupportUrl(scanDate);
	// 	expect(url).toBe('https://pcsupport.lenovo.com/eticketwithservice?data=' + expectedBase64EncodedData);
	// });
	// it('getSupportUrl() should return the Premier Home url as e-Ticket is not supported', async () => {
	// 	const scanDate = new Date(2020, 4, 30);
	// 	// set the value up that will be returned by the mocked bridge
	// 	eTicketSupported = false;
	// 	service.startCheckingIfETicketIsAvailable();
	// 	const url = await service.getSupportUrl(scanDate);
	// 	expect(url).toBe('https://pcsupport.lenovo.com/premierhome?sn=' + deviceInfo.sn);
	// });
});
