import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-widget-questions',
	templateUrl: './widget-questions.component.html',
	styleUrls: ['./widget-questions.component.scss']
})
export class WidgetQuestionsComponent implements OnInit {

	@Input() title: string;
	@Input() description: string;
	@Input() items: any[];

	constructor() {
	}

	ngOnInit() {
	}
}

