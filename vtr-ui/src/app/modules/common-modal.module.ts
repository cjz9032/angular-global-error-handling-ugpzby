import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ModalSupportWechatComponent } from '../components/modal/modal-support-wechat/modal-support-wechat.component';
import { ModalUpdateChangeLogComponent } from '../components/modal/modal-update-change-log.component/modal-update-change-log.component';
import { ModalBatteryChargeThresholdComponent } from '../components/modal/modal-battery-charge-threshold/modal-battery-charge-threshold.component';
import { ModalVoiceComponent } from '../components/modal/modal-voice/modal-voice.component';
import { ModalLicenseComponent } from '../components/modal/modal-license/modal-license.component';
import { ModalWifiSecurityInvitationComponent } from '../components/modal/modal-wifi-security-invitation/modal-wifi-security-invitation.component';
import { ModalWifiSecuriryLocationNoticeComponent } from '../components/modal/modal-wifi-securiry-location-notice/modal-wifi-securiry-location-notice.component';
import { ModalHomeProtectionLocationNoticeComponent } from '../components/modal/modal-home-protection-location-notice/modal-home-protection-location-notice.component';
import { ModalChsWelcomeContainerComponent } from '../components/pages/page-connected-home-security/component/modal-chs-welcome-container/modal-chs-welcome-container.component';
import { ModalCommonConfirmationComponent } from '../components/modal/modal-common-confirmation/modal-common-confirmation.component';
import { ModalArticleDetailComponent } from '../components/modal/modal-article-detail/modal-article-detail.component';
import { ModalIntelligentCoolingModesComponent } from '../components/modal/modal-intelligent-cooling-modes/modal-intelligent-cooling-modes.component';
import { ModalErrorMessageComponent } from '../components/modal/modal-error-message/modal-error-message.component';
// import { ModalServerSwitchComponent } from '../components/modal/modal-server-switch/modal-server-switch.component';
import { ModalThreatLocatorComponent } from '../components/modal/modal-threat-locator/modal-threat-locator.component';
import { ModalAboutComponent } from '../components/modal/modal-about/modal-about.component';
import { DownloadFailedModalComponent } from '../components/pages/page-smart-assist/voice/download-failed-modal/download-failed-modal.component';
import { SharedModule } from './shared.module';

// THIRD PARTY MODULES

@NgModule({
	declarations: [
		ModalSupportWechatComponent,
		ModalUpdateChangeLogComponent,
		ModalBatteryChargeThresholdComponent,
		ModalVoiceComponent,
		ModalLicenseComponent,
		ModalWifiSecurityInvitationComponent,
		ModalWifiSecuriryLocationNoticeComponent,
		ModalHomeProtectionLocationNoticeComponent,
		ModalChsWelcomeContainerComponent,
		ModalCommonConfirmationComponent,
		ModalArticleDetailComponent,
		ModalIntelligentCoolingModesComponent,
		ModalErrorMessageComponent,
		// ModalServerSwitchComponent,
		ModalVoiceComponent,
		ModalThreatLocatorComponent,
		ModalAboutComponent,
		DownloadFailedModalComponent,
	],
	imports: [
		CommonModule,
		SharedModule
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	],
	entryComponents: [
		ModalSupportWechatComponent,
		ModalUpdateChangeLogComponent,
		ModalBatteryChargeThresholdComponent,
		ModalVoiceComponent,
		ModalLicenseComponent,
		ModalWifiSecurityInvitationComponent,
		ModalWifiSecuriryLocationNoticeComponent,
		ModalHomeProtectionLocationNoticeComponent,
		ModalChsWelcomeContainerComponent,
		ModalCommonConfirmationComponent,
		ModalArticleDetailComponent,
		ModalIntelligentCoolingModesComponent,
		ModalErrorMessageComponent,
		// ModalServerSwitchComponent,
		ModalVoiceComponent,
		ModalThreatLocatorComponent,
		ModalAboutComponent,
		DownloadFailedModalComponent,
	]
})
export class CommonModalModule { }
