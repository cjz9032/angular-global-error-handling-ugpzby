import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/services/common/common.service';
import { FeatureContent } from 'src/app/data-models/common/feature-content.model';
import { ContentActionType } from 'src/app/enums/content.enum';

@Component({
  selector: 'vtr-page-snapshot',
  templateUrl: './page-snapshot.component.html',
  styleUrls: ['./page-snapshot.component.scss']
})
export class PageSnapshotComponent implements OnInit {

	hardwareScanSupportCard: FeatureContent = new FeatureContent();

	constructor(
		private translate: TranslateService,
		private commonService: CommonService
	) { }

	ngOnInit(): void {
		this.initSupportCard();
	}

	// TODO: This function was copied from Page HWScan.
	// Look for a way to move this function to a common place (maybe a service)
	// in order to allow HWScan and Snapshot to use it, but without creating an undesired dependency between them.
	private initSupportCard() {
		Object.assign(this.hardwareScanSupportCard, {
			Id: 'HardwareScan.DiagnosticsTools',
			Title: this.translate.instant('hardwareScan.support.title'),
			FeatureImage: 'assets/images/support.jpg',
			Action: 'Read More',
			ActionType: ContentActionType.External,
			ActionLink: 'https://pcsupport.lenovo.com/lenovodiagnosticsolutions/downloads',
			isLocal: true
		});
		if (!this.commonService.isOnline) {
			this.hardwareScanSupportCard.Title = this.translate.instant('hardwareScan.offline');
		}
	}
}
