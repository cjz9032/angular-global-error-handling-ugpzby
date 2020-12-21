import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatteryHealthComponent } from './battery-health.component';
import { CommonUiModule } from '../../../../../../modules/common/common-ui.module';
import { BatteryRankLifespanComponent } from './battery-rank-lifespan/battery-rank-lifespan.component';
import { BatteryLayoutComponent } from './battery-layout/battery-layout.component';
import { BatteryTemperatureComponent } from './battery-temperature/battery-temperature.component';
import { BatteryCapacityComponent } from './battery-capacity/battery-capacity.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faQuestionCircle } from '@fortawesome/pro-light-svg-icons/faQuestionCircle';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslationModule } from '../../../../../../modules/translation.module';

@NgModule({
	declarations: [
		BatteryHealthComponent,
		BatteryRankLifespanComponent,
		BatteryLayoutComponent,
		BatteryTemperatureComponent,
		BatteryLayoutComponent,
		BatteryCapacityComponent,
	],
	imports: [CommonModule, CommonUiModule, FontAwesomeModule, NgbTooltipModule, TranslationModule],
	exports: [BatteryHealthComponent],
})
export class BatteryHealthModule {
	constructor(library: FaIconLibrary) {
		library.addIcons(faQuestionCircle);
	}
}
