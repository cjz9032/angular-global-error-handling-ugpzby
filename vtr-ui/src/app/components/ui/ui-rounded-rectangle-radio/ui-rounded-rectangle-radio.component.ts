import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { MetricService } from 'src/app/services/metric/metric.service';
import { AppEvent } from './../../../enums/app-event.enum';
import { UICustomRadio } from '../ui-custom-radio/ui-custom-radio';
import { KeyCode } from 'src/app/enums/key-code.enum';

@Component({
	selector: 'vtr-ui-rounded-rectangle-radio',
	templateUrl: './ui-rounded-rectangle-radio.component.html',
	styleUrls: ['./ui-rounded-rectangle-radio.component.scss']
})
export class UiRoundedRectangleRadioComponent extends UICustomRadio implements OnInit, OnChanges, AfterViewInit {
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
	}

	ngAfterViewInit(): void {
		this.setRadioButtons(); // Set up radio buttons first , last etc and if none selected,set tabindex to first element
	}

	ngOnChanges(changes) {
		// if (changes && changes.checked && !changes.checked.firstChange) {
		// 	const elem = document.getElementById('div' + this.radioId);
		// 	if (elem) {
		// 		if (!this.checked) {
		// 			elem.setAttribute('aria-checked', 'false');
		// 			elem.tabIndex = -1;
		// 		} else {
		// 			elem.setAttribute('aria-checked', 'true');
		// 			elem.tabIndex = 0;
		// 			elem.focus();
		// 		}
		// 	}
		// }
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
