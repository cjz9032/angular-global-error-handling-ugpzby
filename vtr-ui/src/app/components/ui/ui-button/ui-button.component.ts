import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'vtr-ui-button',
	templateUrl: './ui-button.component.html',
	styleUrls: ['./ui-button.component.scss']
})
export class UiButtonComponent implements OnInit {
	@Input() label: string;
	@Output() onClick = new EventEmitter<any>();

	constructor() { }

	onClickButton(event) {
		console.log('clicked button' + this.label);
		this.onClick.emit(event);
	}

	ngOnInit() {
	}



}
