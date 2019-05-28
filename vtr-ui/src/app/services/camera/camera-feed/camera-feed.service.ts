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

	public activateCamera(): Promise<MediaStream> {
		return window.navigator.mediaDevices.getUserMedia({
			video: true
		});
	}

	public deactivateCamera(): void {
		if (this._stream) {
			this._stream.getTracks()[0].stop();
		}
	}

	public getStream(): MediaStream {
		return this._stream;
	}

	public setStream(stream: MediaStream): void {
		this._stream = stream;
	}

	public getCameraBlurSettings(): Promise<any> {
		if (this.cameraBlur) {
			return this.cameraBlur.getCameraBlurSettings();
		}
		return undefined;
	}

	public setCameraBlurSettings(isEnabling: boolean, mode: string): Promise<any> {
		console.log("setCameraBlurSettings: " + isEnabling + ", " + mode );
		if (this.cameraBlur) {
			if (mode == "") {
				const enable = isEnabling ? '1' : '0';
				return this.cameraBlur.setCameraBlurSettings(true, enable);
			} else {
				return this.cameraBlur.setCameraBlurSettings(false, mode);
			}
		}
		return undefined;
	}
}
