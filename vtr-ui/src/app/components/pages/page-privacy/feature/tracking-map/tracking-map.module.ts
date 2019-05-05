import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackingMapComponent } from './tracking-map.component';
import { FlTrackingMapModule } from '../../utils/fl-tracking-map';
import { SingleTrackerDetailComponent } from './single-tracker-detail/single-tracker-detail.component';
import { RouterModule } from '@angular/router';
import { VtrCommonModule } from '../../common/vtr-common.module';

@NgModule({
	declarations: [
		TrackingMapComponent,
		SingleTrackerDetailComponent,
	],
	exports: [
		TrackingMapComponent,
		SingleTrackerDetailComponent,
	],
	imports: [
		CommonModule,
		RouterModule,
		FlTrackingMapModule,
		VtrCommonModule,
	]
})
export class TrackingMapModule {
}
