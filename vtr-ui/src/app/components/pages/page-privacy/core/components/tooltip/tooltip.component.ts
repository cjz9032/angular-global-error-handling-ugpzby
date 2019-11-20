import { Component, ContentChild, ElementRef, HostBinding, Input, OnInit, TemplateRef } from '@angular/core';

export type position = 'center' | 'right' | 'left' | 'top-right' | 'top-left';

@Component({
	selector: 'vtr-tooltip',
	templateUrl: './tooltip.component.html',
	styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent implements OnInit {
	@Input() positionContextTo: position = 'center';
	@Input() showStrategy: 'hover' | 'click' = 'hover';
	@Input() display: 'block' | 'inline-block' = 'inline-block';
	@ContentChild('tooltipText', { static: false }) tooltipText: TemplateRef<ElementRef>;
	@ContentChild('tooltipContext', { static: false }) tooltipContext: TemplateRef<ElementRef>;
	@HostBinding('style.display') displayStyle = null;

	isShowContext = false;

	ngOnInit() {
		this.displayStyle = this.display;
	}

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
