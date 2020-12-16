import { UiGamingDriverPopupComponent } from './../../components/ui/ui-gaming-driver-popup/ui-gaming-driver-popup.component';
import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '../shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
	declarations: [
		// UiGamingCollapsibleContainerComponent,
		// UiGamingDriverPopupComponent,
		// UiPopoverComponent
	],
	exports: [
		// UiGamingCollapsibleContainerComponent,
		// UiGamingDriverPopupComponent,
		// UiPopoverComponent
	],
	imports: [CommonModule, SharedModule, RouterModule],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GamingCommonModule {}
