import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonPopupService } from '../../services/popups/common-popup.service';
import { RouterChangeHandlerService } from '../../services/router-change-handler.service';
import { takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../../utils/custom-rxjs-operators/instance-destroyed';
import { RoutersName } from '../../../privacy-routing-name';

@Component({
	selector: 'vtr-support-widget',
	templateUrl: './support-widget.component.html',
	styleUrls: ['./support-widget.component.scss']
})
export class SupportWidgetComponent implements OnInit, OnDestroy {
	showOnPages: string[] = [RoutersName.ARTICLES, RoutersName.LANDING];
	isSupportWidgetDisplayed = false;

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
			.subscribe((currPage) => {
					this.isSupportWidgetDisplayed = this.showOnPages.includes(currPage);
				}
			);
	}

	ngOnDestroy(): void {
	}

	openPopup(id) {
		this.commonPopupService.open(id);
	}

}
