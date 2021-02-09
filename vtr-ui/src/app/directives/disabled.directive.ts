import {
	AfterViewInit,
	Directive,
	ElementRef,
	Input,
	Renderer2,
} from '@angular/core';

import toLower from 'lodash/toLower';

@Directive({
	selector: '[vtrDisabled]',
})
export class DisabledDirective implements AfterViewInit {

	// https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled
	private SUPPORTED_TAGS: string[] = [
		'button',
		'command',
		'fieldset',
		'keygen',
		'optgroup',
		'option',
		'select',
		'textarea',
		'input',
	];

	@Input() vtrDisabled = true;

	constructor(
		private eleRef: ElementRef,
		private renderer: Renderer2,
	) {
	}

	ngAfterViewInit() {
		this.disableElement(this.eleRef.nativeElement);
	}

	private disableElement(element: any) {
		if (toLower(element.tagName) in this.SUPPORTED_TAGS) {
			if (this.vtrDisabled) {
				if (!element.hasAttribute('disabled')) {
					this.renderer.setAttribute(element, 'disabled', '');
				}
			} else if (element.hasAttribute('disabled')) {
				this.renderer.removeAttribute(element, 'disabled');
			}
		}

		if (element.children) {
			for (const e of element.children) {
				this.disableElement(e);
			}
		}
	}
}
