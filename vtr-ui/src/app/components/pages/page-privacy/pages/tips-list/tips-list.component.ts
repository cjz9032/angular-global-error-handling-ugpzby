import { Component, OnInit } from '@angular/core';
import { TipsService } from '../../common-services/tips/tips.service';

@Component({
	selector: 'vtr-tips-list',
	templateUrl: './tips-list.component.html',
	styleUrls: ['./tips-list.component.scss']
})
export class TipsListComponent implements OnInit {
	tips = [];

	constructor(private tipsService: TipsService) {
	}

	ngOnInit() {
		this.tips = this.tipsService.tips;
	}

}
