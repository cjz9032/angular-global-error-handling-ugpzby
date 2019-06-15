import { Component, OnInit, Input, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'vtr-ui-lighting-effect',
	templateUrl: './ui-lighting-effect.component.html',
	styleUrls: ['./ui-lighting-effect.component.scss'],
	host: {
		'(document:click)': 'generalClick($event)'
	},
})
export class UiLightingEffectComponent implements OnInit {
	@Input() effectOptionId: number;
	@Input() public options;
	@Input() lightingData: any;
	@Output() public change = new EventEmitter<any>();

	public showOptions = false;
	public buttonName: any = 'Show';
	public selected = false;
	public currentOption: string;
	public currentDescription: string;
	public selectedDescription: string;

	constructor(private elementRef: ElementRef) { }

	ngOnInit() {
		this.currentOption = this.options.dropOptions[this.options.curSelected].name;
	}

	public toggleOptions(optSelected) {
		this.showOptions = !this.showOptions;
		// CHANGE THE NAME OF THE BUTTON.
		if (this.showOptions) {
			this.buttonName = 'Hide';
		} else {
			this.buttonName = 'Show';
		}
	}

	public setDefaultOption(option) {
		this.currentOption = option.name;
		this.showOptions = false;
	}

	public optionSelected(option) {
		this.currentOption = option.name;
		this.options.curSelected = option.value;
		this.showOptions = false;
		this.change.emit(option);
	}

	public changeDescription(option) {
		this.options.curSelected = option.value;
	}

	public resetDescription(option) {
		this.options.curSelected = option.value;
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
