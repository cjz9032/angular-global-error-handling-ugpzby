import { Component, Self, OnInit, AfterViewInit, Input } from '@angular/core';
import { SupportService } from '../../services/support/support.service';

@Component({
	selector: 'vtr-container-article',
	templateUrl: './container-article.component.html',
	styleUrls: ['./container-article.component.scss']
})
export class ContainerArticleComponent implements OnInit {
	@Input() items: any;
	@Input() type: string;
	@Input() indexPreText = '';
	@Input() startIndex: number;
	@Input() indexTimes: number;
	@Input() disableContentDisplay: boolean;

	metricsDatas: {
		viewOrder: number
		pageNumber: number
	};

	constructor(
		private supportService: SupportService,
	) {
		this.metricsDatas = this.supportService.metricsDatas;
	}

	ngOnInit() {

	}

	addViewOrder() {
		this.metricsDatas.viewOrder++;
	}
}
