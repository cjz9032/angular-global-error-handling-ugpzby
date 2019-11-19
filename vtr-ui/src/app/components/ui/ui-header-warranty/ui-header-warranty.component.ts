import { Component, OnInit, Input } from '@angular/core';
import { WarrantyService } from 'src/app/services/warranty/warranty.service';

@Component({
	selector: 'vtr-ui-header-warranty',
	templateUrl: './ui-header-warranty.component.html',
	styleUrls: ['./ui-header-warranty.component.scss']
})
export class UiHeaderWarrantyComponent implements OnInit {

	@Input() pageParent: string;

	warrantyData: any;

	constructor(
		private warrantyService: WarrantyService,
	) {
	}

	ngOnInit() {
		this.getWarrantyInfo();
	}

	getWarrantyInfo() {
		this.warrantyService.getWarrantyInfo().subscribe((value) => {
			if (value) {
				this.warrantyData = {
					info: {
						startDate: value.startDate,
						endDate: value.endDate,
						status: value.status,
						dayDiff: value.dayDiff,
						url: this.warrantyService.getWarrantyUrl()
					},
					cache: true
				};
			}
		});
	}

}
