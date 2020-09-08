import { NgModule } from '@angular/core';
import { SnapshotRoutingModule } from './snapshot-routing.module';
import { UiButtonModule } from 'src/app/components/ui/ui-button/ui-button.module';

import { PageSnapshotComponent } from './page-snapshot.component';
import { SnapshotHeaderComponent } from './components/header/snapshot-header.component';
import { SnapshotMainComponent } from './components/main/snapshot-main.component';
import { WidgetSnapshotComponent } from './components/widgets/widget-snapshot/widget-snapshot.component';
import { TranslationModule } from '../translation.module';


@NgModule({
	declarations: [
		PageSnapshotComponent,
		SnapshotHeaderComponent,
		SnapshotMainComponent,
		WidgetSnapshotComponent
	],
	exports: [
		PageSnapshotComponent,
		SnapshotHeaderComponent,
		SnapshotMainComponent,
		WidgetSnapshotComponent
	],
	imports: [
		SnapshotRoutingModule,
		UiButtonModule,
		TranslationModule
	]
})
export class SnapshotModule { }
