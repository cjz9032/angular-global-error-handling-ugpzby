import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

import { CameraDetail } from 'src/app/data-models/camera/camera-detail.model';

/**
 * abstract class for camera service. this will help to swap service easily once API is ready and implemented in
 * camera.service.ts, for time being going to use camera.service.mock.ts
 */
@Injectable({
	providedIn: 'root',
})
export abstract class BaseCameraDetail {
	abstract cameraDetailObservable: Observable<CameraDetail>;
	abstract getCameraDetail(): Promise<CameraDetail>;
	abstract toggleCameraPrivacyMode(value: boolean): void;
	abstract toggleAutoExposure(value: boolean): void;
}
