import {
	Component,
	OnInit,
	Input,
	ViewChild,
	OnDestroy,
	OnChanges,
	SimpleChanges,
	AfterViewInit
} from '@angular/core';
import { CameraDetail } from 'src/app/data-models/camera/camera-detail.model';
import { CameraFeedService } from 'src/app/services/camera/camera-feed/camera-feed.service';
import { BaseCameraDetail } from 'src/app/services/camera/camera-detail/base-camera-detail.service';
import { CameraDetailMockService } from 'src/app/services/camera/camera-detail/camera-detail.mock.service';

@Component({
	selector: 'vtr-camera-control',
	templateUrl: './camera-control.component.html',
	styleUrls: ['./camera-control.component.scss'],
	providers: [
		{ provide: BaseCameraDetail, useClass: CameraDetailMockService }
	]
})
export class CameraControlComponent
	implements OnInit, OnDestroy, OnChanges, AfterViewInit {
	@ViewChild('cameraPreview') cameraPreview: any;
	@Input() cameraDetail: CameraDetail;

	public dataSource: CameraDetail;
	private _video: HTMLVideoElement;

	constructor(
		public cameraFeedService: CameraFeedService,
		public baseCameraDetail: BaseCameraDetail
	) {
		this.dataSource = new CameraDetail();
	}

	ngOnInit() {
		this.dataSource = this.cameraDetail;
	}

	ngAfterViewInit(): void {
		this._video = this.cameraPreview.nativeElement;
	}

	ngOnDestroy() {
		this.deactivateCamera();
	}

	ngOnChanges(changes: SimpleChanges): void {
		console.log(changes);

		// if (changes['cameraDetail']) {
		// 	if (!this.dataSource.isPrivacyModeEnabled) {
		// 		this.activateCamera();
		// 	} else {
		// 		this.deactivateCamera();
		// 	}
		// }
	}

	public onAutoExposureChange($event: any) {
		this.dataSource.isAutoExposureEnabled = !$event.switchValue;
	}

	private activateCamera() {
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
		this._video.pause();
	}
}
