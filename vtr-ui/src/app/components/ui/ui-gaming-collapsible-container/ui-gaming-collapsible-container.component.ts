import { Component, OnInit, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { CPUOCStatus } from 'src/app/data-models/gaming/cpu-overclock-status.model';
import { GamingSystemUpdateService } from 'src/app/services/gaming/gaming-system-update/gaming-system-update.service';

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
	@Output() public change = new EventEmitter<any>();
	public showOptions = false;
	public buttonName: any = 'Show';
	public selected = false;
	public currentOption: string;
	public currentDescription: string;


	constructor(
		private elementRef: ElementRef,
	) {}

	ngOnInit() {
		this.options.forEach(option => {
			if (option.selectedOption) {
				this.optionSelected(option);
				return;
			}

			if (option.defaultOption) {
				this.optionSelected(option);
				return;
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
		this.currentOption = option.name;
		this.currentDescription = option.description;
		this.showOptions = false;
		this.change.emit(option);
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
