import { Directive, Input, ElementRef, Inject, AfterViewInit, AfterContentInit, Renderer2, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';


@Directive({
	selector: '[vtrAutoFocus],[autofocus]'
})
export class AutofocusDirective implements AfterContentInit, OnInit {

	private focus = true;
	private element: HTMLElement;
	private hasTabIndex = true;
	private readonly TAB_INDEX = 'tabindex';

	constructor(private el: ElementRef) {
		this.element = this.el.nativeElement;
		this.hasTabIndex = this.element.getAttribute(this.TAB_INDEX) ? true : false;
		this.element.addEventListener('blur', this.handleBur.bind(this));

	}

	ngOnInit() {
	}

	private focusElement() {
		if (this.focus) {
			// Otherwise Angular throws error: Expression has changed after it was checked.
			// let activeElement = document.activeElement as HTMLElement;
			if (!this.hasTabIndex) {
				// console.log('this.hasTabIndex' + this.hasTabIndex);
				this.element.setAttribute(this.TAB_INDEX, '0');
			}

			window.setTimeout(() => {
				// activeElement.blur();
				this.element.focus();
			}, 500);
		}
	}
	private handleBur() {
		// console.log('handleBur this.hasTabIndex' + this.hasTabIndex);
		if (!this.hasTabIndex) {
			this.element.removeAttribute(this.TAB_INDEX);
		}

	}
	public ngAfterContentInit() {
		this.focusElement();
	}

	@Input() set autofocus(condition: boolean) {
		this.focus = condition !== false;
	}

	/* private host: HTMLElement;
	private focused: Element;
	private autoFocus = true;

	@Input()
	set autofocus(value: boolean) {
		this.autoFocus = value;
	}

	constructor(private elRef: ElementRef, @Inject(DOCUMENT) private document: HTMLDocument, private renderer: Renderer2) {
		console.log('vtrAutofocus');
		this.host = elRef.nativeElement;
		this.focused = document.activeElement;
	}
	ngOnInit(): void {
		try {
			console.log('ngOnInit');
			this.focusElement();
		}
		catch (error) {
			console.log(error);
		}

	}

	public ngAfterContentInit() {
		try {
			console.log('ngAfterContentInit');
		}
		catch (error) {
			console.log(error);
		} */


	/* if (this.autoFocus && this.host && this.host !== this.focused) {
		setTimeout(() => this.host.focus(), 500);
	}
} */

	/* focusElement() {
		setTimeout(() => {

			this.host.focus();

		}, 500);
	} */

	/* ngAfterViewInit() {
		if (this.autoFocus && this.host && this.host !== this.focused) {
			setTimeout(() => this.host.focus(), 500);
		}
	} */
	/* ngAfterViewInit() {
		if (this.autoFocus || typeof this.autoFocus === "undefined")
			this.renderer.invokeElementMethod(this.el.nativeElement, 'focus', []);
	} */
	/* ngOnInit(): void {
		if (this.autoFocus && this.host && this.host !== this.focused) {
			setTimeout(() => this.host.focus(), 500);
		}

	} */
}
