import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackingMapComponent } from './tracking-map.component';
import { FlTrackingMapModule } from '../../utils/fl-tracking-map';
import { SingleTrackerDetailComponent } from './single-tracker-detail/single-tracker-detail.component';
import { RouterModule } from '@angular/router';
import { VtrCoreModule } from '../../core/vtr-core.module';

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
		VtrCoreModule,
	]
})
export class TrackingMapModule {
}
