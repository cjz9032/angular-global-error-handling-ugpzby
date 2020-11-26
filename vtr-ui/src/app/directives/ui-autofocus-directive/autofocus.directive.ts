import {
	AfterContentInit,
	Directive,
	ElementRef,
	Input,
	OnChanges,
	SimpleChanges,
} from '@angular/core';

@Directive({
	selector: '[vtrAutoFocus],[autofocus]',
})
export class AutofocusDirective implements AfterContentInit, OnChanges {
	private focus = true;
	private element: HTMLElement;
	private hadTabIndex = true;
	private readonly TAB_INDEX = 'tabindex';

	constructor(private el: ElementRef) {
		try {
			this.element = this.el.nativeElement;
		} catch (error) {
			// console.log('constructor ' + JSON.stringify(error));
		}
	}
	ngOnChanges(changes: SimpleChanges): void {
		try {
			// console.log('ngOnChanges ' + JSON.stringify(changes));
			if (changes.autofocus.currentValue) {
				this.focusElement();
			}
		} catch (error) {
			// console.log('ngOnChanges error' + JSON.stringify(error));
		}
	}

	private focusElement() {
		try {
			if (this.focus) {
				if (!this.element.hasAttribute(this.TAB_INDEX)) {
					this.hadTabIndex = false;
					this.element.setAttribute(this.TAB_INDEX, '0');
				}

				window.setTimeout(() => {
					// Added to reposition narrator focus position during hide and show.
					/* let activeElement = document.activeElement as HTMLElement;
					activeElement.blur(); */

					this.element.addEventListener('blur', this.handleBur.bind(this));
					this.element.focus();
					/* if (this.element.hasAttribute(this.TAB_INDEX)) {
						this.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
						// Fix for Edge browser
						window.scrollBy(0, -100);
					} */
				}, 100);
			}
		} catch (error) {
			// console.log('focusElement error' + JSON.stringify(error));
		}
	}
	private handleBur() {
		try {
			// console.log('handleBur this.hadTabIndex' + this.hadTabIndex);
			if (!this.hadTabIndex) {
				// console.log('had not hadTabIndex : added remove it');
				this.element.removeAttribute(this.TAB_INDEX);
			}
		} catch (error) {
			// console.log('handleBur error' + JSON.stringify(error));
		}
	}

	@Input() set autofocus(condition: boolean) {
		this.focus = condition !== false;
	}

	public ngAfterContentInit() {
		try {
			// console.log('ngAfterContentInit');
			this.focusElement();
		} catch (error) {
			// console.log('ngAfterContentInit error' + JSON.stringify(error))
		}
	}
}
