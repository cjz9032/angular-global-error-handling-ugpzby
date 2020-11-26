import {
	Component,
	OnInit,
	Input,
	ElementRef,
	Output,
	EventEmitter,
	OnChanges,
	SimpleChanges,
	ViewChild,
} from '@angular/core';

@Component({
	selector: 'vtr-ui-gaming-collapsible-container',
	templateUrl: './ui-gaming-collapsible-container.component.html',
	styleUrls: ['./ui-gaming-collapsible-container.component.scss'],
	host: {
		'(document:click)': 'generalClick($event)',
	},
})
export class UiGamingCollapsibleContainerComponent implements OnInit {
	@ViewChild('focusDropdown', { static: false }) focusDropdown: ElementRef;
	@ViewChild('dropdownLightingEle', { static: false })
	dropdownEle: ElementRef;
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
	intervalObj: any;
	isItemsFocused = false;

	constructor(private elementRef: ElementRef) {
		if (document.getElementById('menu-main-btn-navbar-toggler')) {
			document
				.getElementById('menu-main-btn-navbar-toggler')
				.addEventListener('click', (event) => {
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
		this.focusElement();
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

	focusElement() {
		setTimeout(() => {
			this.focusDropdown.nativeElement.focus();
		}, 100);
	}

	itemsFocused() {
		if (this.showOptions && !this.isItemsFocused) {
			this.intervalObj = setInterval(() => {
				if (this.dropdownEle) {
					if (this.dropdownEle.nativeElement.querySelectorAll('li:focus').length === 0) {
						this.showOptions = false;
						this.isItemsFocused = false;
						clearInterval(this.intervalObj);
					}
				}
			}, 100);
			this.isItemsFocused = true;
		}
	}
}
