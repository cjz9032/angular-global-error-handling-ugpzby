import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class CameraFeedService {
	private _stream: MediaStream;

	constructor() {}

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
}
