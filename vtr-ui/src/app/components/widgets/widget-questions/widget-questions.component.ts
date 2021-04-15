import { Component, Input } from '@angular/core';

@Component({
	selector: 'vtr-widget-questions',
	templateUrl: './widget-questions.component.html',
	styleUrls: ['./widget-questions.component.scss'],
})
export class WidgetQuestionsComponent {
	@Input() itemId: string;
	@Input() title: string;
	@Input() description: string;
	@Input() items: any[];
	@Input() chevronVisibility = true;
	@Input() clickable = true;
	@Input() blockPosition: string;
	@Input() linkId: string;
}
