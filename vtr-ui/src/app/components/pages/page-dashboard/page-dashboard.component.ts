import { Component, OnInit } from '@angular/core';
import { MockService } from '../../../services/mock/mock.service';
import { QaService } from '../../../services/qa/qa.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'vtr-page-dashboard',
	templateUrl: './page-dashboard.component.html',
	styleUrls: ['./page-dashboard.component.scss'],
	providers: [NgbModalConfig, NgbModal]
})
export class PageDashboardComponent implements OnInit {
	private firstName = 'James'; // todo: read it from local storage once lenovo id is integrated
	submit = 'Submit';
	title = `Looking energized today ${this.firstName}!`;
	feedbackButtonText = this.submit;

	forwardLink = {
		path: 'dashboard-customize',
		label: 'Customize Dashboard'
	};

	constructor(
		public dashboardService: DashboardService,
		public mockService: MockService,
		public qaService: QaService,
		private modalService: NgbModal,
		config: NgbModalConfig
	) {
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit() { }

	onFeedbackModal(content: any) {
		this.modalService
			.open(content, {
				centered: true
			})
			.result.then(
				result => {
					// on open
				},
				reason => {
					// on close
				}
			);
	}

	public onFeedbackClick() {
		this.feedbackButtonText = 'Thank you for your feedback !';
		setTimeout(() => {
			this.modalService.dismissAll();
			this.feedbackButtonText = this.submit;
		}, 3000);
	}
}
