import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { DownloadFailedModalComponent } from 'src/app/components/pages/page-smart-assist/voice/download-failed-modal/download-failed-modal.component';
import { ModalBatteryChargeThresholdComponent } from 'src/app/components/modal/modal-battery-charge-threshold/modal-battery-charge-threshold.component';
import { ModalCommonConfirmationComponent } from 'src/app/components/modal/modal-common-confirmation/modal-common-confirmation.component';
import { ModalErrorMessageComponent } from 'src/app/components/modal/modal-error-message/modal-error-message.component';
import { ModalHomeProtectionLocationNoticeComponent } from 'src/app/components/modal/modal-home-protection-location-notice/modal-home-protection-location-notice.component';
import { ModalIntelligentCoolingModesComponent } from 'src/app/components/modal/modal-intelligent-cooling-modes/modal-intelligent-cooling-modes.component';
import { ModalLicenseComponent } from 'src/app/components/modal/modal-license/modal-license.component';
import { ModalFindUsComponent } from 'src/app/components/modal/modal-find-us/modal-find-us.component';
import { ModalThreatLocatorComponent } from 'src/app/components/modal/modal-threat-locator/modal-threat-locator.component';
import { ModalUpdateChangeLogComponent } from 'src/app/components/modal/modal-update-change-log.component/modal-update-change-log.component';
import { ModalVoiceComponent } from 'src/app/components/modal/modal-voice/modal-voice.component';
import { ModalWifiSecuriryLocationNoticeComponent } from 'src/app/components/modal/modal-wifi-securiry-location-notice/modal-wifi-securiry-location-notice.component';
import { ModalWifiSecurityInvitationComponent } from 'src/app/components/modal/modal-wifi-security-invitation/modal-wifi-security-invitation.component';
import { ModalServerSwitchComponent } from 'src/app/components/modal/modal-server-switch/modal-server-switch.component'; // VAN-5872, server switch feature
import { SharedModule } from '../shared.module';
import { MetricsModule } from 'src/app/directives/metrics.module';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalChsWelcomeContainerComponent } from 'src/app/components/pages/page-connected-home-security/component/modal-chs-welcome-container/modal-chs-welcome-container.component';

@NgModule({
	declarations: [
		ModalServerSwitchComponent,
		DownloadFailedModalComponent,
		ModalBatteryChargeThresholdComponent,
		ModalCommonConfirmationComponent,
		ModalErrorMessageComponent,
		ModalHomeProtectionLocationNoticeComponent,
		ModalIntelligentCoolingModesComponent,
		ModalLicenseComponent,
		ModalFindUsComponent,
		ModalThreatLocatorComponent,
		ModalUpdateChangeLogComponent,
		ModalVoiceComponent,
		ModalVoiceComponent,
		ModalWifiSecuriryLocationNoticeComponent,
		ModalWifiSecurityInvitationComponent,
		ModalChsWelcomeContainerComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		MetricsModule,
		NgbModalModule
	],
	exports: [
		SharedModule,
		MetricsModule,
		NgbModalModule
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	],
	entryComponents: [
		ModalServerSwitchComponent,
		DownloadFailedModalComponent,
		ModalBatteryChargeThresholdComponent,
		ModalCommonConfirmationComponent,
		ModalErrorMessageComponent,
		ModalHomeProtectionLocationNoticeComponent,
		ModalIntelligentCoolingModesComponent,
		ModalLicenseComponent,
		ModalFindUsComponent,
		ModalThreatLocatorComponent,
		ModalUpdateChangeLogComponent,
		ModalVoiceComponent,
		ModalVoiceComponent,
		ModalWifiSecuriryLocationNoticeComponent,
		ModalWifiSecurityInvitationComponent,
		ModalChsWelcomeContainerComponent
	]
})
export class CommonModalModule { }
