import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Component({
	selector: 'vtr-ui-header-subpage',
	templateUrl: './ui-header-subpage.component.html',
	styleUrls: ['./ui-header-subpage.component.scss']
})

export class UiHeaderSubpageComponent implements OnInit, AfterViewInit {

	@Input() title: string;
	@Input() caption: string;
	@Input() menuTitle: string;
	@Input() items: any[];
	@Input() textId: string;
	@Input() metricsParent: string;
	fromTab = 'fromTab';
	pageHeader = 'pageHeader';
	@ViewChild('pageHeadingRef', { static: false }) pageHeadingRef: ElementRef;
	constructor(private route: ActivatedRoute, private logger: LoggerService) { }

	ngOnInit() {
	}

	menuItemClick(event, item) {
		try {
			const element = document.querySelector('#' + item.path) as HTMLElement;
			if (element) {
				element.scrollIntoView({ behavior: 'smooth', block: 'center' });
				// Fix for Edge browser
				window.scrollBy(0, -60);

				// fix for VAN-12795 , focus element only when event is key press for narrator to read element text.
				// if (event.type !== 'click') {
				const focusElement = element.querySelector('[tabIndex = \'-1\']') as HTMLElement;
				if (focusElement) {
					focusElement.focus();
				}
			}

		} catch (error) {
			this.logger.error('UiHeaderSubpageComponent.menuItemClick ' + error);
		}
	}

	ngAfterViewInit(): void {
		try {
			//------ Commented out Accessibility changes as suggested by Santosh to fix VAN-16713.--------
			// if (this.route.snapshot.queryParamMap.get(this.fromTab) && this.route.snapshot.queryParamMap.get(this.fromTab) === 'true') {
			// 	const focusElement = this.pageHeadingRef.nativeElement.querySelector('[tabIndex = \'-1\']') as HTMLElement;
			// 	if (focusElement) {
			// 		focusElement.focus();
			// 	}
			// }
			// else {
			// 	if (document.getElementById(this.pageHeader) !== undefined) {
			// 		document.getElementById(this.pageHeader).focus();
			// 	}
			// }

		} catch (error) {

		}

	}
}
