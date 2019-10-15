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
	@Input() value: any;
	@Input() checked: boolean;
	@Input() disabled: boolean;
	@Input() iconName: string;

	@Output() change: EventEmitter<any> = new EventEmitter();
	hideIcon: boolean = false;
	constructor() { }

	ngOnInit() {
	}

	onChange(event) {
		this.change.emit(event);
	}

	getIconName(name:string){
		if (name == undefined || name == "" || name == null) {
			this.hideIcon =  true;
			return;
		}
		return name.toLowerCase();
	}
}
