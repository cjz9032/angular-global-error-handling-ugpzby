import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
	selector: 'vtr-landing',
	templateUrl: './landing.component.html',
	styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

	constructor(private commonService: CommonService) {
	}

	ngOnInit() {
		this.commonService.scrollTop();
	}

}
