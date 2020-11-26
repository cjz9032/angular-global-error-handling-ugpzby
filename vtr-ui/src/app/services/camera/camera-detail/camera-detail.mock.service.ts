import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

import { BaseCameraDetail } from './base-camera-detail.service';
import { CameraDetail } from 'src/app/data-models/camera/camera-detail.model';

@Injectable({
	providedIn: 'root',
})
export class CameraDetailMockService implements BaseCameraDetail {
	private cameraDetail: CameraDetail;
	public cameraDetailObservable: Observable<CameraDetail>;
	private cameraDetailSubject: BehaviorSubject<CameraDetail>;

	constructor(private http: HttpClient) {
		this.cameraDetailSubject = new BehaviorSubject<CameraDetail>(new CameraDetail());
		this.cameraDetailObservable = this.cameraDetailSubject;
	}

	public getCameraDetail(): Promise<CameraDetail> {
		return new Promise<CameraDetail>((resolve, reject) => {
			if (this.cameraDetail) {
				resolve(this.cameraDetail);
			} else {
				this.getCameraDetailFromAPI().subscribe(
					(response: CameraDetail) => {
						this.cameraDetail = response;
						this.notifyChanges();
						resolve(response);
					},
					(error) => {
						reject(error);
					}
				);
			}
		});
	}

	toggleCameraPrivacyMode(value: boolean): void {
		if (this.cameraDetail) {
			this.cameraDetail.isPrivacyModeEnabled = value;
			this.notifyChanges();
		}
	}

	toggleAutoExposure(value: boolean): void {
		if (this.cameraDetail) {
			this.cameraDetail.isAutoExposureEnabled = value;
			this.notifyChanges();
		}
	}

	private getCameraDetailFromAPI(): Observable<CameraDetail> {
		return this.http.get<CameraDetail>(`mock-api/camera.mock.json`);
	}

	private notifyChanges() {
		this.cameraDetailSubject.next(this.cameraDetail);
	}
}
