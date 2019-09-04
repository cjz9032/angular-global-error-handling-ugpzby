import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared.module';
import { CommonUiModule } from '../common/common-ui.module';
import { CommonWidgetModule } from '../common/common-widget.module';
import { CommonModalModule } from '../common/common-modal.module';
import { HomeSecurityContentComponent } from 'src/app/components/pages/page-connected-home-security/component/home-security-content/home-security-content.component';
import { HomeSecurityCardComponent } from 'src/app/components/pages/page-connected-home-security/component/home-security-card/home-security-card.component';
import { DialogService } from '../../services/dialog/dialog.service';

@NgModule({
	declarations: [
		HomeSecurityContentComponent,
		HomeSecurityCardComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		CommonUiModule,
		CommonWidgetModule,
		CommonModalModule
	],
	exports: [
		HomeSecurityContentComponent,
		HomeSecurityCardComponent
	],
	providers: [
		DialogService
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	]
})
export class HomeSecurityShareModule { }
