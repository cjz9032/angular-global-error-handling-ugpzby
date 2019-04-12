import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'vtr-ui-circle-radio',
  templateUrl: './ui-circle-radio.component.html',
  styleUrls: ['./ui-circle-radio.component.scss']
})
export class UiCircleRadioComponent implements OnInit {

	@Input() radioId: string;
	@Input() group: string;
	@Input() label: string;
	@Input() tooltip: string;
	@Input() value: string;
	@Input() checked: boolean;
	@Input() disabled = false;
	@Input() theme:string;

	@Output() change: EventEmitter<any> = new EventEmitter();

	constructor() { }

	ngOnInit() {
	}

	onChange(event) {
		this.change.emit(event);
	}

	getIconName(name:string){
		return name.toLowerCase();
	}

}
