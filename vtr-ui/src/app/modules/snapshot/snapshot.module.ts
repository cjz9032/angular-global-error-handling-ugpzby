import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SnapshotRoutingModule } from './snapshot-routing.module';
import { CommonModule } from '@angular/common';

import { PageSnapshotComponent } from './pages/page-snapshot.component';
import { SnapshotHeaderComponent } from './components/header/snapshot-header.component';
import { SnapshotMainComponent } from './components/main/snapshot-main.component';
import { WidgetSnapshotComponent } from './components/widgets/widget-snapshot/widget-snapshot.component';
import { ModalSnapshotComponent } from './components/modal/modal-snapshot/modal-snapshot.component';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronUp } from '@fortawesome/pro-light-svg-icons/faChevronUp';
import { faChevronDown } from '@fortawesome/pro-light-svg-icons/faChevronDown';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared.module';
import { PageLayoutModule } from 'src/app/components/page-layout/page-layout.module';
import { ContainerCardModule } from 'src/app/components/container-card/container-card.module';
import { CommonUiModule } from '../common/common-ui.module';

@NgModule({
	declarations: [
		PageSnapshotComponent,
		SnapshotHeaderComponent,
		SnapshotMainComponent,
		WidgetSnapshotComponent,
		ModalSnapshotComponent,
	],
	exports: [WidgetSnapshotComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [
		CommonModule,
		CommonUiModule,
		FontAwesomeModule,
		NgbCollapseModule,
		SnapshotRoutingModule,
		SharedModule,
		PageLayoutModule,
		ContainerCardModule,
	],
})
export class SnapshotModule {
	constructor(library: FaIconLibrary) {
		library.addIcons(faChevronUp);
		library.addIcons(faChevronDown);
	}
}
