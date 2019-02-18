import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'vtr-battery-card',
	templateUrl: './battery-card.component.html',
	styleUrls: ['./battery-card.component.scss']
})
export class BatteryCardComponent implements OnInit {
	constructor(private modalService: NgbModal) {}

	ngOnInit() {}

	public showDetailModal(content: any): void {
		this.modalService
			.open(content, {
				size: 'lg',
				windowClass: 'battery-modal-size'
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
