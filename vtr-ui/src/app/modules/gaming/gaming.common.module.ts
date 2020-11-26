import { UiGamingDriverPopupComponent } from './../../components/ui/ui-gaming-driver-popup/ui-gaming-driver-popup.component';
import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '../shared.module';
import { RouterModule } from '@angular/router';
import { AppSearchModule } from 'src/app/beta/app-search/app-search.module';

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
	imports: [CommonModule, SharedModule, RouterModule, AppSearchModule],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GamingCommonModule {}
