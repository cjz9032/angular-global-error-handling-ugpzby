import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { LightEffectSimpleType } from 'src/app/enums/light-effect-simple-type';
import { Options } from 'src/app/data-models/gaming/lighting-options';
import { isUndefined } from 'util';

@Component({
	selector: 'vtr-ui-lighting-single-color',
	templateUrl: './ui-lighting-single-color.component.html',
	styleUrls: ['./ui-lighting-single-color.component.scss']
})
export class UiLightingSingleColorComponent implements OnInit, OnChanges {
	@Input() selectedOptionId: any;
	selectedOption: Options = new Options(1, 'Always On');
	@Output() public changeSingleColorOption = new EventEmitter<any>();
	@Input() options: any;
	// options = [
	// 	new Options(1, 'Always On'),
	// 	new Options(2, 'Fast Blink'),
	// 	new Options(3, 'Medium Blink'),
	// 	new Options(4, 'Slow Blink')
	// ];

	getValue(optionId) {
		this.selectedOption = this.options.filter((item) => item.id === optionId)[0];
		this.changeSingleColorOption.emit(optionId);
	}
	public singleColorOpt: any = LightEffectSimpleType;
	constructor() { }

	ngOnInit() {
		// const colorKeys = Object.keys(LightEffectSimpleType).filter(String);
		// colorKeys.map(colorKey => {
		// 	console.log(`color key = ${colorKey}, value = ${LightEffectSimpleType[colorKey]}`);
		// });
	}
	ngOnChanges(changes) {
		if (!isUndefined(changes.selectedOptionId)) {
			if (changes.selectedOptionId.previousValue !== changes.selectedOptionId.currentValue) {
				this.selectedOptionId = changes.selectedOptionId.currentValue;
				console.log('selectedOptionId changed------------------------------------ssss', changes.selectedOptionId.currentValue);
			}
		}
	}

}
