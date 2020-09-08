import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HardwareScanModule } from '../hardware-scan/hardware-scan.module';

import { SnapshotRoutingModule } from './snapshot-routing.module';
import { PageSnapshotComponent } from './page-snapshot.component';
import { SnapshotHeaderComponent } from './components/header/snapshot-header.component';
import { SnapshotMainComponent } from './components/main/snapshot-main.component';


@NgModule({
	declarations: [
		PageSnapshotComponent,
		SnapshotHeaderComponent,
		SnapshotMainComponent
	],
	exports: [
		PageSnapshotComponent,
		SnapshotHeaderComponent,
		SnapshotMainComponent
	],
	imports: [
		SnapshotRoutingModule
	]
})
export class SnapshotModule { }
