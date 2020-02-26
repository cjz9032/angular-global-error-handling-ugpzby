import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { DownloadFailedModalComponent } from 'src/app/components/pages/page-smart-assist/voice/download-failed-modal/download-failed-modal.component';
import { ModalBatteryChargeThresholdComponent } from 'src/app/components/modal/modal-battery-charge-threshold/modal-battery-charge-threshold.component';
import { ModalRebootConfirmComponent } from 'src/app/components/modal/modal-reboot-confirm/modal-reboot-confirm.component';
import { ModalErrorMessageComponent } from 'src/app/components/modal/modal-error-message/modal-error-message.component';
import { ModalHomeProtectionLocationNoticeComponent } from 'src/app/components/modal/modal-home-protection-location-notice/modal-home-protection-location-notice.component';
import { ModalIntelligentCoolingModesComponent } from 'src/app/components/modal/modal-intelligent-cooling-modes/modal-intelligent-cooling-modes.component';
import { ModalThreatLocatorComponent } from 'src/app/components/modal/modal-threat-locator/modal-threat-locator.component';
import { ModalUpdateChangeLogComponent } from 'src/app/components/modal/modal-update-change-log.component/modal-update-change-log.component';
import { ModalVoiceComponent } from 'src/app/components/modal/modal-voice/modal-voice.component';
import { ModalWifiSecurityInvitationComponent } from 'src/app/components/modal/modal-wifi-security-invitation/modal-wifi-security-invitation.component';
// import { ModalServerSwitchComponent } from 'src/app/components/modal/modal-server-switch/modal-server-switch.component'; // VAN-5872, server switch feature
import { SharedModule } from '../shared.module';
import { MetricsModule } from 'src/app/services/metric/metrics.module';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalChsWelcomeContainerComponent } from 'src/app/components/pages/page-connected-home-security/component/modal-chs-welcome-container/modal-chs-welcome-container.component';
import { ModalChsStartTrialContainerComponent } from 'src/app/components/pages/page-connected-home-security/component/modal-chs-start-trial-container/modal-chs-start-trial-container.component';
import { ModalSmartStandByComponent } from 'src/app/components/modal/modal-smart-stand-by/modal-smart-stand-by.component';

@NgModule({
	declarations: [
		/*ModalServerSwitchComponent,*/
		DownloadFailedModalComponent,
		ModalBatteryChargeThresholdComponent,
		ModalErrorMessageComponent,
		ModalHomeProtectionLocationNoticeComponent,
		ModalIntelligentCoolingModesComponent,
		ModalThreatLocatorComponent,
		ModalUpdateChangeLogComponent,
		ModalVoiceComponent,
		ModalVoiceComponent,
		ModalWifiSecurityInvitationComponent,
		ModalChsWelcomeContainerComponent,
		ModalChsStartTrialContainerComponent,
		ModalRebootConfirmComponent,
		ModalSmartStandByComponent

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
		/*ModalServerSwitchComponent,*/
		DownloadFailedModalComponent,
		ModalBatteryChargeThresholdComponent,
		ModalErrorMessageComponent,
		ModalHomeProtectionLocationNoticeComponent,
		ModalIntelligentCoolingModesComponent,
		ModalThreatLocatorComponent,
		ModalUpdateChangeLogComponent,
		ModalVoiceComponent,
		ModalVoiceComponent,
		ModalWifiSecurityInvitationComponent,
		ModalChsWelcomeContainerComponent,
		ModalChsStartTrialContainerComponent,
		ModalRebootConfirmComponent,
		ModalSmartStandByComponent
	]
})
export class CommonModalModule { }
