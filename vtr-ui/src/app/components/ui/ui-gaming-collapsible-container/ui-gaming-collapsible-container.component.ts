import { Component, OnInit, Input, ElementRef } from '@angular/core';
import * as $ from 'jquery';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { SystemUpdateService } from 'src/app/services/system-update/system-update.service';
import { CPUOCStatus } from 'src/app/data-models/system-update/cpu-overclock-status.model';

@Component({
	selector: 'vtr-ui-gaming-collapsible-container',
	templateUrl: './ui-gaming-collapsible-container.component.html',
	styleUrls: ['./ui-gaming-collapsible-container.component.scss'],
	host: {
		'(document:click)': 'generalClick($event)'
	},
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
		private elementRef: ElementRef,
		private systemUpdateService: SystemUpdateService,
	) {
		this.CpuOCStatus = systemUpdateService.GetCPUOverClockStatus();
	}

	ngOnInit() {
		this.options.forEach(option => {
			if (option.value === this.CpuOCStatus.cpuOCStatus) {
				this.currentOption = option.name;
				this.currentDescription = option.description;
			}
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
		this.CpuOCStatus.cpuOCStatus = option.value;
		this.currentOption = option.name;
		this.showOptions = false;
		this.systemUpdateService.SetCPUOverClockStatus(this.CpuOCStatus);
	}

	public showDescription(option) {
		this.currentDescription = option.description;
	}

	public generalClick(event: Event) {
		if (this.elementRef.nativeElement) {
			if (!this.elementRef.nativeElement.contains(event.target)) {
				if (this.showOptions) {
					this.showOptions = false;
				}
			}
		}
	}
}
