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
	@Input() value: boolean;

	constructor() { }

	ngOnInit() {
	}
}
