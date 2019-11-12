import { Component, OnInit, Input } from '@angular/core';
import { SupportService } from 'src/app/services/support/support.service';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
	selector: 'vtr-ui-header-warranty',
	templateUrl: './ui-header-warranty.component.html',
	styleUrls: ['./ui-header-warranty.component.scss']
})
export class UiHeaderWarrantyComponent implements OnInit {

	@Input() pageParent: string;

	warrantyData: any;

	constructor(
		private supportService: SupportService,
		private commonService: CommonService,
	) {
		this.warrantyData = this.supportService.warrantyData;
	}

	ngOnInit() {
		this.getWarrantyInfo(true);
	}

	getWarrantyInfo(online: boolean) {
		this.supportService.getWarrantyInfo(online);
	}

}
