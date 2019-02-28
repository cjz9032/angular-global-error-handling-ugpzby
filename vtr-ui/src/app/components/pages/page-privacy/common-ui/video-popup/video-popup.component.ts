import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'
import { VideoPopupService } from "../../common-services/popups/video-popup.service";

@Component({
	selector: 'vtr-video-popup',
	templateUrl: './video-popup.component.html',
	styleUrls: ['./video-popup.component.scss']
})
export class VideoPopupComponent implements OnInit {
	public isPopupOpen: boolean = false;
	public videoUrl: string;

	constructor(private sanitizer: DomSanitizer, private videoPopupService: VideoPopupService) {
	}

	ngOnInit() {
		this.videoUrl = 'https://www.youtube.com/embed/tgbNymZ7vqY';
		this.isPopupOpen = this.videoPopupService.isPopupOpen;
		this.videoPopupService.popupOpenStateUpdated.subscribe((isOpen) => {
			this.isPopupOpen = isOpen;
		});
	}

	getVideoUrl() {
		return this.sanitizer.bypassSecurityTrustResourceUrl(this.videoUrl);
	}

	closePopup() {
		this.videoPopupService.closePopup();
	}

}
