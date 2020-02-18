import { Directive, HostListener, Output, EventEmitter } from '@angular/core';
import { AppEvent } from '../enums/app-event.enum';

@Directive({
	selector: '[vtrAppEvent]'
})
export class AppEventDirective {

	@Output() appEvent = new EventEmitter<{ name: AppEvent, event: any }>();

	constructor() { }

	@HostListener('mousewheel', ['$event'])
	onMouseWheelChrome(event: any) {
        // this.mouseWheelFunc(event);
        this.appEvent.emit(event);
    }

	@HostListener('DOMMouseScroll', ['$event'])
	onMouseWheelFirefox(event: any) {
        // this.mouseWheelFunc(event);
        this.appEvent.emit(event);
    }

	@HostListener('mousewheel', ['$event'])
	onMouseWheelIE(event: any) {
        // this.mouseWheelFunc(event);
        this.appEvent.emit(event);
    }

	@HostListener('click', ['$event'])
	onDocumentClick(event: Event) {
		event.stopPropagation();
		event.preventDefault();
		this.appEvent.emit({ name: AppEvent.Click, event: event });
	}
}
