import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'vtr-widget-intelligent-boost',
	templateUrl: './widget-intelligent-boost.component.html',
	styleUrls: ['./widget-intelligent-boost.component.scss']
})
export class WidgetIntelligentBoostComponent implements OnInit {
	@Input() featureToggle: boolean;
	@Input() isEmpty: boolean;

	@Output() editButtonClick = new EventEmitter();

	isDone = true;
	editLabel: string;
	doneLabel: string;

	constructor(
		private translate: TranslateService
	) {
		this.editLabel = this.translate.instant('intelligentBoost.edit');
		this.doneLabel = this.translate.instant('intelligentBoost.done');
	}

	ngOnInit(): void {
	}

	clickEdit(): void {
		this.isDone = !this.isDone;
		this.editButtonClick.emit(this.isDone);
	}
}
