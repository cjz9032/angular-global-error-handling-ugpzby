import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { ChangeContext } from 'ng5-slider';
import { EyeCareMode, SunsetToSunriseStatus } from 'src/app/data-models/camera/eyeCareMode.model';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Component({
	selector: 'vtr-eye-care-mode',
	templateUrl: './eye-care-mode.component.html',
	styleUrls: ['./eye-care-mode.component.scss']
})
export class EyeCareModeComponent implements OnInit, OnChanges {
	@Input() eyeCareModeSettings: EyeCareMode = new EyeCareMode();
	@Input() enableSlider: boolean;
	@Input() enableSunsetToSunrise: boolean;
	@Input() sunsetToSunriseStatus: any;
	@Input() manualRefresh: any;
	@Input() disableReset = false;
	@Input() missingGraphicDriver = false;

	@Output() eyeCareTemparatureChange: EventEmitter<ChangeContext> = new EventEmitter();
	@Output() eyeCareTemparatureValueChange: EventEmitter<ChangeContext> = new EventEmitter();
	@Output() resetTemparature: EventEmitter<any> = new EventEmitter();
	@Output() sunsetToSunrise = new EventEmitter<any>();

	public sunriseToSunsetText = '';

	public stepsArray = [
		{ value: 1 },
		{ value: 2, legend: 'Eye care mode' },
		{ value: 3, legend: 'Default' },
		{ value: 4 }
	];

	constructor(private logger: LoggerService) { }

	ngOnInit() { }

	ngOnChanges(changes: SimpleChanges): void {
		try {
			if (changes.sunsetToSunriseStatus && !changes.sunsetToSunriseStatus.firstChange) {
				if (this.sunsetToSunriseStatus && this.sunsetToSunriseStatus.sunsettime && this.sunsetToSunriseStatus.sunrisetime) {
					this.sunriseToSunsetText = `(${this.sunsetToSunriseStatus.sunsettime} - ${this.sunsetToSunriseStatus.sunrisetime})`;
				}
			}
		} catch (error) {
			throw Error(error.message);
		}
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

	public onResetTemparature($event: any) {
		this.logger.info('Reset Temperature');
		this.resetTemparature.emit($event);
	}
	public onEyeCareTemparatureChange($event: ChangeContext) {
		this.eyeCareTemparatureChange.emit($event);
	}
	public onEyeCareTemparatureValueChange($event: ChangeContext) {
		this.eyeCareTemparatureValueChange.emit($event);
	}
	public onSunsetToSunrise() {
		this.sunsetToSunriseStatus.status = !this.sunsetToSunriseStatus.status;
		this.logger.info('sunset to sunrise in eyecare-mode commponent', this.sunsetToSunriseStatus);
		this.sunsetToSunrise.emit(this.sunsetToSunriseStatus);
	}
}
