import { Component, Input, OnInit, OnDestroy, ContentChild, TemplateRef } from '@angular/core';
import { CommonPopupService, CommonPopupEventType } from '../../services/popups/common-popup.service';
import { takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../../utils/custom-rxjs-operators/instance-destroyed';
import { AnalyticsService } from '../../services/analytics.service';
import { GetParentForAnalyticsService } from '../../services/get-parent-for-analytics.service';

@Component({
	selector: 'vtr-common-popup',
	templateUrl: './common-popup.component.html',
	styleUrls: ['./common-popup.component.scss'],
})
export class CommonPopupComponent implements OnInit, OnDestroy {
	@ContentChild(TemplateRef, { static: true }) template: TemplateRef<any>;
	@Input() popUpId: string;
	@Input() size: 'big' | 'large' | 'default' = 'default';

	isOpen = false;

	analyticsData = {
		'confirmation-popup': {
			ItemName: 'BreachedAccountsClosePopupButton',
			ItemParent: 'ConfirmYourEmailPopup',
		},
		'low-privacy-popup': {
			ItemName: 'ScorePopupCloseButton',
			ItemParent: 'ScorePopup',
		},
		choseBrowserPopup: {
			ItemName: 'WebsiteTrackersClosePopupButton',
			ItemParent: 'WebsiteTrackersPopup',
		},
		'support-popup': {
			ItemName: 'ChatNowClosePopupButton',
			ItemParent: 'KindOfHelpPopup',
		}
	};

	constructor(
		private commonPopupService: CommonPopupService,
		private getParentForAnalyticsService: GetParentForAnalyticsService,
		private analyticsService: AnalyticsService) {
	}

	ngOnInit() {
		const popup = this;

		// ensure popUpId attribute exists
		if (!popup.popUpId) {
			console.error('Attribute `popUpId` is required! Need add `popUpId` to vtr-common-popup');
			return;
		}

		this.commonPopupService
			.getOpenState(this.popUpId)
			.pipe(
				takeUntil(instanceDestroyed(this))
			)
			.subscribe(({ id, isOpenState }: CommonPopupEventType) => {
				this.isOpen = isOpenState;
			});

	}

	ngOnDestroy() {
	}

	openPopup() { // not work now
		this.commonPopupService.open(this.popUpId);
	}

	closePopup() {
		this.commonPopupService.close(this.popUpId);

		const analyticsData = this.analyticsData[this.popUpId];
		if (analyticsData) {
			const ItemParent = this.getParentForAnalyticsService.getPageName() + '.' + analyticsData.ItemParent;
			this.analyticsService.sendItemClickData({
				...analyticsData,
				ItemParent
			});
		}
	}

	preventClick(ev) {
		ev.stopPropagation();
	}
}
