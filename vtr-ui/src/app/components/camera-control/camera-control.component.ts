import { Component, OnInit, Input, ViewChild, OnDestroy, ElementRef, Output, EventEmitter, NgZone } from '@angular/core';
import { CameraDetail, CameraSettingsResponse, CameraFeatureAccess } from 'src/app/data-models/camera/camera-detail.model';
import { CameraFeedService } from 'src/app/services/camera/camera-feed/camera-feed.service';
import { BaseCameraDetail } from 'src/app/services/camera/camera-detail/base-camera-detail.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { ChangeContext } from 'ng5-slider';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Component({
	selector: 'vtr-camera-control',
	templateUrl: './camera-control.component.html',
	styleUrls: ['./camera-control.component.scss']
})

export class CameraControlComponent implements OnInit, OnDestroy {
	@Input() cameraSettings: CameraSettingsResponse = new CameraSettingsResponse();
	@Input() cameraFeatureAccess: CameraFeatureAccess;
	@Input() manualRefresh: any;
	@Input() disabledAll = false;
	@Output() brightnessChange: EventEmitter<ChangeContext> = new EventEmitter();
	@Output() contrastChange: EventEmitter<ChangeContext> = new EventEmitter();
	@Output() exposureChange: EventEmitter<ChangeContext> = new EventEmitter();
	@Output() exposureToggle: EventEmitter<any> = new EventEmitter();
	@Output() cameraAvailable: EventEmitter<boolean> = new EventEmitter();
	@Output() cameraDisable: EventEmitter<boolean> = new EventEmitter();
	public cameraDetail = new CameraDetail();
	private cameraPreview: ElementRef;
	private videoElement: HTMLVideoElement;
	private cameraDetailSubscription: Subscription;
	private logger: any;
	private Windows: any;
	private Capture: any;
	private DeviceInformation: any;
	private DeviceClass: any;
	private oMediaCapture: any;
	private visibilityChange: any;
	private cameraStreamStateChanged: any;

	public cameraErrorTitle: string;
	public cameraErrorDescription: string;
	public isCameraInErrorState = false;
	private isCameraInitialized = false;

	// Rotation metadata to apply to the preview stream and recorded videos (MF_MT_VIDEO_ROTATION)
	// Reference: http://msdn.microsoft.com/en-us/library/windows/apps/xaml/hh868174.aspx
	private readonly RotationKey = 'C380465D-2271-428C-9B83-ECEA3B4A85C1';
	private readonly orientationChangedEvent = 'orientationchanged';
	private readonly displayInformation: any;
	private orientationSensor: any;
	private deviceOrientation: any;
	private displayOrientation: any;
	private simpleOrientation: any;


	@ViewChild('cameraPreview', { static: false }) set content(content: ElementRef) {
		// when camera preview video element is visible then start camera feed
		this.cameraPreview = content;
		if (!this.isCameraInitialized) {
			if (content && !this.cameraDetail.isPrivacyModeEnabled) {
				this.initializeCameraAsync();
			} else {
				this.cleanupCameraAsync();
			}
		}
	}

	constructor(
		public cameraFeedService: CameraFeedService,
		public baseCameraDetail: BaseCameraDetail,
		private vantageShellService: VantageShellService,
		private appLogger: LoggerService,
		private ngZone: NgZone
	) {
		this.Windows = this.vantageShellService.getWindows();
		if (this.Windows) {
			this.Capture = this.Windows.Media.Capture;
			this.DeviceInformation = this.Windows.Devices.Enumeration.DeviceInformation;
			this.DeviceClass = this.Windows.Devices.Enumeration.DeviceClass;
			this.simpleOrientation = this.Windows.Devices.Sensors.SimpleOrientation;
			// this.deviceOrientation = this.Windows.Graphics.Display.DisplayOrientations.portrait;
			// this.displayInformation = this.Windows.Graphics.Display.DisplayInformation.getForCurrentView();
		}
	}

	ngOnInit() {
		//#region below logic required to re-enable camera feed when window is maximized from minimized state
		this.logger = this.vantageShellService.getLogger();
		this.logger.info('constructor camera');
		this.oMediaCapture = new this.Capture.MediaCapture();
		this.visibilityChange = this.onVisibilityChanged.bind(this);
		document.addEventListener('visibilitychange', this.visibilityChange);
		//#endregion

		//#region hook up orientation change event
		if (this.Windows) {
			this.oMediaCapture.addEventListener('camerastreamstatechanged', this.cameraStreamStateChanged);


			this.cameraStreamStateChanged = this.onCameraStreamStateChanged.bind(this);
			// display orientation changed like landscape to portrait and vice versa
			// this.displayInformation.addEventListener(this.orientationChangedEvent
			// 	, this.onDisplayOrientationChanged.bind(this));
		}
		//#endregion
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
		if (this.cameraDetailSubscription) {
			this.cameraDetailSubscription.unsubscribe();
		}
		document.removeEventListener('visibilitychange', this.visibilityChange);
		//#region unregister orientation change event
		if (this.Windows) {
			// this.displayInformation.removeEventListener(this.orientationChangedEvent, this.onDisplayOrientationChanged);
			if (this.orientationSensor != null) {
				this.orientationSensor.removeEventListener(this.orientationChangedEvent, this.onDeviceOrientationChanged);
			}
			this.oMediaCapture.removeEventListener('camerastreamstatechanged', this.cameraStreamStateChanged);
		}
		//#endregion
		this.cleanupCameraAsync();
	}

	private convertDisplayOrientationToDegrees(orientation) {
		switch (orientation) {
			case this.simpleOrientation.rotated90DegreesCounterclockwise:
				return 90;
			case this.simpleOrientation.rotated180DegreesCounterclockwise:
				return 180;
			case this.simpleOrientation.rotated270DegreesCounterclockwise:
				return 270;
			case this.simpleOrientation.notRotated:
			default:
				return 0;
		}
	}

	private async setCameraPreviewOrientation(orientationInDegrees: number) {
		console.log('CameraControlComponent.setCameraPreviewOrientation', orientationInDegrees);

		if (this.oMediaCapture && this.oMediaCapture.videoDeviceController) {
			const props = this.oMediaCapture.videoDeviceController.getMediaStreamProperties(this.Capture.MediaStreamType.videoPreview);
			props.properties.insert(this.RotationKey, orientationInDegrees);
			console.log('CameraControlComponent.MediaStreamProperties', props);
			await this.oMediaCapture.setEncodingPropertiesAsync(this.Capture.MediaStreamType.videoPreview, props, null);
		}
	}

	onDeviceOrientationChanged(args) {
		this.logger.info('CameraControlComponent.onDeviceOrientationChanged: ', args);

		if (args.orientation !== this.simpleOrientation.faceup
			&& args.orientation !== this.simpleOrientation.facedown) {
			this.deviceOrientation = args.orientation;
			const orientationDegree = this.convertDisplayOrientationToDegrees(this.deviceOrientation);
			// this.setCameraPreviewOrientation(orientationDegree);
		}
	}

	onCameraStreamStateChanged(eventArgs) {
		this.logger.info('CameraControlComponent.onCameraStreamStateChanged', eventArgs);
	}

	findCameraDeviceByPanelAsync(panel) {
		let deviceInfo = null;
		// Get available devices for capturing pictures
		return this.DeviceInformation.findAllAsync(this.DeviceClass.videoCapture)
			.then((devices) => {
				devices.forEach((cameraDeviceInfo) => {
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
		// const self = this;
		try {
			// Get available devices for capturing pictures
			return this.findCameraDeviceByPanelAsync(this.Windows.Devices.Enumeration.Panel.front)
				.then(async (camera) => {
					if (!camera) {
						this.ngZone.run(() => {
							this.cameraAvailable.emit(false);
						});
						return;
					}

					this.ngZone.run(() => {
						this.cameraAvailable.emit(true);
					});

					this.oMediaCapture = new this.Windows.Media.Capture.MediaCapture();
					// Register for a notification when something goes wrong
					// TODO: define the fail handle callback and show error message maybe... there's a chance another app is previewing camera, that's when failed happen.
					this.oMediaCapture.addEventListener('failed', (error) => {
						this.appLogger.error('failed to capture camera', error.code);
						this.cleanupCameraAsync();

						this.ngZone.run(() => {
							// Camera is in Use
							if (error.code === 3222091524) {
								this.isCameraInErrorState = true;
								this.cameraErrorTitle = 'device.deviceSettings.displayCamera.camera.cameraLoadingFailed.inUseTitle';
								this.cameraErrorDescription = 'device.deviceSettings.displayCamera.camera.cameraLoadingFailed.inUseDescription';
							} else if (error.code === 2147942405) {
								// disable camera access from system setting
								this.cameraDisable.emit(true);

							} else {
								this.isCameraInErrorState = true;
								this.cameraErrorTitle = 'device.deviceSettings.displayCamera.camera.cameraLoadingFailed.loadingFailedTitle';
								this.cameraErrorDescription = 'device.deviceSettings.displayCamera.camera.cameraLoadingFailed.loadingFailedDescription';
							}
						});
					});

					const settings = new this.Capture.MediaCaptureInitializationSettings();
					settings.videoDeviceId = camera.id;
					settings.streamingCaptureMode = 2; // video
					settings.photoCaptureSource = 0; // auto

					// Initialize media capture and start the preview
					return this.oMediaCapture.initializeAsync(settings);
				}, (error) => {
					this.isCameraInitialized = false;
					console.log(`findCameraDeviceByPanelAsync error ${error.message}`);
					this.ngZone.run(() => {
						this.disabledAll = true;
					});
				}).then(() => {
					this.isCameraInitialized = true;
					return this.startPreviewAsync();

				}).done();
		} catch (error) {
			this.disabledAll = true;
			console.log('initializeCameraAsync catch', error);
		}
	}

	startPreviewAsync() {
		this.ngZone.run(() => {
			const previewUrl = URL.createObjectURL(this.oMediaCapture);
			this.videoElement = this.cameraPreview.nativeElement;
			this.videoElement.src = previewUrl;
			this.videoElement.play();
			this.logger.info('CameraControlComponent.onOrientationChanged', { previewUrl, videoElement: this.videoElement });

			this.orientationSensor = this.Windows.Devices.Sensors.SimpleOrientationSensor.getDefault();
			if (this.orientationSensor != null) {
				this.deviceOrientation = this.orientationSensor.getCurrentOrientation();
				// when device rotation is detected by sensors, below event will be fired
				this.orientationSensor.addEventListener(this.orientationChangedEvent
					, this.onDeviceOrientationChanged.bind(this));
			}

			this.videoElement.addEventListener("playing", () => {
				// isPreviewing = true;
				return this.setCameraPreviewOrientation(180);
			});

		});
	}

	stopPreview() {
		this.ngZone.run(() => {
			// Cleanup the UI
			if (this.videoElement) {
				this.videoElement.pause();
				this.videoElement.src = '';
			}
		});
	}

	cleanupCameraAsync() {
		this.isCameraInitialized = false;
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
			if (!this.isCameraInitialized) {
				this.initializeCameraAsync();
			}
		}
	}



	public onAutoExposureChange($event: any) {
		try {
			console.log('onAutoExposureChange', this.cameraSettings.exposure);
			this.exposureToggle.emit($event);
		} catch (error) {
			this.appLogger.error('CameraControlComponent:onAutoExposureChange', error.message);
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
}
