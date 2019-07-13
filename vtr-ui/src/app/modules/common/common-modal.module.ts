import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { DownloadFailedModalComponent } from 'src/app/components/pages/page-smart-assist/voice/download-failed-modal/download-failed-modal.component';
import { ModalAboutComponent } from 'src/app/components/modal/modal-about/modal-about.component';
import { ModalArticleDetailComponent } from 'src/app/components/modal/modal-article-detail/modal-article-detail.component';
import { ModalBatteryChargeThresholdComponent } from 'src/app/components/modal/modal-battery-charge-threshold/modal-battery-charge-threshold.component';
import { ModalChsWelcomeContainerComponent } from 'src/app/components/pages/page-connected-home-security/component/modal-chs-welcome-container/modal-chs-welcome-container.component';
import { ModalCommonConfirmationComponent } from 'src/app/components/modal/modal-common-confirmation/modal-common-confirmation.component';
import { ModalErrorMessageComponent } from 'src/app/components/modal/modal-error-message/modal-error-message.component';
import { ModalHomeProtectionLocationNoticeComponent } from 'src/app/components/modal/modal-home-protection-location-notice/modal-home-protection-location-notice.component';
import { ModalIntelligentCoolingModesComponent } from 'src/app/components/modal/modal-intelligent-cooling-modes/modal-intelligent-cooling-modes.component';
import { ModalLicenseComponent } from 'src/app/components/modal/modal-license/modal-license.component';
import { ModalSupportWechatComponent } from 'src/app/components/modal/modal-support-wechat/modal-support-wechat.component';
import { ModalThreatLocatorComponent } from 'src/app/components/modal/modal-threat-locator/modal-threat-locator.component';
import { ModalUpdateChangeLogComponent } from 'src/app/components/modal/modal-update-change-log.component/modal-update-change-log.component';
import { ModalVoiceComponent } from 'src/app/components/modal/modal-voice/modal-voice.component';
import { ModalWifiSecuriryLocationNoticeComponent } from 'src/app/components/modal/modal-wifi-securiry-location-notice/modal-wifi-securiry-location-notice.component';
import { ModalWifiSecurityInvitationComponent } from 'src/app/components/modal/modal-wifi-security-invitation/modal-wifi-security-invitation.component';
import { SharedModule } from '../shared.module';

@NgModule({
	declarations: [
		// ModalServerSwitchComponent,
		DownloadFailedModalComponent,
		ModalAboutComponent,
		ModalArticleDetailComponent,
		ModalBatteryChargeThresholdComponent,
		ModalChsWelcomeContainerComponent,
		ModalCommonConfirmationComponent,
		ModalErrorMessageComponent,
		ModalHomeProtectionLocationNoticeComponent,
		ModalIntelligentCoolingModesComponent,
		ModalLicenseComponent,
		ModalSupportWechatComponent,
		ModalThreatLocatorComponent,
		ModalUpdateChangeLogComponent,
		ModalVoiceComponent,
		ModalVoiceComponent,
		ModalWifiSecuriryLocationNoticeComponent,
		ModalWifiSecurityInvitationComponent,
	],
	imports: [
		CommonModule,
		SharedModule,
	],
	exports: [
		SharedModule,
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	],
	entryComponents: [
		// ModalServerSwitchComponent,
		DownloadFailedModalComponent,
		ModalAboutComponent,
		ModalArticleDetailComponent,
		ModalBatteryChargeThresholdComponent,
		ModalChsWelcomeContainerComponent,
		ModalCommonConfirmationComponent,
		ModalErrorMessageComponent,
		ModalHomeProtectionLocationNoticeComponent,
		ModalIntelligentCoolingModesComponent,
		ModalLicenseComponent,
		ModalSupportWechatComponent,
		ModalThreatLocatorComponent,
		ModalUpdateChangeLogComponent,
		ModalVoiceComponent,
		ModalVoiceComponent,
		ModalWifiSecuriryLocationNoticeComponent,
		ModalWifiSecurityInvitationComponent,
	]
})
export class CommonModalModule { }
