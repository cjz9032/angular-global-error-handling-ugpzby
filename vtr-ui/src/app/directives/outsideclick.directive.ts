import { Directive, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';

@Directive({
	selector: '[vtrOutsideClick]',
})
export class OutsideclickDirective {
	constructor(private elementRef: ElementRef) {}

	@Output() clickOutside: EventEmitter<any> = new EventEmitter();

	@HostListener('document:click', ['$event.target'])
	public onMouseEnter(targetElement) {
		const clickedInside = this.elementRef.nativeElement.contains(targetElement);
		if (!clickedInside) {
			this.clickOutside.emit();
		}
	}
}
