import { Component, OnInit, Input, ViewChild, OnDestroy, ElementRef, Output, EventEmitter } from '@angular/core';
import { CameraDetail, ICameraSettingsResponse } from 'src/app/data-models/camera/camera-detail.model';
import { CameraFeedService } from 'src/app/services/camera/camera-feed/camera-feed.service';
import { BaseCameraDetail } from 'src/app/services/camera/camera-detail/base-camera-detail.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { ChangeContext } from 'ng5-slider';

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
	public cameraDetail: CameraDetail;
	public showAutoExposureSlider: boolean;

	private cameraPreview: ElementRef;
	private _video: HTMLVideoElement;
	private cameraDetailSubscription: Subscription;
	private systemMediaControls: any;
	private media: any;


	@ViewChild('cameraPreview') set content(content: ElementRef) {
		// when camera preview video element is visible then start camera feed
		this.cameraPreview = content;
		if (content && !this.cameraDetail.isPrivacyModeEnabled) {
			console.log('Activating Camera');
			this.activateCamera();
		} else {
			console.log('De-Activating Camera');
			this.deactivateCamera();
		}
	}

	constructor(
		public cameraFeedService: CameraFeedService,
		public baseCameraDetail: BaseCameraDetail
	) {
		// this.cameraDetail = new CameraDetail();

		//#region below logic required to re-enable camera feed when window is maximized from minimized state

		this.media = this.getMedia();
		if (this.media) {
			this.systemMediaControls = this.media.SystemMediaTransportControls.getForCurrentView();
			this.systemMediaControls.addEventListener(
				'propertychanged',
				(args: any) => {
					this.systemMediaControls_propertyChanged(args);
				}
			);
		}

		//#endregion
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
		if (this.systemMediaControls) {
			this.systemMediaControls.removeEventListener(
				'propertychanged',
				this.systemMediaControls_propertyChanged
			);
		}
	}

	public onAutoExposureChange($event: any) {
		try {
			this.showAutoExposureSlider = !$event.switchValue;
			this.baseCameraDetail.toggleAutoExposure($event.switchValue);
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
		this.cameraFeedService.deactivateCamera();
		if (this._video) {
			this._video.pause();
		}
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
