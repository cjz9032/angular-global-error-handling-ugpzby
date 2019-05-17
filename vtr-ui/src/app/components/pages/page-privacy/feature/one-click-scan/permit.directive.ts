import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
	selector: '[vtrPermit]'
})
export class PermitDirective {
	constructor(public viewContainerRef: ViewContainerRef) {}
}
