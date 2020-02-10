import { Component, OnInit, Input, ElementRef, Output, EventEmitter, OnChanges, ViewChild } from '@angular/core';
import { isUndefined } from 'util';
import { LanguageService } from 'src/app/services/language/language.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Component({
	selector: 'vtr-ui-lighting-effect',
	templateUrl: './ui-lighting-effect.component.html',
	styleUrls: ['./ui-lighting-effect.component.scss'],
	host: {
		'(document:click)': 'generalClick($event)'
	}
})
export class UiLightingEffectComponent implements OnInit, OnChanges {
	@Input() public options;
	@Input() public tabindex;
	@Input() public selectedValue;
	@Input() lightingData: any;
	@Output() public change = new EventEmitter<any>();
	@Input() enableBrightCondition1: boolean;
	@Input() showDescription: boolean;
	public showOptions = false;
	public buttonName: any = 'Show';
	public selected = false;
	public currentOption: string;
	public currentDescription: string;
	public selectedDescription: string;
	@Input() effectOptionName: string;
	public selectedOption: any;
	@Input() defaultLang: any;
	@ViewChild('dropdownLightingEle', { static: false })
	dropdownEle: ElementRef;
	intervalObj: any;
	isItemsFocused = false;
	// for macrokey
	@Input() public enableDescription = true;
	@Input() isRecording = false;
	defaultLanguage: any;
	@Input() tooltip_value: any;
	// end

	constructor(
		private elementRef: ElementRef,
		private deviceService: DeviceService,
		private loggerService: LoggerService
	) {
		if (document.getElementById('menu-main-btn-navbar-toggler')) {
			document.getElementById('menu-main-btn-navbar-toggler').addEventListener('click', (event) => {
				this.generalClick(event);
			});
		}
	}

	ngOnInit() {
		this.deviceService.getMachineInfo().then((value: any) => {
			this.defaultLanguage = value.locale;
		});
		this.loggerService.info('ui-lighting-effect.component.ngOnInit', '--->' + this.options);
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
		if (option.value === 4 || option.value === 8) {
			this.effectOptionName = option.name;
		}

		this.showOptions = false;
		this.change.emit(option);
		document.getElementById('');
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
					this.selectedOption = this.options.dropOptions.filter(
						(option) => option.value === changes.selectedValue.currentValue
					)[0];
				}
			}
		}
	}
}
