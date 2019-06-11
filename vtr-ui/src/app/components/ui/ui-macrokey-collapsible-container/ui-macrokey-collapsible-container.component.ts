import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';

@Component({
	selector: 'vtr-ui-macrokey-collapsible-container',
	templateUrl: './ui-macrokey-collapsible-container.component.html',
	styleUrls: [ './ui-macrokey-collapsible-container.component.scss' ],
	host: {
		'(document:click)': 'generalClick($event)'
	}
})
export class UiMacrokeyCollapsibleContainerComponent implements OnInit {
	@Input() public options;
	@Input() public selectedOption;
	@Input() public enableDescription: Boolean = true;
	@Input() isRecording: Boolean = false;
	@Output() public change = new EventEmitter<any>();
	public showOptions = false;
	public buttonName: any = 'Show';
	public selected = false;
	public currentOption: string;
	public currentDescription: string;
	public selectedDescription: string;

	constructor(private elementRef: ElementRef) {}

	ngOnInit() {}

	public toggleOptions() {
		this.showOptions = !this.showOptions;

		// CHANGE THE NAME OF THE BUTTON.
		if (this.showOptions) {
			this.buttonName = 'Hide';
		} else {
			this.buttonName = 'Show';
		}
	}

	public setDefaultOption(option) {
		this.selectedOption = option;
		this.showOptions = false;
	}

	public optionSelected(option) {
		this.selectedOption = option;
		this.showOptions = false;
		this.change.emit(option);
	}

	public changeDescription(option) {
		this.currentDescription = option.description;
	}

	public resetDescription(option) {
		this.currentDescription = this.selectedDescription;
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
