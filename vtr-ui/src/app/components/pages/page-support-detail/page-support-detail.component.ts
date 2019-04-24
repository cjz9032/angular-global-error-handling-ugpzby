import { Component, OnInit } from '@angular/core';
import { QaService } from "../../../services/qa/qa.service";
import { QA } from "../../../data-models/qa/qa.model";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'vtr-page-support-detail',
	templateUrl: './page-support-detail.component.html',
	styleUrls: ['./page-support-detail.component.scss']
})
export class PageSupportDetailComponent implements OnInit {

	title = 'Support Detail';

	qa: QA;
	qAndA = {
		title: 'Q&A\'s for your machine',
		description: 'Description of component',
		data: [
			{ icon: 'fa-plane', question: 'Reduced batterylife working outside.' },
			{ icon: 'fa-plane', question: 'Can I use my Ideapad while in an airplane?' },
			{ icon: 'fa-edge', question: 'Will the security control scanner damage' },
			{ icon: 'fa-amazon', question: 'Reduced batterylife working outside.' },
			{ icon: 'fa-envira', question: 'Can I use my Ideapad while in an airplane?' },
			{ icon: 'fa-chrome', question: 'Will the security control scanner damage' }
		]
	}

	constructor(public qaService: QaService,
		private translate: TranslateService,
		private activateRoute: ActivatedRoute) {

		qaService.setTranslationService(this.translate);
		qaService.qas.forEach(qa => {
			qa.title = this.translate.instant(qa.title);
			qa.description = this.translate.instant(qa.description);
		});

		this.activateRoute.params.subscribe((params) => {
			this.qa = this.qaService.getById(parseInt(params['id']));
		})
	}


	ngOnInit() {
	}

}
