import { Component, OnInit, Input, EventEmitter, Output, AfterContentChecked } from '@angular/core';
import { IEyeCareModeResponse } from 'src/app/data-models/camera/camera-detail.model';
import { ChangeContext } from 'ng5-slider';

@Component({
	selector: 'vtr-eye-care-mode',
	templateUrl: './eye-care-mode.component.html',
	styleUrls: ['./eye-care-mode.component.scss']
})
export class EyeCareModeComponent implements OnInit {
	@Input() eyeCareModeSettings: IEyeCareModeResponse;
	@Input() enableSlider: boolean;
	@Output() eyeCareTemperatureChange: EventEmitter<ChangeContext> = new EventEmitter();
	@Output() resetTemperature: EventEmitter<any> = new EventEmitter();
	constructor() { }

	public stepsArray = [
		{ value: 1 },
		{ value: 2, legend: 'Eye care mode' },
		{ value: 3, legend: 'Default' },
		{ value: 4 }
	];

	ngOnInit() {
	}


	public legendPosition(index: number): number {
		if (index === 1) {
			return 0.5;
		} else if (index === 2) {
			return 0.7;
		} else if (index === 3) {
			return 1;
		}
	}
	public sliderChange(value: number) {
		switch (value) {
			case 1:
				console.log('todo: warm');
				break;
			case 2:
				console.log('todo: eye care mode');
				break;
			case 3:
				console.log('todo: default');
				break;
			case 4:
				console.log('todo: cold');
				break;
		}
	}

	public onResetTemperature($event: any) {
		console.log('todo: on temp reset');
		this.resetTemperature.emit($event);
	}
	public onEyeCareTemperatureChange($event: ChangeContext) {
		console.log('Brightness changed', event);
		this.eyeCareTemperatureChange.emit($event);
	}
}
