import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'vtr-ui-rectangle-radio',
	templateUrl: './ui-rectangle-radio.component.html',
	styleUrls: ['./ui-rectangle-radio.component.scss']
})
export class UiRectangleRadioComponent implements OnInit {
	@Input() radioId: string;
	@Input() group: string;
	@Input() label: string;
	@Input() tooltip: string;
	@Input() value: string;
	@Input() checked: boolean;
	@Input() disabled = false;

	@Output() change: EventEmitter<any> = new EventEmitter();

	constructor() { }

	ngOnInit() {
	}

	onChange(event) {
		this.change.emit(event);
	}
}
