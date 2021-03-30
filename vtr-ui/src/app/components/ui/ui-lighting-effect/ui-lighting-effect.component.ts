import {
	Component,
	OnInit,
	Input,
	ElementRef,
	Output,
	EventEmitter,
	OnChanges,
	ViewChild,
	HostListener,
} from '@angular/core';
import { isUndefined } from 'util';
import { DeviceService } from 'src/app/services/device/device.service';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Component({
	selector: 'vtr-ui-lighting-effect',
	templateUrl: './ui-lighting-effect.component.html',
	styleUrls: ['./ui-lighting-effect.component.scss'],
})
export class UiLightingEffectComponent implements OnInit, OnChanges {
	@ViewChild('focusDropdown', { static: false }) focusDropdown: ElementRef;
	@Input() public options;
	@Input() public tabindex;
	@Input() public selectedValue;
	@Input() lightingData: any;
	@Output() public changeEffect = new EventEmitter<any>();
	@Input() enableBrightCondition1: boolean;
	@Input() showDescription: boolean;
	@Input() isEffectChange = true;
	@Input() showOptions = false;
	@Input() effectOptionName: string;
	@Input() ariaLabel = '';
	@Input() automationId: string;
	@Input() defaultLang: any;
	@ViewChild('dropdownLightingEle', { static: false }) dropdownEle: ElementRef;
	@Output() public isEffectList = new EventEmitter<any>();
	// for macrokey
	@Input() public enableDescription = true;
	@Input() isRecording = false;
	@Input() tooltipValue: any;
	intervalObj: any;
	isItemsFocused = false;
	defaultLanguage: any;
	public buttonName: any = 'Show';
	public selected = false;
	public currentOption: string;
	public currentDescription: string;
	public selectedDescription: string;
	public selectedOption: any = {
		header: '',
		id: '',
		label: '',
		metricitem: '',
		name: '',
		value: 1,
	};
	// end

	constructor(
		private elementRef: ElementRef,
		private deviceService: DeviceService,
		private loggerService: LoggerService
	) {
		if (document.getElementById('menu-main-btn-navbar-toggler')) {
			document
				.getElementById('menu-main-btn-navbar-toggler')
				.addEventListener('click', (event) => {
					this.generalClick(event);
				});
		}
	}

	@HostListener('document:click', ['$event'])
	public generalClick(event: Event) {
		if (this.elementRef.nativeElement) {
			if (!this.elementRef.nativeElement.contains(event.target)) {
				if (this.showOptions) {
					this.showOptions = false;
				}
			}
		}
	}

	ngOnInit() {
		this.deviceService.getMachineInfo().then((value: any) => {
			this.defaultLanguage = value.locale;
		});
		this.loggerService.info('ui-lighting-effect.component.ngOnInit', '--->' + this.options);
		if (this.selectedOption === undefined) {
			this.selectedOption = this.options.dropOptions.filter(
				(option) => option.value === this.options.curSelected
			);
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
		this.isEffectList.emit(this.showOptions);
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
		if (this.isEffectChange) {
			if (option.value === 4 || option.value === 8) {
				this.effectOptionName = option.name;
			}
		}

		this.showOptions = false;
		this.changeEffect.emit(option);
		document.getElementById('');
		this.focusElement();
	}

	public changeDescription(option) {
		this.currentDescription = option.description;
	}

	public resetDescription(option) {
		this.currentDescription = this.selectedDescription;
	}

	keydownFn(event, i) {
		if (i === this.options.length - 1) {
			if (event.keyCode === 9) {
				this.showOptions = false;
				this.focusElement();
			}
		}
	}

	focusElement() {
		setTimeout(() => {
			this.focusDropdown.nativeElement.focus();
		}, 100);
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

		if (!isUndefined(changes.options)) {
			if (!isUndefined(changes.options.currentValue)) {
				if (!isUndefined(this.selectedValue)) {
					this.selectedOption = changes.options.currentValue.dropOptions.filter(
						(option) => option.value === this.selectedValue
					)[0];
				}
			}
		}
	}
}
