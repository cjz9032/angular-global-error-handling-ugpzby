import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
	selector: 'input[vtrNumbersOnly]'
})
export class NumbersOnlyDirective {

	constructor(private element: ElementRef) {
	}

	@HostListener('input', ['$event']) onInputChange(event) {
		const initalValue = this.element.nativeElement.value;
		this.element.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');
		if (initalValue !== this.element.nativeElement.value) {
			event.stopPropagation();
		}
	}

}
