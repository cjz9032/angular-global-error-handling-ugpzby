import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'vtr-ui-circle-radio-with-checkbox',
	templateUrl: './ui-circle-radio-with-checkbox.component.html',
	styleUrls: ['./ui-circle-radio-with-checkbox.component.scss']
})
export class UiCircleRadioWithCheckboxComponent implements OnInit {

	@Input() radioId: string;
	@Input() group: string;
	@Input() label: string;
	@Input() tooltip: string;
	@Input() value: string;
	@Input() checked: boolean;
	@Input() disabled = false;
	@Input() theme: string;

	@Output() change: EventEmitter<any> = new EventEmitter();
	hideIcon: boolean = false;

	constructor() { }

	ngOnInit() {
	}

	onChange(event) {
		this.change.emit(event);
	}

	// getIconName(name: string) {
	// 	if (name) {
	// 		var arr = name.split(' ');
	// 		var index = arr.indexOf("&");
	// 		if (index !== -1) {
	// 			arr.splice(index, 1);
	// 		}
	// 		return arr.join("").toLowerCase();
	// 	}
	// 	else {
	// 		return "";
	// 	}
	// }

}
