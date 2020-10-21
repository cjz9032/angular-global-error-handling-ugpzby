import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'vtr-ui-question-mark-button',
	templateUrl: './ui-question-mark-button.component.html',
	styleUrls: ['./ui-question-mark-button.component.scss']
})
export class UiQuestionMarkButtonComponent implements OnInit {

	@Input() componentId: string;
	@Input() componentRole: string;
	@Input() tabIndex: number;
	@Input() tooltipText: string;

	constructor() { }

	ngOnInit(): void {
		this.tabIndex = this.tabIndex ?? 0;
		this.componentRole = this.componentRole ?? 'img';
	}
}
