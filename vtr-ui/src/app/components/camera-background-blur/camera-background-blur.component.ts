import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'vtr-camera-background-blur',
  templateUrl: './camera-background-blur.component.html',
  styleUrls: ['./camera-background-blur.component.scss']
})
export class CameraBackgroundBlurComponent implements OnInit {
	@Input() showHideCameraBackground: boolean;
	public imageMode = 'blur';

  constructor() { }

  ngOnInit() {
  }

  public onChange(event) {
	this.imageMode = event;
	//console.log('Hello:', this.imageMode );
  }
}
