import { NgModule } from '@angular/core';
import { SnapshotRoutingModule } from './snapshot-routing.module';
import { UiButtonModule } from 'src/app/components/ui/ui-button/ui-button.module';
import { UiCloseButtonModule } from 'src/app/components/ui/ui-close-button/ui-close-button.module';
import { CommonModule } from '@angular/common';

import { PageSnapshotComponent } from './page-snapshot.component';
import { SnapshotHeaderComponent } from './components/header/snapshot-header.component';
import { SnapshotMainComponent } from './components/main/snapshot-main.component';
import { WidgetSnapshotComponent } from './components/widgets/widget-snapshot/widget-snapshot.component';
import { TranslationModule } from '../translation.module';
import { ModalSnapshotComponent } from './components/modal/modal-snapshot/modal-snapshot.component';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronUp } from '@fortawesome/pro-light-svg-icons/faChevronUp';
import { faChevronDown } from '@fortawesome/pro-light-svg-icons/faChevronDown';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
	declarations: [
		PageSnapshotComponent,
		SnapshotHeaderComponent,
		SnapshotMainComponent,
		WidgetSnapshotComponent,
		ModalSnapshotComponent
	],
	exports: [
		PageSnapshotComponent,
		SnapshotHeaderComponent,
		SnapshotMainComponent,
		WidgetSnapshotComponent
	],
	imports: [
		CommonModule,
		UiCloseButtonModule,
		FontAwesomeModule,
		NgbCollapseModule,
		SnapshotRoutingModule,
		UiButtonModule,
		TranslationModule
	]
})
export class SnapshotModule {
	constructor(library: FaIconLibrary) {
		library.addIcons(faChevronUp);
		library.addIcons(faChevronDown);
	}
 }
