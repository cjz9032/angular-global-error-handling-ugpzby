import {
	Component,
	OnInit,
	Input,
	ViewChild,
	OnDestroy,
	ElementRef,
	Output,
	EventEmitter,
	NgZone,
	HostListener,
} from '@angular/core';
import {
	CameraDetail,
	CameraSettingsResponse,
	CameraFeatureAccess,
} from 'src/app/data-models/camera/camera-detail.model';
import { CameraFeedService } from 'src/app/services/camera/camera-feed/camera-feed.service';
import { BaseCameraDetail } from 'src/app/services/camera/camera-detail/base-camera-detail.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import CommonMetricsModel from 'src/app/data-models/common/common-metrics.model';

@Component({
	selector: 'vtr-camera-control',
	templateUrl: './camera-control.component.html',
	styleUrls: ['./camera-control.component.scss'],
})
export class CameraControlComponent implements OnInit, OnDestroy {
	@Input() cameraSettings: CameraSettingsResponse = new CameraSettingsResponse();
	@Input() cameraFeatureAccess: CameraFeatureAccess;
	@Input() manualRefresh: any;
	@Input() disabledAll = false;
	@Output() brightnessChange: EventEmitter<number> = new EventEmitter();
	@Output() contrastChange: EventEmitter<number> = new EventEmitter();
	@Output() exposureChange: EventEmitter<number> = new EventEmitter();
	@Output() exposureToggle: EventEmitter<any> = new EventEmitter();
	@Output() cameraAvailable: EventEmitter<boolean> = new EventEmitter();
	@Output() cameraDisable: EventEmitter<boolean> = new EventEmitter();
	public cameraDetail = new CameraDetail();
	private cameraPreview: ElementRef;
	private videoElement: HTMLVideoElement;
	private cameraDetailSubscription: Subscription;
	private Windows: any;
	private Capture: any;
	private DeviceInformation: any;
	private DeviceClass: any;
	private oMediaCapture: any;
	private videoPreviewEvent: any;
	private cameraStreamStateChanged: any;
	public cameraErrorTitle: string;
	public cameraErrorDescription: string;
	public isCameraInErrorState = false;
	private isCameraInitialized = false;

	// Rotation metadata to apply to the preview stream and recorded videos (MF_MT_VIDEO_ROTATION)
	// Reference: http://msdn.microsoft.com/en-us/library/windows/apps/xaml/hh868174.aspx
	private readonly RotationKey = 'C380465D-2271-428C-9B83-ECEA3B4A85C1';
	private readonly orientationChangedEvent = 'orientationchanged';
	private orientationEvent: any;
	private orientationSensor: any;
	private deviceOrientation: any;
	private simpleOrientation: any;
	public readonly metricsParent = CommonMetricsModel.ParentDeviceSettings;

	@ViewChild('cameraPreview', { static: false }) set content(content: ElementRef) {
		// when camera preview video element is visible then start camera feed
		if (content) {
			this.cameraPreview = content;
			if (!this.isCameraInitialized) {
				if (content && !this.cameraDetail.isPrivacyModeEnabled) {
					this.initializeCameraAsync('ViewChild.cameraPreview');
				} else {
					this.cleanupCameraAsync('ViewChild.cameraPreview');
				}
			}
		}
	}

	constructor(
		public cameraFeedService: CameraFeedService,
		public baseCameraDetail: BaseCameraDetail,
		private vantageShellService: VantageShellService,
		private logger: LoggerService,
		private ngZone: NgZone
	) {
		this.Windows = this.vantageShellService.getWindows();
		if (this.Windows) {
			this.Capture = this.Windows.Media.Capture;
			this.DeviceInformation = this.Windows.Devices.Enumeration.DeviceInformation;
			this.DeviceClass = this.Windows.Devices.Enumeration.DeviceClass;
			this.simpleOrientation = this.Windows.Devices.Sensors.SimpleOrientation;
		}
	}

	ngOnInit() {
		//#region below logic required to re-enable camera feed when window is maximized from minimized state
		this.logger.info('constructor camera');
		this.oMediaCapture = new this.Capture.MediaCapture();
		//#endregion

		//#region hook up orientation change event
		if (this.Windows) {
			this.cameraStreamStateChanged = this.onCameraStreamStateChanged.bind(this);
			this.oMediaCapture.addEventListener(
				'camerastreamstatechanged',
				this.cameraStreamStateChanged
			);
			this.orientationSensor = this.Windows.Devices.Sensors.SimpleOrientationSensor.getDefault();
		}
		//#endregion
		this.cameraDetailSubscription = this.baseCameraDetail.cameraDetailObservable.subscribe(
			(cameraDetail: CameraDetail) => {
				this.cameraDetail = cameraDetail;
			},
			(error) => {
				this.logger.info(error);
			}
		);
	}

	ngOnDestroy() {
		if (this.cameraDetailSubscription) {
			this.cameraDetailSubscription.unsubscribe();
		}

		//#region unregister orientation change event
		if (this.orientationSensor != null) {
			this.orientationSensor.removeEventListener(
				this.orientationChangedEvent,
				this.orientationEvent
			);
		}
		if (this.oMediaCapture) {
			this.oMediaCapture.removeEventListener(
				'camerastreamstatechanged',
				this.cameraStreamStateChanged
			);
		}
		//#endregion
		this.cleanupCameraAsync('ngOnDestroy');
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
		if (this.oMediaCapture && this.oMediaCapture.videoDeviceController) {
			const props = this.oMediaCapture.videoDeviceController.getMediaStreamProperties(
				this.Capture.MediaStreamType.videoPreview
			);
			props.properties.insert(this.RotationKey, orientationInDegrees);
			await this.oMediaCapture.setEncodingPropertiesAsync(
				this.Capture.MediaStreamType.videoPreview,
				props,
				null
			);
		}
	}

	onDeviceOrientationChanged(args) {
		this.logger.info('CameraControlComponent.onDeviceOrientationChanged: ', args);

		if (
			args.orientation !== this.simpleOrientation.faceup &&
			args.orientation !== this.simpleOrientation.facedown
		) {
			this.deviceOrientation = args.orientation;
			const orientationDegree = this.convertDisplayOrientationToDegrees(
				this.deviceOrientation
			);
			this.setCameraPreviewOrientation(orientationDegree);
		}
	}

	onCameraStreamStateChanged(eventArgs) {
		this.logger.info('CameraControlComponent.onCameraStreamStateChanged', eventArgs);
	}

	findCameraDeviceByPanelAsync(panel) {
		let deviceInfo = null;
		// Get available devices for capturing pictures
		return this.DeviceInformation.findAllAsync(this.DeviceClass.videoCapture).then(
			(devices) => {
				devices.forEach((cameraDeviceInfo) => {
					if (
						cameraDeviceInfo.enclosureLocation != null &&
						cameraDeviceInfo.enclosureLocation.panel === panel
					) {
						deviceInfo = cameraDeviceInfo;
						return;
					}
				});

				// Nothing matched, just return the first
				if (!deviceInfo && devices.length > 0) {
					deviceInfo = devices.getAt(0);
				}
				return deviceInfo;
			},
			(error) => {
				this.disabledAll = true;
				this.logger.info('findCameraDeviceByPanelAsync error ', error.message);
			}
		);
	}

	initializeCameraAsync(source: string) {
		this.isCameraInitialized = true;
		this.logger.info('InitializeCameraAsync', source);
		// const self = this;
		try {
			// Get available devices for capturing pictures
			return this.findCameraDeviceByPanelAsync(this.Windows.Devices.Enumeration.Panel.front)
				.then(
					async (camera) => {
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
						// define the fail handle callback and show error message maybe... there's a chance another app is previewing camera, that's when failed happen.
						this.oMediaCapture.addEventListener('failed', (error) => {
							this.logger.error(
								'CameraControlComponent.MediaCaptureFailed event',
								error
							);
							this.cleanupCameraAsync('findCameraDeviceByPanelAsync.failed');

							this.ngZone.run(() => {
								// Camera is in Use
								if (error.code === 3222091524) {
									this.isCameraInErrorState = true;
									this.cameraErrorTitle =
										'device.deviceSettings.displayCamera.camera.cameraLoadingFailed.inUseTitle';
									this.cameraErrorDescription =
										'device.deviceSettings.displayCamera.camera.cameraLoadingFailed.inUseDescription';
								} else if (error.code === 2147942405) {
									// disable camera access from system setting
									this.cameraDisable.emit(true);
								} else {
									this.isCameraInErrorState = true;
									this.cameraErrorTitle =
										'device.deviceSettings.displayCamera.camera.cameraLoadingFailed.loadingFailedTitle';
									this.cameraErrorDescription =
										'device.deviceSettings.displayCamera.camera.cameraLoadingFailed.loadingFailedDescription';
									this.logger.error(
										'CameraControlComponent.MediaCaptureFailed try to reinitialize once',
										error
									);
									this.initializeCameraAsync('oMediaCapture.failed');
								}
							});
						});

						const settings = new this.Capture.MediaCaptureInitializationSettings();
						settings.videoDeviceId = camera.id;
						settings.streamingCaptureMode = 2;
						settings.photoCaptureSource = 0; // auto

						// Initialize media capture and start the preview
						return this.oMediaCapture.initializeAsync(settings);
					},
					(error) => {
						this.isCameraInitialized = false;
						this.logger.info('findCameraDeviceByPanelAsync error', error.message);
						this.ngZone.run(() => {
							this.disabledAll = true;
						});
					}
				)
				.then(() => {
					// this.isCameraInitialized = true;
					let allProperties = this.oMediaCapture.videoDeviceController.getAvailableMediaStreamProperties(
						this.Capture.MediaStreamType.videoPreview
					);
					return this.startPreviewAsync(
						this.oMediaCapture,
						this.Capture.MediaStreamType.videoPreview,
						allProperties[0]
					);
				})
				.done();
		} catch (error) {
			this.disabledAll = true;
			this.logger.info('initializeCameraAsync catch', error);
		}
	}

	startPreviewAsync(mediaCapture, streamType, encodingProperties) {
		this.ngZone.run(() => {
			return mediaCapture.videoDeviceController
				.setMediaStreamPropertiesAsync(streamType, encodingProperties)
				.then(() => {
					const previewUrl = URL.createObjectURL(mediaCapture);
					this.videoElement = this.cameraPreview.nativeElement;
					this.videoElement.src = previewUrl;
					this.videoElement.play();
					this.videoPreviewEvent = this.videoPreviewPlaying.bind(this);
					this.videoElement.addEventListener('playing', this.videoPreviewEvent);
					this.logger.info('CameraControlComponent.startPreviewAsync', {
						previewUrl,
						videoElement: this.videoElement,
					});
				});
		});
	}

	videoPreviewPlaying() {
		if (this.orientationSensor) {
			this.deviceOrientation = this.orientationSensor.getCurrentOrientation();
			this.orientationEvent = this.onDeviceOrientationChanged.bind(this);
			// when device rotation is detected by sensors, below event will be fired
			this.orientationSensor.addEventListener(
				this.orientationChangedEvent,
				this.orientationEvent
			);
		}
	}

	stopPreview() {
		this.ngZone.run(() => {
			// Cleanup the UI
			if (this.videoElement) {
				this.videoElement.removeEventListener('playing', this.videoPreviewEvent);
				this.videoElement.pause();
				this.videoElement.src = '';
			}
		});
	}

	cleanupCameraAsync(source: string) {
		this.isCameraInitialized = false;
		this.logger.info('CameraControlComponent.cleanupCameraAsync', source);
		this.stopPreview();

		if (this.oMediaCapture) {
			this.oMediaCapture.close();
			this.oMediaCapture = null;
		}
	}

	@HostListener('document: visibilitychange')
	onVisibilityChange(): void {
		const visibility = document.visibilityState;
		this.logger.info('CameraControlComponent.onVisibilityChange', {
			visibility,
			isCameraInitialized: this.isCameraInitialized,
		});

		if (visibility.toLowerCase() === 'visible') {
			if (!this.isCameraInitialized) {
				this.isCameraInErrorState = false;
				this.initializeCameraAsync('onVisibilityChange');
			}
		} else {
			this.cleanupCameraAsync('onVisibilityChange');
		}
	}

	public onAutoExposureChange($event: any) {
		try {
			this.logger.info(
				'CameraControlComponent.onAutoExposureChange',
				this.cameraSettings.exposure
			);
			this.exposureToggle.emit($event);
		} catch (error) {
			this.logger.error('CameraControlComponent.onAutoExposureChange', error.message);
		}
	}

	public onBrightnessSliderChange($event: number) {
		const value = $event;
		this.logger.info('CameraControlComponent.Brightness changed', value);
		this.cameraSettings.brightness.value = value;
		this.brightnessChange.emit(value);
	}
	public onContrastSliderChange($event: number) {
		const value = $event;
		this.logger.info('CameraControlComponent.Contrast changed', value);
		this.cameraSettings.contrast.value = value;
		this.contrastChange.emit(value);
	}
	public onExposureSliderChange($event: number) {
		const value = $event;
		this.logger.info('CameraControlComponent.Exposure changed', value);
		this.cameraSettings.exposure.value = value;
		this.exposureChange.emit(value);
	}
}
