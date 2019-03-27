import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from "../../base/base.component";

@Component({
	selector: 'vtr-widget-questions',
	templateUrl: './widget-questions.component.html',
	styleUrls: ['./widget-questions.component.scss']
})
export class WidgetQuestionsComponent extends BaseComponent implements OnInit {

	@Input() title: string;
	@Input() description: string;
	@Input() items: any[];

	constructor() {
		super();
	}

	ngOnInit() {
	}
}

