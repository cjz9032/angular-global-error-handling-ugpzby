import { Component, Input, OnInit } from '@angular/core';
import { CommonPopupService } from '../../../common/services/popups/common-popup.service';

@Component({
	selector: 'vtr-article-pitch',
	templateUrl: './article-pitch.component.html',
	styleUrls: ['./article-pitch.component.scss']
})
export class ArticlePitchComponent implements OnInit {
	@Input() popUpId: string;

	constructor(private commonPopupService: CommonPopupService) {
	}

	ngOnInit() {
	}

	closeArticlePopup() {
		this.commonPopupService.close(this.popUpId);
	}

}
