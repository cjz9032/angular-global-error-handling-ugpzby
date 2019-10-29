import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
	selector: '[testOption]'
})
export class TestOptionDirective {
	@Input() testOption: string;

	constructor(
		private template: TemplateRef<any>,
		private container: ViewContainerRef
	) {
	}

	display() {
		this.container.createEmbeddedView(this.template);
	}

	hide() {
		this.container.detach();
	}

}
