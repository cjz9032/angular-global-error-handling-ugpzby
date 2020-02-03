import { TestBed } from "@angular/core/testing";

import { CameraFeedService } from "./camera-feed.service";
import { VantageShellService } from "../../vantage-shell/vantage-shell-mock.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("Shared service:", () => {
	let shellService: VantageShellService;
	let cameraFeedService: CameraFeedService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [VantageShellService]
		});
		cameraFeedService = TestBed.get(CameraFeedService);
		shellService = TestBed.get(VantageShellService);
	});

	it('should call getCameraBlurSettings', () => {
		cameraFeedService['cameraBlur'] = {getCameraBlurSettings() {
			return true
		}}
		let spy = spyOn<any>(cameraFeedService['cameraBlur'], 'getCameraBlurSettings')
		cameraFeedService.getCameraBlurSettings()
		expect(spy).toHaveBeenCalled()
	})

	it('should call getCameraBlurSettings - cameraBlue is undefined', () => {
		cameraFeedService['cameraBlur'] = undefined
		cameraFeedService.getCameraBlurSettings()
		expect(cameraFeedService.getCameraBlurSettings).not.toBe(undefined)
	})

	it('should call setCameraBlurSettings', () => {
		cameraFeedService['cameraBlur'] = {setCameraBlurSettings() {
			return true
		}}
		let spy = spyOn<any>(cameraFeedService['cameraBlur'], 'setCameraBlurSettings')
		cameraFeedService.setCameraBlurSettings(true, 'abc')
		expect(spy).toHaveBeenCalled()
	})

	it('should call setCameraBlurSettings - mode is empty', () => {
		cameraFeedService['cameraBlur'] = {setCameraBlurSettings() {
			return true
		}}
		let spy = spyOn<any>(cameraFeedService['cameraBlur'], 'setCameraBlurSettings')
		cameraFeedService.setCameraBlurSettings(true, '')
		expect(spy).toHaveBeenCalled()
	})

	it('should call setCameraBlurSettings - isEnable is false', () => {
		cameraFeedService['cameraBlur'] = {setCameraBlurSettings() {
			return true
		}}
		let spy = spyOn<any>(cameraFeedService['cameraBlur'], 'setCameraBlurSettings')
		cameraFeedService.setCameraBlurSettings(false, '')
		expect(spy).toHaveBeenCalled()
	})

	it('should call setCameraBlurSettings - cameraBlue is undefined', () => {
		cameraFeedService['cameraBlur'] = undefined
		cameraFeedService.setCameraBlurSettings(true, '')
		expect(cameraFeedService.getCameraBlurSettings).not.toBe(undefined)
	})
});
