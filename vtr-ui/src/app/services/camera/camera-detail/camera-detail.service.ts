import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/internal/Subject';
import { Observable } from 'rxjs/internal/Observable';

import { BaseCameraDetail } from './base-camera-detail.service';
import { CameraDetail } from 'src/app/data-models/camera/camera-detail.model';

@Injectable({
	providedIn: 'root'
})
export class CameraDetailService implements BaseCameraDetail {
	public cameraDetailObservable: Observable<CameraDetail>;

	constructor(private http: HttpClient) {}

	public getCameraDetail(): Promise<CameraDetail> {
		return null;
	}

	toggleCameraPrivacyMode(value: boolean): void {}

	toggleAutoExposure(value: boolean): void {}
}
