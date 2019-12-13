import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
	selector: '[vtrClickOutside]'
})
export class ClickOutsideDirective {
	constructor(private elementRef: ElementRef) { }

	@Output('vtrClickOutside') clickOutside: EventEmitter<any> = new EventEmitter();

	@HostListener('document:click', ['$event.target']) onMouseEnter(targetElement) {
		const clickedInside = this.elementRef.nativeElement.contains(targetElement);
		if (!clickedInside) {
			this.clickOutside.emit(null);
		}
	}
}
