import { Component, OnInit } from '@angular/core';
import { VideoPopupService } from "../../common-services/popups/video-popup.service";

@Component({
	selector: 'vtr-video-popup',
	templateUrl: './video-popup.component.html',
	styleUrls: ['./video-popup.component.scss']
})
export class VideoPopupComponent implements OnInit {
	public isPopupOpen: boolean = false;

	constructor(public videoPopupService: VideoPopupService) {
	}

	ngOnInit() {
		this.isPopupOpen = this.videoPopupService.isPopupOpen;
		this.videoPopupService.popupOpenStateUpdated.subscribe((isOpen) => {
			this.isPopupOpen = isOpen;
		});
	}

	closePopup() {
		this.videoPopupService.closePopup();
	}

}
