import { Component, Input, OnInit } from '@angular/core';
import { SPHeaderImageType } from 'src/app/enums/smart-performance.enum';

@Component({
	selector: 'vtr-ui-smart-performance-header',
	templateUrl: './ui-smart-performance-header.component.html',
	styleUrls: ['./ui-smart-performance-header.component.scss']
})
export class UiSmartPerformanceHeaderComponent implements OnInit {

	@Input() image: SPHeaderImageType = SPHeaderImageType.Normal;
	@Input() headerTitle = '';
	@Input() subTitle = '';
	@Input() headerTitleId = '';
	@Input() subTitleId = '';
	@Input() contentWrap = false;
	@Input() titleWrap = false;
	@Input() bottomRadius = false;

	allImages = {
		[SPHeaderImageType.Normal]: 'sp-pc-normal.png',
		[SPHeaderImageType.Scan]: 'sp-pc-scan.png',
		[SPHeaderImageType.Issue]: 'sp-pc-issue.png',
		[SPHeaderImageType.Well]: 'sp-pc-well.png',
	};

	constructor() { }

	ngOnInit(): void {
	}

}
