import { Component, ContentChild, ElementRef, Input, TemplateRef } from '@angular/core';

@Component({
	selector: 'vtr-tooltip',
	templateUrl: './tooltip.component.html',
	styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent {
	@Input() positionContextTo: 'center' | 'right' | 'left' = 'center';
	@ContentChild('tooltipText') tooltipText: TemplateRef<ElementRef>;
	@ContentChild('tooltipContext') tooltipContext: TemplateRef<ElementRef>;

	isShowContext = false;

	showContext() {
		this.isShowContext = true;
	}

	hideContext() {
		this.isShowContext = false;
	}
}
