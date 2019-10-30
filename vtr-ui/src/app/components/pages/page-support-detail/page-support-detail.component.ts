import { Component, OnInit, OnDestroy } from '@angular/core';
import { QaService } from '../../../services/qa/qa.service';
import { QA } from '../../../data-models/qa/qa.model';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
// import {DomSanitizer} from '@angular/platform-browser' //VAN-6426, Sanitization Exception

@Component({
	selector: 'vtr-page-support-detail',
	templateUrl: './page-support-detail.component.html',
	styleUrls: ['./page-support-detail.component.scss']
})
export class PageSupportDetailComponent implements OnInit, OnDestroy {

	title = 'Support Detail';
	backarrow = '< ';

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
	};

	constructor(
		public qaService: QaService,
		private translate: TranslateService,
		private activateRoute: ActivatedRoute
	) {

		/*
		qaService.setTranslationService(this.translate);
		//initialize onchange lang for support page: sahinul, 24June2019 VAN-5534
		qaService.setCurrentLangTranslations();
		qaService.qas.forEach(qa => {
			try {
				qa.title = this.translate.instant(qa.title);
				qa.description = this.translate.instant(qa.description);
				//console.log(qa.description);
				this.translate.get(qa.keys).subscribe((translation: [string]) => {
					//console.log(JSON.stringify(translation));
					qa.keys = translation;
					//console.log(JSON.stringify(qa.keys));
				});
			}
			catch (e) {
				console.log("already translated");
			}
			finally {
				console.log("already translated");
			}
		});
		*/

		/*PAGE TITLE : sahinul, 24June2019 VAN-5534 */
		this.title = this.translate.instant(qaService.title);
		this.translate.stream(this.title).subscribe((value) => {
			this.title = value;
		});
		// console.log('sahinul page-support',this.title,qaService.title);

		this.qaService.getQATranslation(translate); // VAN-5872, server switch feature
		// this.title = qaService.title;

		this.activateRoute.params.subscribe((params) => {
			this.qa = this.qaService.getById(parseInt(params.id, 10));
		});
	}


	ngOnInit() { }

	// VAN-6426, Sanitization Exception, internal content
	/*getSafeDescription(html:any) {
        return this.sanitizer.bypassSecurityTrustHtml(html);
	}*/


	// VAN-5872, server switch feature
	ngOnDestroy() {
		this.qaService.destroyChangeSubscribed();
	}

	onNavigate() {
		window.open('https://forums.lenovo.com/', '_blank');
	}
}
