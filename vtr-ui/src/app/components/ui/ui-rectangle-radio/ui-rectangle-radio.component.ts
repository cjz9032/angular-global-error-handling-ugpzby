import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { MetricService } from 'src/app/services/metric/metric.service';
import { UICustomRadio } from '../ui-custom-radio/ui-custom-radio';
import { AppEvent } from './../../../enums/app-event.enum';
import { KeyCode } from 'src/app/enums/key-code.enum';

@Component({
	selector: 'vtr-ui-rectangle-radio',
	templateUrl: './ui-rectangle-radio.component.html',
	styleUrls: ['./ui-rectangle-radio.component.scss']
})
export class UiRectangleRadioComponent extends UICustomRadio implements OnInit, OnChanges, AfterViewInit {
	@Input() radioId: string;
	@Input() tooltip: string;
	@Input() disabled: boolean;
	@Input() iconName: string;
	@Output() customKeyEvent = new EventEmitter();
	@Output() change: EventEmitter<any> = new EventEmitter();
	hideIcon: boolean = false;

	constructor(logger: LoggerService, metrics: MetricService) { super(logger, metrics); }

	ngOnInit() {
	}

	ngAfterViewInit(): void {
		this.setRadioButtons(); // Set up radio buttons first , last etc and if none selected,set tabindex to first element
	}
	ngOnChanges(changes: any) {
		// if (changes && changes.checked && !changes.checked.firstChange) {
		// 	const elementDiv = document.getElementById('div' + this.radioId);
		// 	if (elementDiv) {
		// 		if (!this.checked) {
		// 			elementDiv.setAttribute('aria-checked', 'false');
		// 			elementDiv.tabIndex = -1;
		// 		} else {
		// 			elementDiv.setAttribute('aria-checked', 'true');
		// 			elementDiv.tabIndex = 0;
		// 			elementDiv.focus();
		// 		}
		// 	}
		// }
	}
	onChange(event) {
		this.change.emit(event);
	}

	getIconName(name: string) {
		if (name === undefined || name === '' || name === null) {
			this.hideIcon = true;
			return;
		}
		return name.toLowerCase();
	}

	emitKeyEvent(event) {
		switch (event.keyCode) {
			case KeyCode.LEFT:
				this.customKeyEvent.emit({ switchEVent: AppEvent.LEFT });
				break;
			case KeyCode.RIGHT:
				this.customKeyEvent.emit({ switchEVent: AppEvent.RIGHT });
				break;
			case KeyCode.UP:
				event.preventDefault();
				break;
			case KeyCode.DOWN:
				event.preventDefault();
				break;
		}
	}
}
