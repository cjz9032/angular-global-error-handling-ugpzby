import { TestBed } from '@angular/core/testing';

import { SelfSelectService, SegmentConst } from './self-select.service';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { DeviceService } from '../device/device.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { LoggerService } from '../logger/logger.service';
import { CommonService } from '../common/common.service';
import { Shell } from '@lenovo/tan-client-bridge';
import { doesNotMatch } from 'assert';

class VantageMockService {
	public isShellAvailable: boolean = true;
	getSelfSelect () {
		return {
			updateConfig(config){}
		}
	}

	getVantageStub() {
		return {
			refresh(){}
		}
	}
}

class LoggerMockService {
	error(any) {}
	info(any) {}
}

class DeviceMockService {

}

class CommonMockService {
	value;
	getLocalStorageValue() {
		return this.value
	}

	setLocalStorageValue(value) {
		this.value = value
	}

	sendNotification(any) {}
	sendReplayNotification(any){}
}

describe('SelfSelectService', () => {
  beforeEach(() => {
	TestBed.resetTestEnvironment();
	TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
	TestBed.configureTestingModule({
		providers: [
			{
				provide: DeviceService,
				useClass: DeviceMockService
			},
			{
				provide: LoggerService,
				useClass: LoggerMockService
			},
			{
				provide: CommonService,
				useClass: CommonMockService
			},
			{
				provide: VantageShellService,
				useClass: VantageMockService
			}
		]
	})
  });

  it('should be created', () => {
	const service: SelfSelectService = TestBed.get(SelfSelectService);
	expect(service).toBeTruthy();
  });

  it('IsMatch case insensitive, source: Lenovo V330-14ARR, pattern: /^lenovo V/i', () => {
	const service: SelfSelectService = TestBed.get(SelfSelectService);
	const source = 'Lenovo V330-14ARR';
	const sourceUpper = source.toLocaleLowerCase();
	const sourceLower = source.toLocaleLowerCase();
	const pattern = /^lenovo V/i;

	expect(service).toBeTruthy();
	expect(service.IsMatch(pattern, source)).toBe(true);
	expect(service.IsMatch(pattern, sourceUpper)).toBe(true);
	expect(service.IsMatch(pattern, sourceLower)).toBe(true);
  });

  it('usageType cant be changed when the savedSegment is LE', () => {
	const service: SelfSelectService = TestBed.get(SelfSelectService);
	service.usageType = SegmentConst.LE;
	service['savedSegment'] = SegmentConst.LE;
	service.usageType = SegmentConst.Consumer;
	expect(service.usageType).toBe(SegmentConst.LE);
  });

  it('usageType can be changed when the savedSegment is not LE', () => {
	const service: SelfSelectService = TestBed.get(SelfSelectService);
	service.usageType = SegmentConst.SMB;
	service['savedSegment'] = SegmentConst.SMB;
	service.usageType = SegmentConst.Consumer;
	expect(service.usageType).toBe(SegmentConst.Consumer);
  });

  it('getLEState LE Shell', () => {
	const service: SelfSelectService = TestBed.get(SelfSelectService);
	const tmp = Shell.isVantageLE;
	Shell.isVantageLE = true;
	expect(service['getLEState']()).toBe(true);
	Shell.isVantageLE = tmp;
  });

  it('getLEState not LE Shell and Shell available', () => {
	const service: SelfSelectService = TestBed.get(SelfSelectService);
	const tmp = Shell.isVantageLE;
	Shell.isVantageLE = false;
	expect(service['getLEState']()).toBe(false);
	Shell.isVantageLE = tmp;
  });

  it('getConfig is LE', () => {
	const service: SelfSelectService = TestBed.get(SelfSelectService);
	service['getConfig'](true).then(ret => {
		expect(ret).toEqual({usageType: SegmentConst.LE, interests: []});
	});
  });
});
