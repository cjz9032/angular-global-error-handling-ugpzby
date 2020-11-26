import { TestBed } from '@angular/core/testing';

import { InitializerService } from './initializer.service';
import {
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { CommonService } from '../common/common.service';
import { DeviceService } from '../device/device.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { SegmentConst } from '../self-select/self-select.service';

let commonMockObj = {
	segment: undefined,
	getLocalStorageValue() {
		return this.segment;
	},
};

let shellMockObj = {
	securityAdvisor: {
		antivirus: {
			refresh() {},
		},
	},
	isShellAvailable: true,
	getSecurityAdvisor() {
		return this.securityAdvisor;
	},
};

let deviceMockObj = {
	isArm: true,
	isSMode: true,
};

describe('InitializerService', () => {
	let service: InitializerService;
	beforeEach(() => {
		TestBed.resetTestEnvironment();
		TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
		TestBed.configureTestingModule({
			providers: [
				{
					provide: VantageShellService,
					useValue: shellMockObj,
				},
				{
					provide: DeviceService,
					useValue: deviceMockObj,
				},
				{
					provide: CommonService,
					useValue: commonMockObj,
				},
				InitializerService,
			],
		});
		service = TestBed.get(InitializerService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('initializeAntivirus consumer', () => {
		service['commonService']['segment'] = SegmentConst.ConsumerBase;
		service['deviceService']['isArm'] = false;
		service['deviceService']['isSMode'] = false;

		spyOnAllFunctions(service['vantageShellService'].getSecurityAdvisor().antivirus);
		service['initializeAntivirus']();
		expect(
			service['vantageShellService'].getSecurityAdvisor().antivirus.refresh
		).toHaveBeenCalled();
	});

	it('initializeAntivirus commercial', () => {
		service['commonService']['segment'] = SegmentConst.Commercial;
		service['deviceService']['isArm'] = false;
		service['deviceService']['isSMode'] = false;

		spyOnAllFunctions(service['vantageShellService'].getSecurityAdvisor().antivirus);
		service['initializeAntivirus']();
		expect(
			service['vantageShellService'].getSecurityAdvisor().antivirus.refresh
		).not.toHaveBeenCalled();
	});

	it('initializeAntivirus gaming', () => {
		service['commonService']['segment'] = SegmentConst.Gaming;
		service['deviceService']['isArm'] = false;
		service['deviceService']['isSMode'] = false;

		spyOnAllFunctions(service['vantageShellService'].getSecurityAdvisor().antivirus);
		service['initializeAntivirus']();
		expect(
			service['vantageShellService'].getSecurityAdvisor().antivirus.refresh
		).not.toHaveBeenCalled();
	});

	it('initializeAntivirus SMB', () => {
		service['commonService']['segment'] = SegmentConst.SMB;
		service['deviceService']['isArm'] = false;
		service['deviceService']['isSMode'] = false;

		spyOnAllFunctions(service['vantageShellService'].getSecurityAdvisor().antivirus);
		service['initializeAntivirus']();
		expect(
			service['vantageShellService'].getSecurityAdvisor().antivirus.refresh
		).toHaveBeenCalled();
	});

	it('initializeAntivirus consumer SMode', () => {
		service['commonService']['segment'] = SegmentConst.ConsumerBase;
		service['deviceService']['isArm'] = false;
		service['deviceService']['isSMode'] = true;

		spyOnAllFunctions(service['vantageShellService'].getSecurityAdvisor().antivirus);
		service['initializeAntivirus']();
		expect(
			service['vantageShellService'].getSecurityAdvisor().antivirus.refresh
		).not.toHaveBeenCalled();
	});

	it('initializeAntivirus Commercial SMode', () => {
		service['commonService']['segment'] = SegmentConst.Commercial;
		service['deviceService']['isArm'] = false;
		service['deviceService']['isSMode'] = true;

		spyOnAllFunctions(service['vantageShellService'].getSecurityAdvisor().antivirus);
		service['initializeAntivirus']();
		expect(
			service['vantageShellService'].getSecurityAdvisor().antivirus.refresh
		).not.toHaveBeenCalled();
	});

	it('initializeAntivirus consumer Arm', () => {
		service['commonService']['segment'] = SegmentConst.ConsumerBase;
		service['deviceService']['isArm'] = true;
		service['deviceService']['isSMode'] = false;

		spyOnAllFunctions(service['vantageShellService'].getSecurityAdvisor().antivirus);
		service['initializeAntivirus']();
		expect(
			service['vantageShellService'].getSecurityAdvisor().antivirus.refresh
		).not.toHaveBeenCalled();
	});

	it('initializeAntivirus Commercial Arm', () => {
		service['commonService']['segment'] = SegmentConst.Commercial;
		service['deviceService']['isArm'] = true;
		service['deviceService']['isSMode'] = false;

		spyOnAllFunctions(service['vantageShellService'].getSecurityAdvisor().antivirus);
		service['initializeAntivirus']();
		expect(
			service['vantageShellService'].getSecurityAdvisor().antivirus.refresh
		).not.toHaveBeenCalled();
	});

	it('initializeAntivirus consumer Arm SMode', () => {
		service['commonService']['segment'] = SegmentConst.ConsumerBase;
		service['deviceService']['isArm'] = true;
		service['deviceService']['isSMode'] = true;

		spyOnAllFunctions(service['vantageShellService'].getSecurityAdvisor().antivirus);
		service['initializeAntivirus']();
		expect(
			service['vantageShellService'].getSecurityAdvisor().antivirus.refresh
		).not.toHaveBeenCalled();
	});

	it('initializeAntivirus Commercial Arm SMode', () => {
		service['commonService']['segment'] = SegmentConst.Commercial;
		service['deviceService']['isArm'] = true;
		service['deviceService']['isSMode'] = true;

		spyOnAllFunctions(service['vantageShellService'].getSecurityAdvisor().antivirus);
		service['initializeAntivirus']();
		expect(
			service['vantageShellService'].getSecurityAdvisor().antivirus.refresh
		).not.toHaveBeenCalled();
	});

	it('initializeAntivirus no segment cache', () => {
		service['commonService']['segment'] = undefined;
		service['deviceService']['isArm'] = false;
		service['deviceService']['isSMode'] = false;

		spyOnAllFunctions(service['vantageShellService'].getSecurityAdvisor().antivirus);
		service['initializeAntivirus']();
		expect(
			service['vantageShellService'].getSecurityAdvisor().antivirus.refresh
		).not.toHaveBeenCalled();
	});

	it('initializeAntivirus no segment arm', () => {
		service['commonService']['segment'] = undefined;
		service['deviceService']['isArm'] = true;
		service['deviceService']['isSMode'] = false;

		spyOnAllFunctions(service['vantageShellService'].getSecurityAdvisor().antivirus);
		service['initializeAntivirus']();
		expect(
			service['vantageShellService'].getSecurityAdvisor().antivirus.refresh
		).not.toHaveBeenCalled();
	});
});
