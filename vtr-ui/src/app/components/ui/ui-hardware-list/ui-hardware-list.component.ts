import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'vtr-ui-hardware-list',
	templateUrl: './ui-hardware-list.component.html',
	styleUrls: ['./ui-hardware-list.component.scss']
})
export class UiHardwareListComponent implements OnInit {
	@Input() items: Array<any>;
	@Input() template = 1;

	public testNotApplicable = this.translate.instant('hardwareScan.testNotApplicable');
	public information: string;

	constructor(private translate: TranslateService) { }

	ngOnInit() {
	}

	public getInformation(text: string) {
		this.information = text;
	}
}
