import { Component, OnInit, Input } from '@angular/core';
import * as $ from 'jquery';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { SystemUpdateService } from 'src/app/services/system-update/system-update.service';
import { CPUOCStatus } from 'src/app/data-models/system-update/cpu-overclock-status.model';

@Component({
  selector: 'vtr-ui-gaming-collapsible-container',
  templateUrl: './ui-gaming-collapsible-container.component.html',
  styleUrls: ['./ui-gaming-collapsible-container.component.scss']
})
export class UiGamingCollapsibleContainerComponent implements OnInit {
	@Input() public options;
	public showOptions = false;
	public buttonName: any = 'Show';
	public selected = false;
	public currentOption: string;
	public currentDescription: string;
	public CpuOCStatus: CPUOCStatus;


	constructor(
		shellService: VantageShellService,
		systemUpdateService: SystemUpdateService,
	) {
		this.currentOption = systemUpdateService.GetCPUOverClockStatus();
		const CpuOCStatusFromShell = shellService.getCPUOCStatus();
		if (CpuOCStatusFromShell !== undefined) {
			this.currentOption = CpuOCStatusFromShell;
			this.CpuOCStatus = new CPUOCStatus();
			this.CpuOCStatus.cpuOCStatus = CpuOCStatusFromShell;
			systemUpdateService.SetCPUOverClockStatus(this.CpuOCStatus);
		}
	}

	ngOnInit() {
		console.log(this.options);
		this.options.forEach(option => {
			this.currentOption = option.defaultOption ? option.name : this.currentOption;
			this.currentDescription = option.defaultOption ? option.description : this.currentOption;
		});
	}

	public toggleOptions() {
		this.showOptions = !this.showOptions;

		// CHANGE THE NAME OF THE BUTTON.
		if (this.showOptions) {
			this.buttonName = 'Hide';
		} else {
			this.buttonName = 'Show';
		}
	}

	public optionSelected(option) {
		console.log(option);
		this.currentOption = option.name;
		this.showOptions = false;
	}

	public showDescription(option) {
		this.currentDescription = option.description;
	}

}
