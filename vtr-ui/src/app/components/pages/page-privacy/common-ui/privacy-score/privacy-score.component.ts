import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'vtr-privacy-score',
	templateUrl: './privacy-score.component.html',
	styleUrls: ['./privacy-score.component.scss']
})
export class PrivacyScoreComponent implements OnInit {
	@Input() title: string;
	@Input() text: string;
	@Input() score: number;
	@Input() btn_text: string;
	public privacyLevel = 'low';
	ngOnInit() {
		if (this.score < 45) {
			this.privacyLevel = 'low';
		} else if (this.score < 80) {
			this.privacyLevel = 'medium';
		} else {
			this.privacyLevel = 'high';
		}
	}

}
