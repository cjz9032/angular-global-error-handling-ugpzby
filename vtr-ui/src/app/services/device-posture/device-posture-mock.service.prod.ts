import { Injectable } from '@angular/core';
import { DevicePosture } from '@lenovo/tan-client-bridge';

@Injectable({
	providedIn: 'root',
})
export class DevicePostureMockService {
	public getDevicePosture(): DevicePosture {
		return undefined;
	}
}
