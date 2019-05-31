import { Component, OnInit, Input, ElementRef, Output, EventEmitter } from '@angular/core';

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
	public selectedDescription: string;


	constructor(
		private elementRef: ElementRef,
	) {}

	ngOnInit() {
		this.options.forEach(option => {
			if (option.selectedOption && this.currentOption === undefined) {
				console.log('optionSelected', option);
				this.setDefaultOption(option);
			}
		});

		if (this.currentOption === undefined) {
			this.options.forEach(option => {
				if (option.defaultOption) {
					this.setDefaultOption(option);
				}
			});
		}
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

	public setDefaultOption(option){
		this.currentOption = option.name;
		this.selectedDescription = option.description;
		this.currentDescription = this.selectedDescription;
		this.showOptions = false;
	}

	public optionSelected(option) {
		this.currentOption = option.name;
		this.selectedDescription = option.description;
		this.currentDescription = this.selectedDescription;
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
