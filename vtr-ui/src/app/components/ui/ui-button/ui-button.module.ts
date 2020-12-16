import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MetricsModule } from 'src/app/services/metric/metrics.module';
import { UiButtonComponent } from './ui-button.component';
@NgModule({
	declarations: [UiButtonComponent],
	exports: [UiButtonComponent],
	imports: [CommonModule, MetricsModule, RouterModule, NgbTooltipModule],
	schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class UiButtonModule {}
