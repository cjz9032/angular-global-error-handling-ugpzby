import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'vtr-ui-button',
	templateUrl: './ui-button.component.html',
	styleUrls: ['./ui-button.component.scss']
})
export class UiButtonComponent implements OnInit {
	@Input() name = this.name || '';
	@Input() eventBy = this.eventBy || '';


	//@Output() click: EventEmitter<any> = new EventEmitter();
	@Output() onClick: EventEmitter<any> = new EventEmitter();
	constructor() { }

	ngOnInit() {
	}

	onClickbutton(event) {
		event.eventBy = this.eventBy;
		this.onClick.emit(event);
		console.log(event);
	}

}
