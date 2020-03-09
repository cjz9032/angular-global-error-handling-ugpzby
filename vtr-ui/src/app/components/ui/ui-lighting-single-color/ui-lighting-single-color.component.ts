import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { LightEffectSimpleType } from 'src/app/enums/light-effect-simple-type';
import { Options } from 'src/app/data-models/gaming/lighting-options';
import { isUndefined } from 'util';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Component({
	selector: 'vtr-ui-lighting-single-color',
	templateUrl: './ui-lighting-single-color.component.html',
	styleUrls: [ './ui-lighting-single-color.component.scss' ]
})
export class UiLightingSingleColorComponent implements OnInit, OnChanges {
	@Input() selectedOptionId: any;
	selectedOption: Options = new Options(
		1,
		'gaming.lightingProfile.lightingSingleLightingOption.option1.title',
		"'gaming.lightingProfile.lightingSingleLightingOptionnarrator.option1.title' | translate"
	);
	@Output() public changeSingleColorOption = new EventEmitter<any>();
	@Input() options: any;

	getValue(optionId) {
		this.selectedOption = this.options.filter((item) => item.id === optionId)[0];
		this.selectedOptionId = optionId;
		this.changeSingleColorOption.emit(optionId);
	}
	public singleColorOpt: any = LightEffectSimpleType;
	constructor(
		private loggerService: LoggerService
	) {}

	ngOnInit() {}
	ngOnChanges(changes) {
		if (!isUndefined(changes.selectedOptionId)) {
			if (changes.selectedOptionId.previousValue !== changes.selectedOptionId.currentValue) {
				this.selectedOptionId = changes.selectedOptionId.currentValue;
				this.loggerService.info('ui-lighting-single-color.component.ngOnChanges',
				'selectedOptionId changed --->' +  changes.selectedOptionId.currentValue);
			}
		}
	}

	isChecked(id: number) {
		return id && id === this.selectedOptionId;
	}
}
