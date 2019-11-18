import { Component, OnInit, Input, Output, EventEmitter, ElementRef, OnChanges, ViewChild } from '@angular/core';
import { isUndefined } from 'util';
import { LanguageService } from 'src/app/services/language/language.service';
import { DeviceService } from 'src/app/services/device/device.service';

@Component({
	selector: 'vtr-ui-macrokey-collapsible-container',
	templateUrl: './ui-macrokey-collapsible-container.component.html',
	styleUrls: [ './ui-macrokey-collapsible-container.component.scss' ],
	host: {
		'(document:click)': 'generalClick($event)'
	}
})
export class UiMacrokeyCollapsibleContainerComponent implements OnInit, OnChanges {
	@Input() public options;
	@Input() public selectedValue;
	@Input() public enableDescription: Boolean = true;
	@Input() isRecording: Boolean = false;
	@Output() public change = new EventEmitter<any>();
	public showOptions = false;
	public buttonName: any = 'Show';
	public selected = false;
	public selectedOption: any = {};
	public currentDescription: string;
	public selectedDescription: string;
	defaultLanguage: any;
	@ViewChild('dropdownLightingEle', { static: false })
	dropdownEle: ElementRef;
	intervalObj: any;
	isItemsFocused: boolean = false;

	constructor(
		private elementRef: ElementRef,
		private languageService: LanguageService,
		private deviceService: DeviceService
	) {}

	ngOnInit() {
		this.deviceService.getMachineInfo().then((value: any) => {
			this.defaultLanguage = value.locale;
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

	keydownFn(event, i) {
		if (i === this.options.length - 1) {
			if (event.keyCode === 9) {
				this.showOptions = false;
			}
		}
	}

	ngOnChanges(changes) {
		if (!isUndefined(this.options)) {
			if (!isUndefined(this.options)) {
				if (!isUndefined(changes.selectedValue)) {
					this.selectedOption = this.options.filter(
						(option) => option.value === changes.selectedValue.currentValue
					)[0];
				}
			}
		}
	}
}

