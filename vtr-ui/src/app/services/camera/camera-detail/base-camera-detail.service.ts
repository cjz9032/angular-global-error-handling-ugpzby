import { Injectable } from '@angular/core';

import { CameraDetail } from 'src/app/data-models/camera/camera-detail.model';

/**
 * abstract class for camera service. this will help to swap service easily once API is ready and implemented in
 * camera.service.ts, for time being going to use camera.service.mock.ts
 */
@Injectable({
	providedIn: 'root'
})
export abstract class BaseCameraDetail {
	abstract cameraDetail: CameraDetail;
	abstract getCameraDetail(): Promise<CameraDetail>;
	/**
	 * this function set cameraDetail variable with passed param value.
	 * this local variable will be used as cached CameraDetail which can be used by other components.
	 * @param cameraDetail CameraDetail object
	 */
	abstract setCameraDetail(cameraDetail: CameraDetail): void;
}
