import { AppEvent } from './../../../enums/app-event.enum';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
	selector: 'vtr-ui-rectangle-radio',
	templateUrl: './ui-rectangle-radio.component.html',
	styleUrls: ['./ui-rectangle-radio.component.scss']
})
export class UiRectangleRadioComponent implements OnInit, OnChanges {
	@Input() radioId: string;
	@Input() group: string;
	@Input() label: string;
	@Input() tooltip: string;
	@Input() value: any;
	@Input() checked: boolean;
	@Input() disabled: boolean;
	@Input() iconName: string;
	@Output() customKeyEvent = new EventEmitter();

	@Output() change: EventEmitter<any> = new EventEmitter();
	hideIcon: boolean = false;
	constructor() { }
	keyCode = Object.freeze({
		LEFT: 37,
		RIGHT: 39,
		UP: 38,
		DOWN: 40
	});
	ngOnInit() {
	}

	ngOnChanges(changes: any) {
		if (changes && changes.checked && !changes.checked.firstChange) {
			const elementDiv = document.getElementById('div' + this.radioId);
			if (elementDiv) {
				if (!this.checked) {
					elementDiv.setAttribute('aria-checked', 'false');
					elementDiv.tabIndex = -1;
				} else {
					elementDiv.setAttribute('aria-checked', 'true');
					elementDiv.tabIndex = 0;
					elementDiv.focus();
				}
			}
		}
	}
	onChange(event) {
		this.change.emit(event);
	}

	getIconName(name: string) {
		if (name == undefined || name == "" || name == null) {
			this.hideIcon =  true;
			return;
		}
		return name.toLowerCase();
	}

	emitKeyEvent(event) {
		switch (event.keyCode) {
			case this.keyCode.LEFT:
				this.customKeyEvent.emit({ switchEVent: AppEvent.LEFT });
				break;
			case this.keyCode.RIGHT:
				this.customKeyEvent.emit({ switchEVent: AppEvent.RIGHT });
				break;
			case this.keyCode.UP:
				event.preventDefault();
				break;
			case this.keyCode.DOWN:
				event.preventDefault();
				break;
		}
	}
}
