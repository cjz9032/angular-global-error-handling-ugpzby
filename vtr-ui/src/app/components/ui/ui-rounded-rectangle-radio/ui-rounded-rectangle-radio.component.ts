import { AppEvent } from './../../../enums/app-event.enum';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
	selector: 'vtr-ui-rounded-rectangle-radio',
	templateUrl: './ui-rounded-rectangle-radio.component.html',
	styleUrls: ['./ui-rounded-rectangle-radio.component.scss']
})
export class UiRoundedRectangleRadioComponent implements OnInit, OnChanges {
	@Input() radioId: string;
	@Input() group: string;
	@Input() label: string;
	@Input() tooltip: string;
	@Input() value: string;
	@Input() checked = false;
	@Input() disabled = false;
	@Input() name: string;
	@Input() isLarge = false;

	@Output() change: EventEmitter<any> = new EventEmitter();
	@Output() customKeyEvent = new EventEmitter();
	hideIcon = false;
	keyCode = Object.freeze({
		LEFT: 37,
		RIGHT: 39,
		UP: 38,
		DOWN: 40
	});
	constructor() {
	}

	ngOnInit() {
	}

	ngOnChanges(changes) {
		if (changes && changes.checked && !changes.checked.firstChange) {
			const elem = document.getElementById('div' + this.radioId);
			if (elem) {
				if (!this.checked) {
					elem.setAttribute('aria-checked', 'false');
					elem.tabIndex = -1;
				} else {
					elem.setAttribute('aria-checked', 'true');
					elem.tabIndex = 0;
					elem.focus();
				}
			}
		}
	}
	onChange(event) {
		this.change.emit(event);
	}
	onkeyPress($event) {
		const { keyCode } =  $event;
		if (keyCode === this.keyCode.LEFT ) {
			this.customKeyEvent.emit({customeEvent: AppEvent.LEFT});
		}  else if (keyCode === this.keyCode.RIGHT) {
			this.customKeyEvent.emit({customeEvent: AppEvent.RIGHT});
		}
	}
}
