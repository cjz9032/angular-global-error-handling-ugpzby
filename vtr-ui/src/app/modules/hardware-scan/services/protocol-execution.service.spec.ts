import { TestBed } from '@angular/core/testing';
import { HardwareScanProtocolModule, TaskType } from 'src/app/modules/hardware-scan/enums/hardware-scan.enum';
import { HardwareScanService } from './hardware-scan.service';
import { ProtocolExecutionService } from './protocol-execution.service';
import { ScanExecutionService } from './scan-execution.service';

describe('ProtocolExecutionService', () => {
	let service: ProtocolExecutionService;
	const scanExecutionService = jasmine.createSpyObj('scanExecutionService', ['checkPreScanInfo']);
	const hardwareScanService = jasmine.createSpyObj('hardwareScanService', {
		getModulesRetrieved: {module: 'cpu'},
		setLastTaskType: undefined
	});

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				{
					provide: HardwareScanService,
					useValue: hardwareScanService
				},
				{
					provide: ScanExecutionService,
					useValue: scanExecutionService
				}
			]
		});
		service = TestBed.inject(ProtocolExecutionService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should return false when undefined params is given', () => {
		const value = service.validateParams(undefined);
		expect(value).toBeFalse();
	});

	it('should return false when null params is given', () => {
		const param = { };
		const value = service.validateParams(param);
		expect(value).toBeFalse();
	});

	it('should return true when param.scan is equals to quickscan', () => {
		const param = {
			scan: 'quickscan'
		};
		const value = service.validateParams(param);
		expect(value).toBeTrue();
	});

	it('should return false when param.scan is different than quickscan', () => {
		const param = {
			scan: 'customscan'
		};
		const value = service.validateParams(param);
		expect(value).toBeFalse();
	});

	it('should call quickScanProtocol(HardwareScanProtocolModule.memory) when scan is equals to quickscan and module is equal to memory', () => {
		const quickScanProtocolSpy = spyOn(service, 'quickScanProtocol');

		service.protocolExecution('quickscan', 'memory');
		expect(quickScanProtocolSpy).toHaveBeenCalledWith(HardwareScanProtocolModule.memory);
	});

	it('should call quickScanProtocol(HardwareScanProtocolModule.cpu) when scan is equals to quickscan and module is equal to cpu', () => {
		const quickScanProtocolSpy = spyOn(service, 'quickScanProtocol');

		service.protocolExecution('quickscan', 'cpu');
		expect(quickScanProtocolSpy).toHaveBeenCalledWith(HardwareScanProtocolModule.cpu);
	});

	it('should call quickScanProtocol(HardwareScanProtocolModule.wireless) when scan is equals to quickscan and module is equal to wireless', () => {
		const quickScanProtocolSpy = spyOn(service, 'quickScanProtocol');

		service.protocolExecution('quickscan', 'wireless');
		expect(quickScanProtocolSpy).toHaveBeenCalledWith(HardwareScanProtocolModule.wireless);
	});

	it('should call quickScanProtocol(HardwareScanProtocolModule.storage) when scan is equals to quickscan and module is equal to storage', () => {
		const quickScanProtocolSpy = spyOn(service, 'quickScanProtocol');

		service.protocolExecution('quickscan', 'storage');
		expect(quickScanProtocolSpy).toHaveBeenCalledWith(HardwareScanProtocolModule.storage);
	});

	it('should call quickScanProtocol(HardwareScanProtocolModule.all) when scan is equals to quickscan and no module is given', () => {
		const quickScanProtocolSpy = spyOn(service, 'quickScanProtocol');

		service.protocolExecution('quickscan', undefined);
		expect(quickScanProtocolSpy).toHaveBeenCalledWith(HardwareScanProtocolModule.all);
	});

	it('should not call quickScanProtocol() when scan is different than quickscan', () => {
		const quickScanProtocolSpy = spyOn(service, 'quickScanProtocol');

		service.protocolExecution('customscan', undefined);
		service.protocolExecution('recoverbadsectors', undefined);
		expect(quickScanProtocolSpy).not.toHaveBeenCalled();
	});

	it('should call checkPreScanInfo() when module is equal to cpu', () => {
		service.quickScanProtocol(HardwareScanProtocolModule.cpu);
		expect(scanExecutionService.checkPreScanInfo)
			.toHaveBeenCalledWith(TaskType.QuickScan, false, HardwareScanProtocolModule.cpu);
	});

	it('should call checkPreScanInfo() when module is equal to memory', () => {
		service.quickScanProtocol(HardwareScanProtocolModule.memory);
		expect(scanExecutionService.checkPreScanInfo)
			.toHaveBeenCalledWith(TaskType.QuickScan, false, HardwareScanProtocolModule.memory);
	});

	it('should call checkPreScanInfo() when module is equal to wireless', () => {
		service.quickScanProtocol(HardwareScanProtocolModule.wireless);
		expect(scanExecutionService.checkPreScanInfo)
			.toHaveBeenCalledWith(TaskType.QuickScan, false, HardwareScanProtocolModule.wireless);
	});

	it('should call checkPreScanInfo() when module is equal to storage', () => {
		service.quickScanProtocol(HardwareScanProtocolModule.storage);
		expect(scanExecutionService.checkPreScanInfo)
			.toHaveBeenCalledWith(TaskType.QuickScan, false, HardwareScanProtocolModule.storage);
	});

	it('should call checkPreScanInfo() when module is equal to all', () => {
		service.quickScanProtocol(HardwareScanProtocolModule.all);
		expect(scanExecutionService.checkPreScanInfo)
			.toHaveBeenCalledWith(TaskType.QuickScan, false, HardwareScanProtocolModule.all);
	});
});
