import { Component, ContentChild, Inject, Input, OnDestroy, OnInit, Renderer2, TemplateRef } from '@angular/core';
import { CommonPopupEventType, CommonPopupService } from '../../services/popups/common-popup.service';
import { takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../../utils/custom-rxjs-operators/instance-destroyed';
import { AnalyticsService } from '../../services/analytics/analytics.service';
import { GetParentForAnalyticsService } from '../../services/get-parent-for-analytics.service';
import { RouterChangeHandlerService } from '../../services/router-change-handler.service';
import { VIDEO_POPUP_ID } from '../../../main-layout/sidebar/video-widget/video-widget.component';
import { DOCUMENT } from '@angular/common';

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
		confirmationPopup: {
			ItemName: 'BreachedAccountsClosePopupButton',
			ItemParent: 'ConfirmYourEmailPopup',
		},
		choseBrowserPopup: {
			ItemName: 'WebsiteTrackersClosePopupButton',
			ItemParent: 'WebsiteTrackersPopup',
		},
		'support-popup': {
			ItemName: 'HelpPopupCloseButton',
			ItemParent: 'Home.HelpPopup',
		},
		oneClickScan: {
			ItemName: 'ScorePopupCloseButton',
			ItemParent: 'Home.ScorePopup',
		},
		trackingMapSingle: {
			ItemName: 'WebsiteTrackersDetailCloseButton',
			ItemParent: 'VisibleToOnlineTrackers.DetailPopup',
		},
		removePassword: {
			ItemName: 'NonPrivatePasswordsClosePopupButton',
			ItemParent: 'NonPrivatePassword.HowToRemoveAccountsPopup',
		},
		[VIDEO_POPUP_ID]: {
			ItemName: 'VideoCloseButton',
			ItemParent: 'Home.VideoPopup',
		}
	};

	constructor(
		@Inject(DOCUMENT) private document: any,
		private commonPopupService: CommonPopupService,
		private getParentForAnalyticsService: GetParentForAnalyticsService,
		private routerChangeHandlerService: RouterChangeHandlerService,
		private renderer: Renderer2,
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
				this.isOpen ? this.renderer.addClass(this.document.body, 'modal-open') : this.renderer.removeClass(this.document.body, 'modal-open');
			});

		this.routerChangeHandlerService.onChange$
			.pipe(takeUntil(instanceDestroyed(this)))
			.subscribe(() => this.closePopup());
	}

	ngOnDestroy() {
		this.closePopup();
	}

	openPopup() { // not work now
		this.commonPopupService.open(this.popUpId);
	}

	closePopup() {
		if (!this.isOpen) {
			return;
		}

		this.isOpen = false;

		this.commonPopupService.close(this.popUpId);
		this.renderer.removeClass(this.document.body, 'modal-open');

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
