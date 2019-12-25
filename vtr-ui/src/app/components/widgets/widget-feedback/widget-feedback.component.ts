import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'vtr-widget-feedback',
	templateUrl: './widget-feedback.component.html',
	styleUrls: ['./widget-feedback.component.scss']
})
export class WidgetFeedbackComponent implements OnInit {
	@Input() title = '';
	@Input() description = '';
	@Input() actionName = '';
	@Input() isOnline: boolean;

	@Output() feedBackClick = new EventEmitter<Event>();

	constructor() { }

	ngOnInit() { }

	feedback($event) {
		this.feedBackClick.emit($event);
	}
}
