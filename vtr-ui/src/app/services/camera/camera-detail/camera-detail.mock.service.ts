import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

import { BaseCameraDetail } from './base-camera-detail.service';
import { CameraDetail } from 'src/app/data-models/camera/camera-detail.model';

@Injectable({
	providedIn: 'root'
})
export class CameraDetailMockService implements BaseCameraDetail {
	cameraDetail: CameraDetail;

	constructor(private http: HttpClient) {}

	public getCameraDetail(): Promise<CameraDetail> {
		return new Promise<CameraDetail>((resolve, reject) => {
			if (this.cameraDetail) {
				resolve(this.cameraDetail);
			} else {
				this.getCameraDetailFromAPI().subscribe(
					(response: CameraDetail) => {
						this.cameraDetail = response;
						resolve(this.cameraDetail);
					},
					error => {
						reject(error);
					}
				);
			}
		});
	}

	public setCameraDetail(cameraDetail: CameraDetail): void {
		this.cameraDetail = cameraDetail;
	}

	private getCameraDetailFromAPI(): Observable<CameraDetail> {
		return this.http.get<CameraDetail>(`api/camera.mock.json`);
	}
}
