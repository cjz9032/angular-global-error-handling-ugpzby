import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatRippleModule } from '@lenovo/material/core';
import { MatButtonModule } from '@lenovo/material/button';
import { MatDialogModule } from '@lenovo/material/dialog';
import { MatIconModule } from '@lenovo/material/icon';
import { MatTooltipModule } from '@lenovo/material/tooltip';
import { MatChipsModule } from '@lenovo/material/chips';
import { MatSnackBarModule } from '@lenovo/material/snack-bar';

import { SharedModule } from '../shared.module';

import { MaterialAppListDialogComponent } from 'src/app/material/material-app-list-dialog/material-app-list-dialog.component';
import { MaterialDialogComponent } from 'src/app/material/material-dialog/material-dialog.component';
import { MaterialAppTileListComponent } from 'src/app/material/material-app-tile-list/material-app-tile-list.component';
import { MaterialStatusCircleComponent } from 'src/app/material/material-status-circle/material-status-circle.component';
import { MaterialSvgCircleComponent } from 'src/app/material/material-svg-circle/material-svg-circle.component';
import { MaterialTileComponent } from 'src/app/material/material-tile/material-tile.component';
import { MaterialStateCardContainerComponent } from 'src/app/components/pages/page-dashboard/material-state-card-container/material-state-card-container.component';


@NgModule({
	declarations: [
		MaterialStateCardContainerComponent,
		MaterialSvgCircleComponent,
		MaterialStatusCircleComponent,
		MaterialDialogComponent,
		MaterialAppListDialogComponent,
		MaterialTileComponent,
		MaterialAppTileListComponent,
	],
	exports: [
		MaterialStateCardContainerComponent,
		MaterialSvgCircleComponent,
		MaterialStatusCircleComponent,
		MaterialDialogComponent,
		MaterialAppListDialogComponent,
		MaterialTileComponent,
		MaterialAppTileListComponent,
	],
	imports: [
		CommonModule,
		SharedModule,
		RouterModule,
		MatRippleModule,
		MatSnackBarModule,
		MatButtonModule,
		MatIconModule,
		MatDialogModule,
		MatTooltipModule,
		MatChipsModule,
	]
})
export class MaterialModule { }
