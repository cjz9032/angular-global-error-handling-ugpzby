import { Component, OnInit, Input, ViewChild, OnDestroy, ElementRef, Output, EventEmitter } from '@angular/core';
import { CameraDetail, ICameraSettingsResponse } from 'src/app/data-models/camera/camera-detail.model';
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
	@Output() brightnessChange: EventEmitter<ChangeContext> = new EventEmitter();
	@Output() contrastChange: EventEmitter<ChangeContext> = new EventEmitter();
	@Output() exposureChange: EventEmitter<ChangeContext> = new EventEmitter();
	@Output() exposureToggle: EventEmitter<any> = new EventEmitter();
	public cameraDetail: CameraDetail;
	public showAutoExposureSlider: boolean;

	private cameraPreview: ElementRef;
	private _video: HTMLVideoElement;
	private cameraDetailSubscription: Subscription;
	private systemMediaControls: any;
	private media: any;
	private logger: any;
	private Windows: any;
	private Capture: any;
	private DeviceInformation: any;
	private DeviceClass: any;

	// private Capture = Windows.Media.Capture;
	// private DeviceInformation = Windows.Devices.Enumeration.DeviceInformation;
	// private DeviceClass = Windows.Devices.Enumeration.DeviceClass;
	// private DisplayOrientations = Windows.Graphics.Display.DisplayOrientations;
	// private Imaging = Windows.Graphics.Imaging;
	// private Media = Windows.Media;
	// private StorageLibrary = Windows.Storage.StorageLibrary;
	// private KnownLibraryId = Windows.Storage.KnownLibraryId;
	// private ApplicationData = Windows.Storage.ApplicationData;
	private oDisplayRequest: any;
	private oMediaCapture: any;

	@ViewChild('cameraPreview') set content(content: ElementRef) {
		// when camera preview video element is visible then start camera feed
		this.cameraPreview = content;
		if (content && !this.cameraDetail.isPrivacyModeEnabled) {
			console.log('Activating Camera');
			// this.activateCamera();
			this.initializeCameraAsync();
		} else {
			console.log('De-Activating Camera');
			this.deactivateCamera();
		}
	}

	constructor(
		public cameraFeedService: CameraFeedService,
		public baseCameraDetail: BaseCameraDetail,
		private vantageShellService: VantageShellService
	) {
		debugger;
		this.Windows = vantageShellService.getWindows();
		this.Capture = this.Windows.Media.Capture;
		this.DeviceInformation = this.Windows.Devices.Enumeration.DeviceInformation;
		this.DeviceClass = this.Windows.Devices.Enumeration.DeviceClass;
		// this.cameraDetail = new CameraDetail();

		//#region below logic required to re-enable camera feed when window is maximized from minimized state
		this.logger = this.vantageShellService.getLogger();
		this.logger.info('constructor camera');
		this.oDisplayRequest = new this.Windows.System.Display.DisplayRequest();
		this.oMediaCapture = new this.Capture.MediaCapture();

		this.media = this.getMedia();
		if (this.media) {
			// this.systemMediaControls = this.media.SystemMediaTransportControls.getForCurrentView();
			// this.systemMediaControls.addEventListener(
			// 	'propertychanged',
			// 	(args: any) => {
			// 		this.systemMediaControls_propertyChanged(args);
			// 	}
			// );
			document.addEventListener('visibilitychange', this.onVisibilityChanged.bind(this));
			// Windows.UI.WebUI.WebUIApplication.addEventListener("resuming", function () {
			//    this.initializeCameraAsync();
			// }, false);

			// Windows.UI.WebUI.WebUIApplication.addEventListener("suspending", function (args) {
			// 	let deffer=args.suspendingOperation.getDeferral();
			// 	this.cleanupCameraAsync().done(()=>{
			// 		deffer.complete();
			// 	});
			// }, false);
		}

		//#endregion
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
			});
	}

	initializeCameraAsync() {
		console.log('InitializeCameraAsync');
		const self = this;
		// Get available devices for capturing pictures
		return this.findCameraDeviceByPanelAsync(this.Windows.Devices.Enumeration.Panel.back)
			.then(function (camera) {
				if (!camera) {
					console.log('No camera device found!');
					return;
				}
				// Figure out where the camera is located
				if (!camera.enclosureLocation || camera.enclosureLocation.panel === this.Windows.Devices.Enumeration.Panel.unknown) {
					// No information on the location of the camera, assume it's an external camera, not integrated on the device
					//  externalCamera = true;
				} else {
					// Camera is fixed on the device
					// externalCamera = false;

					// Only mirror the preview if the camera is on the front panel
					//  mirroringPreview = (camera.enclosureLocation.panel === Windows.Devices.Enumeration.Panel.front);
				}

				self.oMediaCapture = new this.Windows.Media.Capture.MediaCapture();

				// Register for a notification when something goes wrong
				self.oMediaCapture.addEventListener('failed', () => { });

				const settings = new self.Capture.MediaCaptureInitializationSettings();
				settings.videoDeviceId = camera.id;

				// Initialize media capture and start the preview
				return self.oMediaCapture.initializeAsync(settings);
			}, function (error) {
				console.log(error.message);
			}).then(function () {
				return self.startPreviewAsync();
			}).done();
	}

	startPreviewAsync() {
		const previewUrl = URL.createObjectURL(this.oMediaCapture);
		this._video = this.cameraPreview.nativeElement;
		this._video.src = previewUrl;
		this._video.play();
	}

	stopPreview() {
		// Cleanup the UI
		this._video.pause();
		this._video.src = '';
		// Allow the device screen to sleep now that the preview is stopped
		//  this.oDisplayRequest.requestRelease();
	}

	cleanupCameraAsync() {
		console.log('cleanupCameraAsync');
		const promiseList = {};
		this.stopPreview();

		if (this.oMediaCapture != null) {
			this.oMediaCapture.close();
			this.oMediaCapture = null;
		}
	}

	onVisibilityChanged() {
		if (document.hidden) {
			// this.ngOnDestroy();
			this.cleanupCameraAsync();
		} else {
			// this.ngOnInit();
			// this.activateCamera();
			this.initializeCameraAsync();
		}
	}

	ngOnInit() {
		console.log('camera control onInit');
		this.cameraDetailSubscription = this.baseCameraDetail.cameraDetailObservable.subscribe(
			(cameraDetail: CameraDetail) => {
				console.log('camera detail observable', cameraDetail);
				this.cameraDetail = cameraDetail;
			},
			error => {
				console.log(error);
			}
		);
	}

	ngOnDestroy() {
		this.deactivateCamera();
		if (this.baseCameraDetail) {
			this.cameraDetailSubscription.unsubscribe();
		}
		if (this._video.src !== '') {
			this.cleanupCameraAsync();
		}
		// if (this.systemMediaControls) {
		// 	this.systemMediaControls.removeEventListener(
		// 		'propertychanged',
		// 		this.systemMediaControls_propertyChanged
		// 	);
		// }
	}

	public onAutoExposureChange($event: any) {
		try {
			this.showAutoExposureSlider = !$event.switchValue;
			// this.baseCameraDetail.toggleAutoExposure($event.switchValue);
			this.exposureToggle.emit($event);
		} catch (error) {
			console.error(error.message);
		}
	}

	private activateCamera() {
		this._video = this.cameraPreview.nativeElement;
		this.cameraFeedService
			.activateCamera()
			.then((stream: MediaStream) => {
				this.cameraFeedService.setStream(stream);
				this._video.srcObject = stream;
				this._video.play();
			})
			.catch(console.error);
	}

	private deactivateCamera() {

		if (this._video) {
			this._video.srcObject = null;
			this._video.pause();
		}
		this.logger.info('video stoped');

		this.cameraFeedService.deactivateCamera();
		this.logger.info('deactived camera');
	}

	// return Media object from WinJS library
	private getMedia(): any {
		const win: any = window;
		if (win.Windows) {
			return win.Windows.Media;
		}
		return null;
	}

	/**
	 * Check to see if the app is being muted. If so, it is being minimized.
     * Otherwise if it is not initialized, it is being brought into focus.
	 * @param args argument received from WinJS propertyChanged event
	 */
	private systemMediaControls_propertyChanged(args: any) {
		console.log('systemMediaControls_propertyChanged', args);
		const win: any = window;
		if (win.Windows) {
			if (args.target.soundLevel === win.Windows.Media.SoundLevel.muted) {
				this.deactivateCamera();
			} else if (!this.cameraDetail.isPrivacyModeEnabled) {
				this.activateCamera();
			}
		}
	}
	public onBrightnessSliderChange($event: ChangeContext) {
		console.log('Brightness changed', event);
		this.brightnessChange.emit($event);
	}
	public onContrastSliderChange($event: ChangeContext) {
		console.log('Contrast changed', event);
		this.contrastChange.emit($event);
	}
	public onExposureSliderChange($event: ChangeContext) {
		console.log('exposure changed', event);
		this.exposureChange.emit($event);
	}
}
