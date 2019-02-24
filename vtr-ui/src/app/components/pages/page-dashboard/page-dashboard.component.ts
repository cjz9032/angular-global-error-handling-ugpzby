import { Component, OnInit } from '@angular/core';
import { MockService } from '../../../services/mock/mock.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'vtr-page-dashboard',
	templateUrl: './page-dashboard.component.html',
	styleUrls: ['./page-dashboard.component.scss']
})
export class PageDashboardComponent implements OnInit {
	title = 'Dashboard';

	forwardLink = {
		path: 'dashboard-customize',
		label: 'Customize Dashboard'
	};

	constructor(
		public mockService: MockService,
		private modalService: NgbModal
	) {}

	ngOnInit() {}

	public onFeedBackClick(content: any): void {
		this.modalService
			.open(content, {
				size: 'lg',
				windowClass: 'battery-modal-size1'
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
}
