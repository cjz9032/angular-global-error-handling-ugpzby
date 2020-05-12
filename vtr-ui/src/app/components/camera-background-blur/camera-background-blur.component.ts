import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CameraBlur } from 'src/app/data-models/camera/camera-blur-model';
import { LoggerService } from 'src/app/services/logger/logger.service';
// import { UiRoundedRectangleRadioListModel, UiRoundedRectangleRadioModel } from '../ui/ui-rounded-rectangle-radio-list/ui-rounded-rectangle-radio-list.model';

@Component({
	selector: 'vtr-camera-background-blur',
	templateUrl: './camera-background-blur.component.html',
	styleUrls: ['./camera-background-blur.component.scss']
})
export class CameraBackgroundBlurComponent implements OnInit {
	@Input() option = new CameraBlur();
	@Output() optionChanged = new EventEmitter<string>();

	public readonly BLUR = 'blur';
	public readonly COMIC = 'comic';
	public readonly SKETCH = 'sketch';

	constructor(private logger: LoggerService) { }

	ngOnInit() {
	}

	public onChange($event, modeSelected: string) {
		this.logger.info('CameraBackgroundBlurComponent.onChange', {$event, modeSelected});
		this.optionChanged.emit(modeSelected);
	}
}
