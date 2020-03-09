import { Injectable } from '@angular/core';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';

@Injectable({
	providedIn: 'root'
})
export class CameraFeedService {
	private _stream: MediaStream;
	public isShellAvailable = false;
	private cameraBlur: any;

	constructor(shellService: VantageShellService) {
		this.cameraBlur = shellService.getCameraBlur();

		if (this.cameraBlur) {
			this.isShellAvailable = true;
		}
	}

	public getCameraBlurSettings(): Promise<any> {
		if (this.cameraBlur) {
			return this.cameraBlur.getCameraBlurSettings();
		}
		return undefined;
	}

	public setCameraBlurSettings(isEnabling: boolean, mode: string): Promise<any> {
        if (this.cameraBlur) {
			if (mode === '') {
				const enable = isEnabling ? '1' : '0';
				return this.cameraBlur.setCameraBlurSettings(true, enable);
			} else {
				return this.cameraBlur.setCameraBlurSettings(false, mode);
			}
		}
        return undefined;
    }
}
