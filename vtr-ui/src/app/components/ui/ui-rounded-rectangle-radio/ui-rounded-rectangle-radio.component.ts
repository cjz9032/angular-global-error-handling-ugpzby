import {
	AfterViewInit,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
} from '@angular/core';
import { KeyCode } from 'src/app/enums/key-code.enum';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { UICustomRadio } from '../ui-custom-radio/ui-custom-radio';
import { AppEvent } from './../../../enums/app-event.enum';

@Component({
	selector: 'vtr-ui-rounded-rectangle-radio',
	templateUrl: './ui-rounded-rectangle-radio.component.html',
	styleUrls: ['./ui-rounded-rectangle-radio.component.scss'],
})
export class UiRoundedRectangleRadioComponent
	extends UICustomRadio
	implements OnInit, AfterViewInit, OnChanges {
	@Input() radioId: string;
	@Input() tooltip: string;
	@Input() disabled = false;
	@Input() name: string;
	@Input() isLarge = false;
	@Output() change: EventEmitter<any> = new EventEmitter();
	@Output() customKeyEvent = new EventEmitter();
	hideIcon = false;

	constructor(logger: LoggerService, metrics: MetricService) {
		super(logger, metrics);
	}

	ngOnInit() {
		super.ngOnInit(); // Set up radio buttons first , last etc and if none selected,set tabindex to first element
	}

	ngAfterViewInit(): void {
		super.ngAfterViewInit(); // Set up radio buttons first , last etc and if none selected,set tabindex to first element
	}

	ngOnChanges(changes) {
		super.ngOnChanges(changes);
	}
	onChange(event) {
		this.change.emit(event);
	}
	onkeyPress($event) {
		const { keyCode } = $event;
		if (keyCode === KeyCode.LEFT) {
			this.customKeyEvent.emit({ customeEvent: AppEvent.LEFT });
		} else if (keyCode === KeyCode.RIGHT) {
			this.customKeyEvent.emit({ customeEvent: AppEvent.RIGHT });
		}
	}
}
