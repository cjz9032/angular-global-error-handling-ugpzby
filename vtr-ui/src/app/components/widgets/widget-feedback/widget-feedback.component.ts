import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'vtr-widget-feedback',
	templateUrl: './widget-feedback.component.html',
	styleUrls: ['./widget-feedback.component.scss']
})
export class WidgetFeedbackComponent implements OnInit {
	@Input() title: string = this.title || '';
	@Input() description: string = this.description || '';
	@Input() actionName: string = this.actionName || '';
	@Input() action: string = this.action || '';
	@Input() actionUrl = '';
	@Input() actionTarget = '_blank';

	@Output() feedBackClick = new EventEmitter<any>();

	constructor() {}

	ngOnInit() {}

	submitAction($event) {
		this.feedBackClick.emit($event);
	}
}
