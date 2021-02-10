import {
	AfterViewInit,
	Directive,
	ElementRef,
	Input,
	OnChanges,
	OnInit,
	Renderer2,
} from '@angular/core';

import toLower from 'lodash/toLower';

@Directive({
	selector: '[vtrDisabled]',
})
export class DisabledDirective implements OnInit, AfterViewInit {

	// https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled
	private readonly SUPPORTED_TAGS: readonly string[] = Object.freeze([
		'button',
		'command',
		'fieldset',
		'keygen',
		'optgroup',
		'option',
		'select',
		'textarea',
		'input',
	]);

	@Input()
	get vtrDisabled(): boolean { return this.internalVtrDisabled; }
	set vtrDisabled(value: boolean) {
		this.internalVtrDisabled = value;

		this.ngAfterViewInit();
	}
	private internalVtrDisabled = true;

	private originalTabindex: number | null;

	constructor(
		private eleRef: ElementRef,
		private renderer: Renderer2,
	) {
	}

	ngOnInit() {
		this.originalTabindex = this.eleRef.nativeElement.getAttribute('tabindex');
	}

	ngAfterViewInit() {
		this.disableTabindex(this.eleRef.nativeElement);
		this.disableElement(this.eleRef.nativeElement);
	}

	private disableTabindex(element: any) {
		if (['div'].includes(toLower(element.tagName))) {
			if (element.hasAttribute('tabindex')) {
				if (this.vtrDisabled) {
					this.renderer.setAttribute(element, 'tabindex', '-1');
				} else if (this.originalTabindex !== null) {
					this.renderer.setAttribute(element, 'tabindex', this.originalTabindex.toString());
				}
			}
		}
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
