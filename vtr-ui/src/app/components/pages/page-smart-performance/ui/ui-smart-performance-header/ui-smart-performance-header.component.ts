import { Component, Input, OnInit } from '@angular/core';
import { SPHeaderImageType } from 'src/app/enums/smart-performance.enum';
import { WindowsVersionService } from 'src/app/services/windows-version/windows-version.service';

@Component({
	selector: 'vtr-ui-smart-performance-header',
	templateUrl: './ui-smart-performance-header.component.html',
	styleUrls: ['./ui-smart-performance-header.component.scss'],
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
		[SPHeaderImageType.Normal]: this.windowsVerisonService.isNewerThanRS4()
			? 'sp-pc-normal.webp'
			: 'sp-pc-normal.png',
		[SPHeaderImageType.Scan]: this.windowsVerisonService.isNewerThanRS4()
			? 'sp-pc-scan.webp'
			: 'sp-pc-scan.png',
		[SPHeaderImageType.Issue]: this.windowsVerisonService.isNewerThanRS4()
			? 'sp-pc-issue.webp'
			: 'sp-pc-issue.png',
		[SPHeaderImageType.Well]: this.windowsVerisonService.isNewerThanRS4()
			? 'sp-pc-well.webp'
			: 'sp-pc-well.png',
	};

	constructor(private windowsVerisonService: WindowsVersionService) {}

	ngOnInit(): void {}
}
