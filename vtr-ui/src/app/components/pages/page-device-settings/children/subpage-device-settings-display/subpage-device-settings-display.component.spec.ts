import {
	async,
	ComponentFixture,
	TestBed,
	fakeAsync,
	tick
} from "@angular/core/testing";
import {
	HttpClientTestingModule,
	HttpTestingController
} from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { Pipe } from "@angular/core";

import { SubpageDeviceSettingsDisplayComponent } from "./subpage-device-settings-display.component";
import { CapitalizeFirstPipe } from "../../../../../pipe/capitalize-pipe/capitalize-first.pipe";
import {
	CameraDetail,
	CameraSettingsResponse,
	CameraFeatureAccess,
	EyeCareModeResponse
} from "src/app/data-models/camera/camera-detail.model";

import { DisplayService } from "src/app/services/display/display.service";
import { DeviceService } from "src/app/services/device/device.service";
import { CommonService } from "src/app/services/common/common.service";
import { BaseCameraDetail } from "src/app/services/camera/camera-detail/base-camera-detail.service";
import { LoggerService } from "src/app/services/logger/logger.service";
import { VantageShellService } from "src/app/services/vantage-shell/vantage-shell.service";
import { DevService } from '../../../../../services/dev/dev.service'

import { TranslateModule } from "@ngx-translate/core";
import { Md5 } from 'ts-md5';

describe("SubpageDeviceSettingsDisplayComponent", () => {
	let component: SubpageDeviceSettingsDisplayComponent;
	let fixture: ComponentFixture<SubpageDeviceSettingsDisplayComponent>;
	let deviceService: DeviceService;
	let displayService: DisplayService;
	let commonService: CommonService;
	let baseCameraDetailService: BaseCameraDetail;
	let vantageShellService: VantageShellService;
	let logger: LoggerService;
	let devService: DevService

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule, HttpClientTestingModule, TranslateModule.forRoot()],
			declarations: [
				SubpageDeviceSettingsDisplayComponent,
				mockPipe({ name: "translate" }),
				CapitalizeFirstPipe
			],
			schemas: [NO_ERRORS_SCHEMA],
			providers: [
				DeviceService,
				DisplayService,
				VantageShellService,
				BaseCameraDetail,
				CommonService,
				DevService,
				LoggerService
			]
		}).compileComponents();

		fixture = TestBed.createComponent(
			SubpageDeviceSettingsDisplayComponent
		);
		component = fixture.componentInstance;
		deviceService = TestBed.get(DeviceService);
		displayService = TestBed.get(DisplayService);
		commonService = TestBed.get(CommonService);
		baseCameraDetailService = TestBed.get(BaseCameraDetail);
		vantageShellService = TestBed.get(VantageShellService);
		logger = TestBed.get(LoggerService);
		devService = TestBed.get(DevService)
	}));

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it('should call initDataFromCache', (() => {
		let spy = spyOn(component, 'initCameraPrivacyFromCache')
		component.initDataFromCache()
		expect(spy).toHaveBeenCalled()
	}))

	it('should throw error - initDataFromCache', () => {
		expect(component.initDataFromCache).toThrow()
	});

	it('should call initCameraPrivacyFromCache', () => {
		const privacy = {available: 'true'}
		let spy = spyOn(commonService, 'getLocalStorageValue').and.returnValue(privacy)
		component.initCameraPrivacyFromCache()
		expect(spy).toHaveBeenCalled()
	})

	it('should call initCameraPrivacyFromCache - else', () => {
		component.initCameraPrivacyFromCache()
		expect(component.cameraPrivacyModeStatus.available).toEqual(true)
	});

	it('should call initEyeCareModeFromCache', () => {
		let eyeCareModeCache = {available: true}
		let spy = spyOn(commonService, 'getLocalStorageValue').and.returnValue(eyeCareModeCache)
		component.initEyeCareModeFromCache()
		expect(spy).toHaveBeenCalled()
	});

	it('should call initEyeCareModeFromCache - else', () => {
		component.initEyeCareModeFromCache()
		expect(component.eyeCareModeCache.available).toEqual(false)
	});

	it('should throw error - initEyeCareModeFromCache', () => {
		expect(component.initEyeCareModeFromCache).toThrow()
	})

	it('should call initDisplayColorTempFromCache', () => {
		let displayColorTempCache = {available: true}
		let spy = spyOn(commonService, 'getLocalStorageValue').and.returnValue(displayColorTempCache)
		component.initDisplayColorTempFromCache()
		expect(spy).toHaveBeenCalled()
	})

	it('should call initDisplayColorTempFromCache - else', () => {
		component.initDisplayColorTempFromCache()
		expect(component.displayColorTempCache.available).toEqual(undefined)
	});

	it('should call initDisplayColorTempFromCache - inner if', () => {
		let displayColorTempCache = {available: false}
		let spy = spyOn(commonService, 'getLocalStorageValue').and.returnValue(displayColorTempCache)
		component.initDisplayColorTempFromCache()
		expect(spy).toHaveBeenCalled()
	})

	it('should throw error - initDisplayColorTempFromCache', () => {
		expect(component.initDisplayColorTempFromCache).toThrow()
	})

	it('should call initFeatures', () => {
		let spy = spyOn(component, 'getPrivacyGuardCapabilityStatus')
		component.initFeatures()
		expect(spy).toHaveBeenCalled()
	})

	it('should call initFeatures - inner if', () => {
		 let spy = spyOn(commonService, 'getLocalStorageValue').and.returnValue(1)
		component.initFeatures()
		expect(spy).toHaveBeenCalled()
	})

	it('should call inWhiteList', () => {
		let spy = spyOn(deviceService, 'getDeviceInfo').and.returnValue(Promise.resolve(vantageShellService.getDevice()))
		component.inWhiteList()
	})

	
});

/**
 * @param options pipeName which has to be mock
 * @description To mock the pipe.
 * @summary This has to move to one utils file.
 */
export function mockPipe(options: Pipe): Pipe {
	const metadata: Pipe = {
		name: options.name
	};
	return <any>Pipe(metadata)(
		class MockPipe {
			public transform(query: string, ...args: any[]): any {
				return query;
			}
		}
	);
}
