import { Component, OnInit } from '@angular/core';
import { QaService } from '../../../services/qa/qa.service';
import { QA } from '../../../data-models/qa/qa.model';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalInfoService } from 'src/app/services/local-info/local-info.service';

@Component({
	selector: 'vtr-page-support-detail',
	templateUrl: './page-support-detail.component.html',
	styleUrls: ['./page-support-detail.component.scss'],
})
export class PageSupportDetailComponent implements OnInit {
	qa: QA;
	public langCode: any = '';

	constructor(
		public qaService: QaService,
		private activateRoute: ActivatedRoute,
		private commonService: CommonService,
		private localInfoService: LocalInfoService
	) {}

	ngOnInit() {
		this.qaService.setCurrentLangTranslations();
		this.activateRoute.params.subscribe((params) => {
			this.qa = this.qaService.getById(parseInt(params.id, 10));
			this.commonService.scrollTop();
		});
		this.localInfoService
			.getLocalInfo()
			.then((result) => {
				if (result.Lang === 'zh-hans' || result.Lang === 'ja') {
					this.langCode = result.Lang + '/';
				}
			})
			.catch((e) => {});
	}

	onNavigate() {
		window.open('https://forums.lenovo.com/', '_blank');
	}
}
