import { UiCloseButtonModule } from 'src/app/components/ui/ui-close-button/ui-close-button.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@lenovo/material/icon';
import { MatDialogModule } from '@lenovo/material/dialog';

import { LocationNoticeRoutingModule } from './location-notice-routing.module';
import { ModalWifiSecurityLocationNoticeComponent } from 'src/app/components/modal/modal-wifi-security-location-notice/modal-wifi-security-location-notice.component';
import { CommonPipeModule } from '../common/common-pipe.module';
import { WidgetOfflineModule } from 'src/app/components/widgets/widget-offline-info/widget-offline.module';
import { UiButtonModule } from 'src/app/components/ui/ui-button/ui-button.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { TranslationModule } from '../translation.module';

@NgModule({
	declarations: [ModalWifiSecurityLocationNoticeComponent],
	imports: [
		CommonModule,
		TranslationModule.forChild(),
		LocationNoticeRoutingModule,
		CommonPipeModule,
		UiButtonModule,
		UiCloseButtonModule,
		WidgetOfflineModule,
		FontAwesomeModule,
		RouterModule,
		MatIconModule,
		MatDialogModule,
	],
	exports: [MatDialogModule],
	entryComponents: [ModalWifiSecurityLocationNoticeComponent],
})
export class LocationNoticeModule { }
