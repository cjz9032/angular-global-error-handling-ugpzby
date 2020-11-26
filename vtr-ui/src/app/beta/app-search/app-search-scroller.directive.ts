import { Directive, Input, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { AppSearchService } from 'src/app/beta/app-search/app-search.service';

@Directive({
	selector: '[vtrAppSearchScroller]',
})
export class AppSearchScrollerDirective implements AfterViewInit, OnDestroy {
	@Input('vtrAppSearchScroller') anchorIdArray: Array<string>;

	constructor(private elm: ElementRef, private appSearchService: AppSearchService) {}

	scrollIntoView() {
		this.elm.nativeElement.scrollIntoView(true);
	}

	ngAfterViewInit() {
		if (!this.anchorIdArray) {
			return;
		}

		this.appSearchService.registerAnchor(this.anchorIdArray, () => {
			this.scrollIntoView();
		});
	}

	ngOnDestroy() {
		this.appSearchService.deRegisterAnchor(this.anchorIdArray);
	}
}
