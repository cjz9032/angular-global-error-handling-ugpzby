import { Component, Input } from '@angular/core';
import { CommonPopupService } from '../../services/popups/common-popup.service';

export interface DescribeStep {
	img: string;
	img2x: string;
	title: string;
	clickEventName: string;
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

	constructor(private commonPopupService: CommonPopupService) {
	}

	handleLinkClick() {
		this.commonPopupService.close(this.popupId);
	}
}
