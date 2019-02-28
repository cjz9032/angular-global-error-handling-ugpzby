import { Component, Input, OnInit } from '@angular/core';
import { VideoPopupService } from "../../common-services/popups/video-popup.service";

@Component({
	selector: 'vtr-promo-video',
	templateUrl: './promo-video.component.html',
	styleUrls: ['./promo-video.component.scss']
})
export class PromoVideoComponent implements OnInit {
	@Input() data: { image_url: string };
	@Input() popupData: { video_url: string, title: string };

	constructor(private videoPopupService: VideoPopupService) {
	}

	ngOnInit() {
		this.videoPopupService.setPopupContent(this.popupData.video_url);
	}

	openPopup() {
		this.videoPopupService.openPopup();
	}

}
