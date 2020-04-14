import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EyeCareMode } from 'src/app/data-models/camera/eyeCareMode.model';
import { LoggerService } from 'src/app/services/logger/logger.service';

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
	@Output() displayColorTempChange: any = new EventEmitter();
	@Output() resetTemparature: any = new EventEmitter();
	@Output() colorPreviewValue: any = new EventEmitter();


	constructor(private logger: LoggerService) { }

	ngOnInit() {
		this.logger.info('DisplayColorTempComponent', this.displayColorTempSettings);
	}

	public onDisplayColorTemparatureChange($event: any) {
		this.displayColorTempSettings.current = $event.value;
		this.displayColorTempChange.emit($event);
	}

	public onResetTemparature($event: any) {
		this.logger.info('Reset Temperature');
		this.resetTemparature.emit($event);
	}

	public dragChangeValue($event: any) {
		this.colorPreviewValue.emit($event);
	}
}
