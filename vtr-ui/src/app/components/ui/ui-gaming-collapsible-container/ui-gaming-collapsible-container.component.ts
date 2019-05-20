import { Component, OnInit, Input } from '@angular/core';
import * as $ from 'jquery';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

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

	constructor(
		shellService: VantageShellService,
		commonSercice: CommonService
	) {
		this.currentOption = commonSercice.getLocalStorageValue(LocalStorageKey.CpuOCStatus);
		this.currentOption = shellService.getCPUOverClockStatus();
	}

	ngOnInit() {
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
		this.currentOption = option.name;
		this.showOptions = false;
	}

	public showDescription(option) {
		this.currentDescription = option.description;
	}

}
