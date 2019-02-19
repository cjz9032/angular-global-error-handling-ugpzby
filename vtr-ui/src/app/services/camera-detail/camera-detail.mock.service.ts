import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

import { BaseCameraDetail } from './base-camera-detail.service';
import { CameraDetail } from 'src/app/data-models/camera/camera-detail.model';

@Injectable({
	providedIn: 'root'
})
export class CameraDetailMockService implements BaseCameraDetail {
	constructor(private http: HttpClient) {}

	public getCameraDetails(): Observable<CameraDetail> {
		return this.http.get<CameraDetail>(`api/camera.mock.json`);
	}
}
