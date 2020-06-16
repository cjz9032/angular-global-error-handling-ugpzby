import { Component, OnInit, Input, Output, EventEmitter, AfterContentInit, OnChanges, SimpleChanges } from '@angular/core';
import { CameraBlur } from 'src/app/data-models/camera/camera-blur-model';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { UiRoundedRectangleRadioModel } from '../ui/ui-rounded-rectangle-custom-radio-list/ui-rounded-rectangle-radio-list.model';

@Component({
	selector: 'vtr-camera-background-blur',
	templateUrl: './camera-background-blur.component.html',
	styleUrls: ['./camera-background-blur.component.scss']
})
export class CameraBackgroundBlurComponent implements OnInit, OnChanges {
	@Input() option = new CameraBlur();
	@Output() optionChanged = new EventEmitter<string>();

	public readonly BLUR = 'Blur';
	public readonly COMIC = 'Comic';
	public readonly SKETCH = 'Sketch';

	constructor(private logger: LoggerService) { }

	public radioDetails: Array<UiRoundedRectangleRadioModel> = [];

	ngOnInit() { }

	ngOnChanges(changes: SimpleChanges) {
		if (changes.option) {
			this.radioDetails = [{
				componentId: 'radio1',
				label: 'device.deviceSettings.displayCamera.camera.camerablur.blurMode',
				value: this.BLUR,
				isChecked: this.option.currentMode.toLowerCase() === this.BLUR.toLowerCase(),
				isDisabled: false,
				metricsValue: `radio.${this.BLUR}`
			},
			{
				componentId: 'radio2',
				label: 'device.deviceSettings.displayCamera.camera.camerablur.comicMode',
				value: this.COMIC,
				isChecked: this.option.currentMode.toLowerCase() === this.COMIC.toLowerCase(),
				isDisabled: false,
				metricsValue: `radio.${this.COMIC}`
			},
			{
				componentId: 'radio3',
				label: 'device.deviceSettings.displayCamera.camera.camerablur.sketchMode',
				value: this.SKETCH,
				isChecked: this.option.currentMode.toLowerCase() === this.SKETCH.toLowerCase(),
				isDisabled: false,
				metricsValue: `radio.${this.SKETCH}`
			}];
		}
	}

	public onChange($event) {
		this.logger.info('CameraBackgroundBlurComponent.onChange', { $event });
		this.optionChanged.emit($event.value);
	}
}
