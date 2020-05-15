import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalInfoService } from 'src/app/services/local-info/local-info.service';
import { AntivirusCommon } from 'src/app/data-models/security-advisor/antivirus-common.model';

@Component({
	selector: 'vtr-widget-mcafee',
	templateUrl: './widget-mcafee.component.html',
	styleUrls: ['./widget-mcafee.component.scss'],
})
export class WidgetMcafeeComponent implements OnInit {

	@Input() install: any;
	@Input() name: string;
	@Input() isOnline: boolean;
	@Input() common: AntivirusCommon;

	getMcafeeText = this.translate.instant('security.antivirus.mcafee.getMacfee');
	launchMcafeeText = this.translate.instant('security.antivirus.mcafee.launch')

	constructor(
		private translate: TranslateService
	) { }

	ngOnInit() {
	}

}
