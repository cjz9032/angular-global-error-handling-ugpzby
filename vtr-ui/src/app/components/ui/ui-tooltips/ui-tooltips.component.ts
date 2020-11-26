import { Component, OnInit, Input, ContentChild, TemplateRef, ElementRef } from '@angular/core';

@Component({
	selector: 'vtr-ui-tooltips',
	templateUrl: './ui-tooltips.component.html',
	styleUrls: ['./ui-tooltips.component.scss'],
})
export class UiTooltipsComponent implements OnInit {
	@Input() positionContextTo: 'center' | 'right' | 'left' = 'center';
	@ContentChild('tooltipText', { static: false }) tooltipText: TemplateRef<ElementRef>;
	@ContentChild('tooltipContext', { static: false }) tooltipContext: TemplateRef<ElementRef>;
	isShowContext = false;

	constructor() {}

	ngOnInit() {}

	showContext() {
		this.isShowContext = true;
	}

	hideContext() {
		this.isShowContext = false;
	}
}
