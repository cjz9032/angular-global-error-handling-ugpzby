import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { EyeCareMode } from 'src/app/data-models/camera/eyeCareMode.model';

@Component({
  selector: 'vtr-display-color-temp',
  templateUrl: './display-color-temp.component.html',
  styleUrls: ['./display-color-temp.component.scss']
})
export class DisplayColorTempComponent implements OnInit {
  @Input() displayColorTempSettings: EyeCareMode;
	@Input() enableSlider: boolean;
	@Input() manualRefresh: any;


	constructor() { }

	ngOnInit() {
		console.log(this.displayColorTempSettings)
	 }

}
