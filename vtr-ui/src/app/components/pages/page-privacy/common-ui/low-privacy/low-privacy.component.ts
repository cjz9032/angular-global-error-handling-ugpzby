import { Component, Input } from '@angular/core';

export interface DescribeStep {
	img: string;
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

	promoVideoData = {
		image_url: '/assets/images/privacy-tab/Video.png'
	};
	promoVideoPopupData = {
		title: 'Promo for breached accaunts page',
		video_url: 'https://www.youtube.com/embed/tgbNymZ7vqY'
	};
}
