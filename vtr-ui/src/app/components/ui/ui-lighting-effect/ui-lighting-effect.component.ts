import { Component, OnInit, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { isUndefined } from 'util';

@Component({
	selector: 'vtr-ui-lighting-effect',
	templateUrl: './ui-lighting-effect.component.html',
	styleUrls: [ './ui-lighting-effect.component.scss' ],
	host: {
		'(document:click)': 'generalClick($event)'
	}
})
export class UiLightingEffectComponent implements OnInit {
	@Input() public options;
	@Input() public selectedValue;

	@Input() lightingData: any;
	@Output() public change = new EventEmitter<any>();
	@Input() enableBrightCondition1: boolean;
	public showOptions = false;
	public buttonName: any = 'Show';
	public selected = false;
	public currentOption: string;
	public currentDescription: string;
	public selectedDescription: string;
	@Input() effectOptionName: string;
	public selectedOption: any;

	constructor(private elementRef: ElementRef) {}

	ngOnInit() {
		// console.log('selected value in drop ng on it', this.selectedValue);
		// this.selectedOption = this.options.dropOptions.filter(
		// 	(option) => option.value === this.selectedValue
		// )[0];
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

	public setDefaultOption(option) {
		this.selectedOption = option;
		this.showOptions = false;
	}

	public optionSelected(option) {
		this.selectedOption = option;
		this.effectOptionName = option.name;
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
	ngOnChanges(changes) {
		if (!isUndefined(this.options)) {
			if (!isUndefined(this.options)) {
				if (!isUndefined(changes.selectedValue)) {
					this.selectedOption = this.options.dropOptions.filter(
						(option) => option.value === changes.selectedValue.currentValue
					)[0];
				}
			}
		}
	}
}
