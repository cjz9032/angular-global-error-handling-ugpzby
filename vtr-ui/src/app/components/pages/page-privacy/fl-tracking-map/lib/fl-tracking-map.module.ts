import {NgModule} from '@angular/core';

import {MapComponent} from './map/map.component';
import {MapSingleComponent} from './map-single/map-single.component';
import {ChartLineComponent} from './chart-line/chart-line.component';
import {ChartComponent} from './chart/chart.component';
import {ChartCircleComponent} from './chart-circle/chart-circle.component';
import {SiteCloudComponent} from './site-cloud/site-cloud.component';
import {ChartHitboxComponent} from './chart-hitbox/chart-hitbox.component';
import {SiteComponent} from './site/site.component';
import {MapTextComponent} from './map-text/map-text.component';
import {CommonModule} from '@angular/common';
import {ImageComponent} from './image/image.component';

@NgModule({
	declarations: [
		MapComponent,
		MapSingleComponent,
		ChartLineComponent,
		ChartComponent,
		ChartCircleComponent,
		SiteCloudComponent,
		ChartHitboxComponent,
		SiteComponent,
		MapTextComponent,
		ImageComponent,
	],
	imports: [
		CommonModule,
	],
	exports: [
		MapComponent,
		MapSingleComponent,
	]
})
export class FlTrackingMapModule {
}
