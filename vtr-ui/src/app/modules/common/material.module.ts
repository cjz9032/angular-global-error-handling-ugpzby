import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatRippleModule } from '@lenovo/material/core';
import { MatButtonModule } from '@lenovo/material/button';
import { MatDialogModule } from '@lenovo/material/dialog';
import { MatIconModule } from '@lenovo/material/icon';
import { MatTooltipModule } from '@lenovo/material/tooltip';
import { MatChipsModule } from '@lenovo/material/chips';
import { MatSnackBarModule } from '@lenovo/material/snack-bar';
import { MatExpansionModule } from '@lenovo/material/expansion';

import { SharedModule } from '../shared.module';

import { MaterialDialogComponent } from 'src/app/material/material-dialog/material-dialog.component';
import { MaterialStatusCircleComponent } from 'src/app/material/material-status-circle/material-status-circle.component';
import { MaterialSvgCircleComponent } from 'src/app/material/material-svg-circle/material-svg-circle.component';
import { MaterialStateCardContainerComponent } from 'src/app/components/pages/page-dashboard/material-state-card-container/material-state-card-container.component';
import { MaterialExpansionPanelComponent } from 'src/app/material/material-expansion-panel/material-expansion-panel.component';
import { SafePipeModule } from 'safe-pipe';

@NgModule({
	declarations: [
		MaterialStateCardContainerComponent,
		MaterialSvgCircleComponent,
		MaterialStatusCircleComponent,
		MaterialDialogComponent,
		MaterialExpansionPanelComponent,
	],
	exports: [
		MaterialStateCardContainerComponent,
		MaterialSvgCircleComponent,
		MaterialStatusCircleComponent,
		MaterialDialogComponent,
		MaterialExpansionPanelComponent,
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
		MatExpansionModule,
		SafePipeModule,
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MaterialModule {}
