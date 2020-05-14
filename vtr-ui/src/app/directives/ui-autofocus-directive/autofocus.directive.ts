import { Directive, Input, ElementRef, Inject, AfterViewInit, AfterContentInit, Renderer2, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { DOCUMENT } from '@angular/common';


@Directive({
	selector: '[vtrAutoFocus],[autofocus]'
})
export class AutofocusDirective implements AfterContentInit, OnChanges {

	private focus = true;
	private element: HTMLElement;
	private hadTabIndex = true;
	private readonly TAB_INDEX = 'tabindex';

	constructor(private el: ElementRef) {
		try {
			this.element = this.el.nativeElement;
		}
		catch (error) {
			console.log('constructor ' + JSON.stringify(error));
		}

	}
	ngOnChanges(changes: SimpleChanges): void {
		console.log('ngOnChanges ' + this.element.innerHTML + JSON.stringify(changes));
		try {
			if (changes.focus) {
				this.focusElement();
			}

		} catch (error) {
			console.log('focusElement ' + JSON.stringify(error));
		}
	}

	private focusElement() {
		try {
			// console.log('focusElement' + this.element.innerHTML);

			if (this.focus) {
				// Otherwise Angular throws error: Expression has changed after it was checked.
				// let activeElement = document.activeElement as HTMLElement;
				if (!this.element.hasAttribute(this.TAB_INDEX)) {
					this.hadTabIndex = false;
					this.element.setAttribute(this.TAB_INDEX, '0');
				}

				window.setTimeout(() => {
					// activeElement.blur();
					this.element.addEventListener('blur', this.handleBur.bind(this));
					this.element.focus();
					/* if (this.element.hasAttribute(this.TAB_INDEX)) {
						this.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
						// Fix for Edge browser
						window.scrollBy(0, -100);
					} */

				}, 500);
			}
		}
		catch (error) {
			console.log('focusElement ' + JSON.stringify(error));
		}
	}
	private handleBur() {
		try {
			// console.log('handleBur this.hadTabIndex' + this.hadTabIndex);
			if (!this.hadTabIndex) {
				this.element.removeAttribute(this.TAB_INDEX);
			}

		} catch (error) {
			console.log('handleBur ' + JSON.stringify(error))
		}


	}
	public ngAfterContentInit() {
		console.log('ngAfterContentInit' + this.element.innerHTML);
		this.focusElement();
	}

	@Input() set autofocus(condition: boolean) {
		console.log('autofocus ' + this.element.innerHTML + typeof (condition));
		this.focus = condition !== false;
	}


}
