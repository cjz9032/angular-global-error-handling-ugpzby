import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { EyeCareMode } from 'src/app/data-models/camera/eyeCareMode.model';
import { ChangeContext } from 'ng5-slider';

@Component({
	selector: 'vtr-display-color-temp',
	templateUrl: './display-color-temp.component.html',
	styleUrls: ['./display-color-temp.component.scss']
})
export class DisplayColorTempComponent implements OnInit {
	@Input() displayColorTempSettings: EyeCareMode;
	@Input() enableSlider: boolean;
	@Input() disableReset = false;
	@Input() manualRefresh: any;
	@Output() displayColorTempChange: EventEmitter<ChangeContext> = new EventEmitter();
	@Output() resetTemparature: EventEmitter<any> = new EventEmitter();
	@Output() colorPreviewValue: EventEmitter<ChangeContext> = new EventEmitter();


	constructor() { }

	ngOnInit() {}

	public onDisplayColorTemparatureChange($event: ChangeContext) {
		this.displayColorTempChange.emit($event);
	}

	public onResetTemparature($event: any) {
        this.resetTemparature.emit($event);
    }

	public dragChangeValue($event: any) {
		this.colorPreviewValue.emit($event);
	}
}
