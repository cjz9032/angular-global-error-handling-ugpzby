import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'vtr-ui-circle-radio',
	templateUrl: './ui-circle-radio.component.html',
	styleUrls: ['./ui-circle-radio.component.scss'],
})
export class UiCircleRadioComponent implements OnInit {
	@Input() radioId: string;
	@Input() group: string;
	@Input() label: string;
	@Input() tooltip: string;
	@Input() value: string;
	@Input() checked: boolean;
	@Input() disabled = false;
	@Input() theme: string;
	@Input() textId: string;
	@Output() change: EventEmitter<any> = new EventEmitter();
	hideIcon: boolean = false;
	constructor() {}

	ngOnInit() {}

	onChange(event) {
		this.change.emit(event);
	}

	getIconName(name: string) {
		if (name) {
			var arr = name.split(' ');
			var index = arr.indexOf('&');
			if (index !== -1) {
				arr.splice(index, 1);
			}
			return arr.join('').toLowerCase();
		} else {
			return '';
		}
	}
}
