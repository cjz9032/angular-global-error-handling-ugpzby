import { Component, ContentChild, ElementRef, Input, TemplateRef } from '@angular/core';

export type position = 'center' | 'right' | 'left' | 'top-right';

@Component({
	selector: 'vtr-tooltip',
	templateUrl: './tooltip.component.html',
	styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent {
	@Input() positionContextTo: position = 'center';
	@Input() showStrategy: 'hover' | 'click' = 'hover';
	@ContentChild('tooltipText', { static: false }) tooltipText: TemplateRef<ElementRef>;
	@ContentChild('tooltipContext', { static: false }) tooltipContext: TemplateRef<ElementRef>;

	isShowContext = false;

	showContext() {
		if (this.showStrategy === 'hover') {
			this.isShowContext = true;
		}
	}

	hideContext() {
		if (this.showStrategy === 'hover') {
			this.isShowContext = false;
		}
	}

	changeContextByClick() {
		if (this.showStrategy === 'click') {
			this.isShowContext = !this.isShowContext;
		}
		if (this.showStrategy === 'hover') {
			this.isShowContext = true;
		}
	}

	hideContextByClick() {
		this.isShowContext = false;
	}
}
