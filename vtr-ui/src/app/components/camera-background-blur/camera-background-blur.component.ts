import { Component, OnInit, Input } from '@angular/core';
import { CameraFeedService } from 'src/app/services/camera/camera-feed/camera-feed.service';

@Component({
	selector: 'vtr-camera-background-blur',
	templateUrl: './camera-background-blur.component.html',
	styleUrls: ['./camera-background-blur.component.scss']
})
export class CameraBackgroundBlurComponent implements OnInit {
	@Input() showHideCameraBackground: boolean;
	public imageMode = 'blur';

	constructor(private cameraFeedService: CameraFeedService) { }

	ngOnInit() {
		this.initCameraBlurMethods();
	}

	private initCameraBlurMethods() {
		if (this.cameraFeedService.isShellAvailable) {
			this.cameraFeedService.getCameraBlurSettings()
				.then(response => {
					console.log('getCameraBlurSettings', response);

				}).catch(error => {
					console.log('getCameraBlurSettings', error);

				});
		}
	}

	public onChange(event) {
		this.imageMode = event;
		// console.log('Hello:', this.imageMode );
	}
}
