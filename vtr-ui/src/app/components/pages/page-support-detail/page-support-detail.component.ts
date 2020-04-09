import { Component, OnInit, OnDestroy } from '@angular/core';
import { QaService } from '../../../services/qa/qa.service';
import { QA } from '../../../data-models/qa/qa.model';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
	selector: 'vtr-page-support-detail',
	templateUrl: './page-support-detail.component.html',
	styleUrls: ['./page-support-detail.component.scss']
})
export class PageSupportDetailComponent implements OnInit, OnDestroy {

	title = 'Support Detail';
	backarrow = '< ';

	qa: QA;
	qaDescriptionId: string;

	constructor(
		public qaService: QaService,
		private translate: TranslateService,
		private activateRoute: ActivatedRoute,
		private commonService: CommonService
	) {	}

	ngOnInit() {
		this.qaService.getQATranslation(this.translate); // VAN-5872, server switch feature
		this.activateRoute.params.subscribe((params) => {
			this.qa = this.qaService.getById(parseInt(params.id, 10));
			this.commonService.scrollTop();
			this.qaDescriptionId = params.id;
		});
	}

	// VAN-5872, server switch feature
	ngOnDestroy() {
		this.qaService.destroyChangeSubscribed();
	}

	onNavigate() {
		window.open('https://forums.lenovo.com/', '_blank');
	}
}
