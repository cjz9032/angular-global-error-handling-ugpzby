import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

import { AvailableUpdateDetail } from 'src/app/data-models/system-update/available-update-detail.model';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
	selector: 'vtr-ui-list-checkbox',
	templateUrl: './ui-list-checkbox.component.html',
	styleUrls: ['./ui-list-checkbox.component.scss']
})

export class UiListCheckboxComponent implements OnInit {

	@Input() items: Array<AvailableUpdateDetail>;
	@Input() isInstallationSuccess = false;
	@Input() isInstallationCompleted = false;
	@Output() readMore = new EventEmitter<any>();
	@Output() ignoreUpdate = new EventEmitter<any>();
	@Output() checkChange = new EventEmitter<any>();

	public manufacturer: string;
	public version: string;
	public installedVersion: string;
	public downloadSize: string;
	public diskSpaceNeeded: string;
	// Random number is used to have unique id of each input field
	randomNumber: number = Math.floor(new Date().valueOf() * Math.random());

	constructor(private commonService: CommonService) { }

	ngOnInit() {
	}

	onCheckChange($event: any) {
		this.checkChange.emit($event);
	}

	onTooltipClick(update: AvailableUpdateDetail, tooltip: NgbTooltip) {
		if (!tooltip.isOpen()) {
			this.manufacturer = update.packageVendor;
			this.version = update.packageVersion;
			this.installedVersion = update.currentInstalledVersion;
			this.downloadSize = this.commonService.formatBytes(parseInt(update.packageSize, 10));
			this.diskSpaceNeeded = this.commonService.formatBytes(parseInt(update.diskSpaceRequired, 10));;
		}
		tooltip.toggle();
	}

	public onReadMoreClick($event) {
		this.readMore.emit($event);
	}

	public onIgnoreUpdateClick($event) {
		this.ignoreUpdate.emit($event);
	}
}
