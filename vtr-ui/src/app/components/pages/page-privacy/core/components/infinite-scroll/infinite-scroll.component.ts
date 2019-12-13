import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

@Component({
	selector: 'infinite-scroll',
	template: `<ng-content></ng-content><div #anchor></div>`,
	styleUrls: ['./infinite-scroll.component.scss']
})
export class InfiniteScrollComponent implements OnInit, OnDestroy {

	@Input() options = {};
	@Output() scrolled = new EventEmitter();
	@ViewChild('anchor', { static: true }) anchor: ElementRef<HTMLElement>;

	private observer: IntersectionObserver;

	constructor(private host: ElementRef) { }

	get element() {
		return this.host.nativeElement;
	}

	ngOnInit() {
		const options: IntersectionObserverInit = {
			root: this.isHostScrollable() ? this.host.nativeElement : null,
			rootMargin: '0px',
			threshold: [0, 0.25, 0.5, 0.75, 1],
			...this.options
		};

		this.observer = new IntersectionObserver(([entry]) => {
			entry.isIntersecting && this.scrolled.emit();
		}, options);

		this.observer.observe(this.anchor.nativeElement);
	}

	private isHostScrollable() {
		const style = window.getComputedStyle(this.element);

		return style.getPropertyValue('overflow') === 'auto' ||
			style.getPropertyValue('overflow-y') === 'scroll';
	}

	ngOnDestroy() {
		this.observer.disconnect();
	}

}
