import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonPopupService } from '../../../common/services/popups/common-popup.service';
import { RouterChangeHandlerService } from '../../../common/services/router-change-handler.service';
import { takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../../utils/custom-rxjs-operators/instance-destroyed';
import { RoutersName } from '../../../privacy-routing-name';

@Component({
	selector: 'vtr-support-widget',
	templateUrl: './support-widget.component.html',
	styleUrls: ['./support-widget.component.scss']
})
export class SupportWidgetComponent implements OnInit, OnDestroy {
	showOnPages = [RoutersName.ARTICLES, RoutersName.ARTICLEDETAILS, RoutersName.LANDING];
	wasSupportWidgetDisplayed = false;

	constructor(
		private commonPopupService: CommonPopupService,
		private routerChangeHandler: RouterChangeHandlerService
	) {
	}

	ngOnInit() {
		this.routerChangeHandler.onChange$
			.pipe(
				takeUntil(instanceDestroyed(this)),
			)
			.subscribe((currPage: RoutersName) => {
					this.wasSupportWidgetDisplayed = this.showOnPages.includes(currPage);
				}
			);
	}

	ngOnDestroy(): void {
	}

	openPopup(id) {
		this.commonPopupService.open(id);
	}

}
