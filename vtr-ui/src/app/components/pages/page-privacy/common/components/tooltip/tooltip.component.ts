import { Component, ContentChild, ElementRef, Input, TemplateRef } from '@angular/core';

export type position = 'center' | 'right' | 'left' | 'top-right';

@Component({
	selector: 'vtr-tooltip',
	templateUrl: './tooltip.component.html',
	styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent {
	@Input() positionContextTo: position = 'center';
	@ContentChild('tooltipText', { static: false }) tooltipText: TemplateRef<ElementRef>;
	@ContentChild('tooltipContext', { static: false }) tooltipContext: TemplateRef<ElementRef>;

	isShowContext = false;

	showContext() {
		this.isShowContext = true;
	}

	hideContext() {
		this.isShowContext = false;
	}
}
