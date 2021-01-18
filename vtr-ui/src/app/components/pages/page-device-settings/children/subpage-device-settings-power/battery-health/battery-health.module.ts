import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { BatteryCapacityComponent } from './battery-capacity/battery-capacity.component';
import { BatteryHealthComponent } from './battery-health.component';
import { BatteryHealthTipsComponent } from './battery-health-tips/battery-health-tips.component';
import { BatteryLayoutComponent } from './battery-layout/battery-layout.component';
import { BatteryRankLifespanComponent } from './battery-rank-lifespan/battery-rank-lifespan.component';
import { BatteryTemperatureComponent } from './battery-temperature/battery-temperature.component';
import { CommonModule } from '@angular/common';
import { CommonUiModule } from '../../../../../../modules/common/common-ui.module';
import { NgModule } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslationModule } from '../../../../../../modules/translation.module';
import { faQuestionCircle } from '@fortawesome/pro-light-svg-icons/faQuestionCircle';

@NgModule({
	declarations: [
		BatteryHealthComponent,
		BatteryRankLifespanComponent,
		BatteryLayoutComponent,
		BatteryTemperatureComponent,
		BatteryLayoutComponent,
		BatteryCapacityComponent,
		BatteryHealthTipsComponent,
	],
	imports: [CommonModule, CommonUiModule, FontAwesomeModule, NgbTooltipModule, TranslationModule],
	exports: [BatteryHealthComponent],
})
export class BatteryHealthModule {
	constructor(library: FaIconLibrary) {
		library.addIcons(faQuestionCircle);
	}
}
