import { Component, OnInit, Input, ElementRef, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

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
	@Input() ariaLabel: any;
	@Output() public change = new EventEmitter<any>();
	@Output() showDropDown = new EventEmitter();
	public showOptions = false;
	public buttonName: any = 'Show';
	public selected = false;
	public currentOption: string;
	public currentDescription: string;
	public selectedDescription: string;


	constructor(
		private elementRef: ElementRef,
	) {
		if (document.getElementById('menu-main-btn-navbar-toggler')) {
			document.getElementById('menu-main-btn-navbar-toggler').addEventListener('click', (event) => {
				this.generalClick(event);
			});
		}
	}

	ngOnInit() {
		this.getCurrentOption();
	}

	public getCurrentOption() {
		this.options.dropOptions.forEach((option: any) => {
			if (option.value === this.options.curSelected) {
				this.currentOption = option.ariaLabel;
				this.currentDescription = option.description;
			}
		});
	}
	public toggleOptions(options) {
		if (!this.options.hideDropDown) {
			this.showOptions = !this.showOptions;
			// CHANGE THE NAME OF THE BUTTON.
			if (this.showOptions) {
				this.buttonName = 'Hide';
			} else {
				this.buttonName = 'Show';
			}
		}
		this.showDropDown.emit(options);
	}

	public setDefaultOption(option) {
		this.currentOption = option.ariaLabel;
		this.selectedDescription = option.description;
		this.currentDescription = this.selectedDescription;
		this.showOptions = false;
	}

	public optionSelected(option) {
		this.currentOption = option.ariaLabel;
		this.selectedDescription = option.description;
		this.currentDescription = this.selectedDescription;
		this.showOptions = false;
		this.change.emit(option);
	}

	public changeDescription(option) {
		if (this.options.curSelected === option.value) {
			this.currentDescription = option.description;
		}
	}

	public resetDescription(option) {
		if (this.options.curSelected === option.value) {
			this.currentDescription = option.description;
		}
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
	public keyupTabFn(event, i) {
        if ((this.options.dropOptions.length - 1) === i) {
			if (event.keyCode === 9) { this.showOptions = false; }
		}
    }
}
