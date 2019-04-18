import { Component, Input } from '@angular/core';
import { CommonPopupService } from '../../common-services/popups/common-popup.service';

export interface DescribeStep {
	img: string;
	img2x: string;
	title: string;
	button: {
		name: string;
		link: string;
	};
}

@Component({
	selector: 'vtr-low-privacy',
	templateUrl: './low-privacy.component.html',
	styleUrls: ['./low-privacy.component.scss']
})
export class LowPrivacyComponent {
	@Input() steps: DescribeStep[] = [];
	@Input() popupId: string;

	promoVideoData = {
		image_url: '/assets/images/privacy-tab/Video.png'
	};
	promoVideoPopupData = {
		title: 'Promo for breached accaunts page',
		video_url: 'https://www.youtube.com/embed/tgbNymZ7vqY'
	};

	constructor(private commonPopupService: CommonPopupService) {
	}

	handleLinkClick() {
		this.commonPopupService.close(this.popupId);
	}
}
