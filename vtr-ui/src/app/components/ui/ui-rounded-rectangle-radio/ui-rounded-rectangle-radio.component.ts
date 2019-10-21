import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'vtr-ui-rounded-rectangle-radio',
	templateUrl: './ui-rounded-rectangle-radio.component.html',
	styleUrls: ['./ui-rounded-rectangle-radio.component.scss']
})
export class UiRoundedRectangleRadioComponent implements OnInit {
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
	hideIcon = false;

	constructor() {
	}

	ngOnInit() {
	}

	onChange(event) {
		this.change.emit(event);
	}

}
