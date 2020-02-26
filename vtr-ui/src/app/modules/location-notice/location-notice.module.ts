import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationNoticeRoutingModule } from './location-notice-routing.module';
import { ModalWifiSecuriryLocationNoticeComponent } from 'src/app/components/modal/modal-wifi-securiry-location-notice/modal-wifi-securiry-location-notice.component';
import { CommonPipeModule } from '../common/common-pipe.module';
import { WidgetOfflineModule } from 'src/app/components/widgets/widget-offline-info/widget-offline.module';
import { UiButtonModule } from 'src/app/components/ui/ui-button/ui-button.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslationModule } from '../translation.module';

@NgModule({
	declarations: [ModalWifiSecuriryLocationNoticeComponent],
	imports: [
		CommonModule,
		TranslationModule.forChild(),
		LocationNoticeRoutingModule,
		CommonPipeModule,
		UiButtonModule,
		WidgetOfflineModule,
		FontAwesomeModule,
		RouterModule,
		NgbModalModule
	],
	exports: [NgbModalModule],
	entryComponents: [ModalWifiSecuriryLocationNoticeComponent]
})
export class LocationNoticeModule {}
