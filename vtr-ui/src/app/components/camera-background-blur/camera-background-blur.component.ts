import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CameraBlur } from 'src/app/data-models/camera/camera-blur-model';

@Component({
	selector: 'vtr-camera-background-blur',
	templateUrl: './camera-background-blur.component.html',
	styleUrls: ['./camera-background-blur.component.scss']
})
export class CameraBackgroundBlurComponent implements OnInit {
	@Input() option = new CameraBlur();
	@Output() change = new EventEmitter<string>();

	constructor() { }

	ngOnInit() {
	}

	public onChange(mode: string) {
		this.change.emit(mode);
	}
}
