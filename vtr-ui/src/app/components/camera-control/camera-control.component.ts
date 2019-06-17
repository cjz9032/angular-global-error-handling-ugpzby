import { Component, OnInit, Input, ViewChild, OnDestroy, ElementRef, Output, EventEmitter } from '@angular/core';
import { CameraDetail, ICameraSettingsResponse, CameraFeatureAccess } from 'src/app/data-models/camera/camera-detail.model';
import { CameraFeedService } from 'src/app/services/camera/camera-feed/camera-feed.service';
import { BaseCameraDetail } from 'src/app/services/camera/camera-detail/base-camera-detail.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { ChangeContext } from 'ng5-slider';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';

@Component({
	selector: 'vtr-camera-control',
	templateUrl: './camera-control.component.html',
	styleUrls: ['./camera-control.component.scss']
})

export class CameraControlComponent implements OnInit, OnDestroy {
	@Input() cameraSettings: ICameraSettingsResponse;
	@Input() cameraFeatureAccess: CameraFeatureAccess;
	@Input() manualRefresh: any;
	@Input() disabledAll: boolean;
	@Output() brightnessChange: EventEmitter<ChangeContext> = new EventEmitter();
	@Output() contrastChange: EventEmitter<ChangeContext> = new EventEmitter();
	@Output() exposureChange: EventEmitter<ChangeContext> = new EventEmitter();
	@Output() exposureToggle: EventEmitter<any> = new EventEmitter();
	@Output() cameraAvailable: EventEmitter<boolean> = new EventEmitter();

	public cameraDetail = new CameraDetail();
	private cameraPreview: ElementRef;
	private _video: HTMLVideoElement;
	private cameraDetailSubscription: Subscription;
	private logger: any;
	private Windows: any;
	private Capture: any;
	private DeviceInformation: any;
	private DeviceClass: any;
	private oMediaCapture: any;
	private visibilityChange: any;

	public cameraErrorTitle: string;
	public cameraErrorDescription: string;
	public isCameraInErrorState = false;

	@ViewChild('cameraPreview') set content(content: ElementRef) {
		// when camera preview video element is visible then start camera feed
		this.cameraPreview = content;
		if (content && !this.cameraDetail.isPrivacyModeEnabled) {
			this.initializeCameraAsync();
		} else {
			this.cleanupCameraAsync();
		}
	}

	constructor(
		public cameraFeedService: CameraFeedService,
		public baseCameraDetail: BaseCameraDetail,
		private vantageShellService: VantageShellService
	) {
		this.Windows = vantageShellService.getWindows();
		this.Capture = this.Windows.Media.Capture;
		this.DeviceInformation = this.Windows.Devices.Enumeration.DeviceInformation;
		this.DeviceClass = this.Windows.Devices.Enumeration.DeviceClass;

		//#region below logic required to re-enable camera feed when window is maximized from minimized state
		this.logger = this.vantageShellService.getLogger();
		this.logger.info('constructor camera');
		this.oMediaCapture = new this.Capture.MediaCapture();
		this.visibilityChange = this.onVisibilityChanged.bind(this);
		document.addEventListener('visibilitychange', this.visibilityChange);
		//#endregion
	}

	ngOnInit() {
		this.cameraDetailSubscription = this.baseCameraDetail.cameraDetailObservable.subscribe(
			(cameraDetail: CameraDetail) => {
				this.cameraDetail = cameraDetail;
			},
			error => {
				console.log(error);
			}
		);
	}

	ngOnDestroy() {
		if (this.baseCameraDetail) {
			this.cameraDetailSubscription.unsubscribe();
		}
		this.cleanupCameraAsync();
		document.removeEventListener('visibilitychange', this.visibilityChange);
	}

	findCameraDeviceByPanelAsync(panel) {
		let deviceInfo = null;
		// Get available devices for capturing pictures
		return this.DeviceInformation.findAllAsync(this.DeviceClass.videoCapture)
			.then(function (devices) {
				devices.forEach(function (cameraDeviceInfo) {
					if (cameraDeviceInfo.enclosureLocation != null && cameraDeviceInfo.enclosureLocation.panel === panel) {
						deviceInfo = cameraDeviceInfo;
						return;
					}
				});

				// Nothing matched, just return the first
				if (!deviceInfo && devices.length > 0) {
					deviceInfo = devices.getAt(0);
				}
				return deviceInfo;
			}, (error) => {
				this.disabledAll = true;
				console.log('findCameraDeviceByPanelAsync error ', error.message);
			});
	}

	initializeCameraAsync() {
		console.log('InitializeCameraAsync');
		const self = this;
		try {
			// Get available devices for capturing pictures
			return this.findCameraDeviceByPanelAsync(this.Windows.Devices.Enumeration.Panel.front)
				.then((camera) => {
					if (!camera) {
						this.cameraAvailable.emit(false);
						return;
					}

					this.cameraAvailable.emit(true);
					self.oMediaCapture = new self.Windows.Media.Capture.MediaCapture();

					// Register for a notification when something goes wrong
					// TODO: define the fail handle callback and show error message maybe... there's a chance another app is previewing camera, that's when failed happen.
					self.oMediaCapture.addEventListener('failed', (error) => {
						this.isCameraInErrorState = true;
						console.log('failed to capture camera', error);
						self.cleanupCameraAsync();
						if (error.Code === 3222091524) {
							this.cameraErrorTitle = 'device.deviceSettings.displayCamera.camera.cameraLoadingFailed.inUseTitle';
							this.cameraErrorDescription = 'device.deviceSettings.displayCamera.camera.cameraLoadingFailed.inUseDescription';
						} else {
							this.cameraErrorTitle = 'device.deviceSettings.displayCamera.camera.cameraLoadingFailed.loadingFailedTitle';
							this.cameraErrorDescription = 'device.deviceSettings.displayCamera.camera.cameraLoadingFailed.loadingFailedDescription';
						}
					});

					const settings = new self.Capture.MediaCaptureInitializationSettings();
					settings.videoDeviceId = camera.id;
					settings.streamingCaptureMode = 2; // video
					settings.photoCaptureSource = 0; // auto

					// Initialize media capture and start the preview
					return self.oMediaCapture.initializeAsync(settings);

				}, (error) => {
					this.disabledAll = true;
					console.log('findCameraDeviceByPanelAsync error', error.message);
				}).then(function () {
					return self.startPreviewAsync();
				}).done();
		} catch (error) {
			this.disabledAll = true;
			console.log('initializeCameraAsync catch', error);
		}
	}

	startPreviewAsync() {
		const previewUrl = URL.createObjectURL(this.oMediaCapture);
		this._video = this.cameraPreview.nativeElement;
		this._video.src = previewUrl;
		this._video.play();
	}

	stopPreview() {
		// Cleanup the UI
		if (this._video) {
			this._video.pause();
			this._video.src = '';
		}
	}

	cleanupCameraAsync() {
		console.log('cleanupCameraAsync');
		this.stopPreview();

		if (this.oMediaCapture) {
			this.oMediaCapture.close();
			this.oMediaCapture = null;
		}
	}

	onVisibilityChanged() {
		if (document.hidden) {
			this.cleanupCameraAsync();
		} else {
			this.initializeCameraAsync();
		}
	}

	public onAutoExposureChange($event: any) {
		try {
			console.log('onAutoExposureChange', this.cameraSettings.exposure);
			this.exposureToggle.emit($event);
		} catch (error) {
			console.error(error.message);
		}
	}

	public onBrightnessSliderChange($event: ChangeContext) {
		console.log('Brightness changed', $event);
		this.brightnessChange.emit($event);
	}
	public onContrastSliderChange($event: ChangeContext) {
		console.log('Contrast changed', $event);
		this.contrastChange.emit($event);
	}
	public onExposureSliderChange($event: ChangeContext) {
		console.log('exposure changed', $event);
		this.exposureChange.emit($event);
	}

	public getCameraPreviewVisibility() {
		if (this.isCameraInErrorState) {
			return true;
		}
	}
}
