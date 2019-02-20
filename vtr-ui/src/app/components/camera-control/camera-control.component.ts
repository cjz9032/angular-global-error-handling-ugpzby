import {
	Component,
	OnInit,
	Input,
	ViewChild,
	OnDestroy,
	ElementRef
} from '@angular/core';
import { CameraDetail } from 'src/app/data-models/camera/camera-detail.model';
import { CameraFeedService } from 'src/app/services/camera/camera-feed/camera-feed.service';
import { BaseCameraDetail } from 'src/app/services/camera/camera-detail/base-camera-detail.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
	selector: 'vtr-camera-control',
	templateUrl: './camera-control.component.html',
	styleUrls: ['./camera-control.component.scss']
})
export class CameraControlComponent implements OnInit, OnDestroy {
	private cameraPreview: ElementRef;
	@ViewChild('cameraPreview') set content(content: ElementRef) {
		// when camera preview video element is visible then start camera feed
		this.cameraPreview = content;
		if (content && !this.cameraDetail.isPrivacyModeEnabled) {
			this.activateCamera();
		} else {
			this.deactivateCamera();
		}
	}

	@Input() cameraDetail: CameraDetail;

	public dataSource: CameraDetail;
	private _video: HTMLVideoElement;
	private cameraDetailSubscription: Subscription;

	constructor(
		public cameraFeedService: CameraFeedService,
		public baseCameraDetail: BaseCameraDetail
	) {}

	ngOnInit() {
		this.cameraDetailSubscription = this.baseCameraDetail.cameraDetailObservable.subscribe(
			(cameraDetail: CameraDetail) => {
				this.dataSource = cameraDetail;
			},
			error => {
				console.log(error);
			}
		);
	}

	ngOnDestroy() {
		this.deactivateCamera();
		this.cameraDetailSubscription.unsubscribe();
	}

	public onAutoExposureChange($event: any) {
		this.baseCameraDetail.toggleAutoExposure($event.switchValue);
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
}
