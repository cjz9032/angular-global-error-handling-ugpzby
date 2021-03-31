import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageAnchorLink } from 'src/app/data-models/common/page-achor-link.model';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Component({
	selector: 'vtr-ui-header-subpage',
	templateUrl: './ui-header-subpage.component.html',
	styleUrls: ['./ui-header-subpage.component.scss'],
})
export class UiHeaderSubpageComponent implements OnInit, AfterViewInit {
	@Input() title: string;
	@Input() caption: string;
	@Input() textId: string;
	@Input() metricsParent: string;
	@Input() menu: { title: string; items: PageAnchorLink[] };
	fromTab = 'fromTab';
	pageHeader = 'pageHeader';
	@ViewChild('pageHeadingRef', { static: false }) pageHeadingRef: ElementRef;
	constructor(private route: ActivatedRoute, private logger: LoggerService) {}

	ngOnInit() {}

	menuItemClick(event, item) {
		try {
			const element = document.querySelector('#' + item.path) as HTMLElement;
			if (element) {
				element.scrollIntoView({ behavior: 'smooth', block: 'center' });
				// Fix for Edge browser
				window.scrollBy(0, -60);

				// fix for VAN-12795 , focus element only when event is key press for narrator to read element text.
				const focusElement = element.querySelector("[tabIndex = '-1']") as HTMLElement;
				if (focusElement) {
					focusElement.focus();
				}
			}
		} catch (error) {
			this.logger.error('UiHeaderSubpageComponent.menuItemClick ' + error);
		}
	}

	ngAfterViewInit(): void {
		//------ Commented out Accessibility changes as suggested by Santosh to fix VAN-16713.--------
	}
}
