import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
//cpt 
import { PageCptComponent } from 'src/app/components/pages/page-cpt/page-cpt.component';
import { CptpageDeviceSettingsComponent } from 'src/app/components/pages/page-cpt/children/hardware-settings/cptpage-device-settings/cptpage-device-settings.component';
import { CptpageDashboardComponent } from 'src/app/components/pages/page-cpt/children/hardware-settings/cptpage-dashboard/cptpage-dashboard.component';
import { CptpageMyDeviceComponent } from 'src/app/components/pages/page-cpt/children/hardware-settings/cptpage-my-device/cptpage-my-device.component';
import { CptpageDeviceUpdatesComponent } from 'src/app/components/pages/page-cpt/children/hardware-settings/cptpage-device-updates/cptpage-device-updates.component';
import { CptpageSmartAssistComponent } from 'src/app/components/pages/page-cpt/children/hardware-settings/cptpage-smart-assist/cptpage-smart-assist.component';
import { CptpageSecurityComponent } from 'src/app/components/pages/page-cpt/children/hardware-settings/cptpage-security/cptpage-security.component';
import { CptpageSecurityAntivirusComponent } from 'src/app/components/pages/page-cpt/children/hardware-settings/cptpage-security-antivirus/cptpage-security-antivirus.component';
import { CptpageSecurityPasswordComponent } from 'src/app/components/pages/page-cpt/children/hardware-settings/cptpage-security-password/cptpage-security-password.component';
import { CptpageSecurityWifiComponent } from 'src/app/components/pages/page-cpt/children/hardware-settings/cptpage-security-wifi/cptpage-security-wifi.component';
import { CptpageSecurityInternetComponent } from 'src/app/components/pages/page-cpt/children/hardware-settings/cptpage-security-internet/cptpage-security-internet.component';
import { CptpageSupportComponent } from 'src/app/components/pages/page-cpt/children/hardware-settings/cptpage-support/cptpage-support.component';
import { CptpageDeviceGamingComponent } from 'src/app/components/pages/page-cpt/children/gaming/cptpage-device-gaming/cptpage-device-gaming.component';
import { CptpageMacrokeyComponent } from 'src/app/components/pages/page-cpt/children/gaming/cptpage-macrokey/cptpage-macrokey.component';

//misc
import { CommonModule } from '@angular/common';
import { SupportModule } from '../support/support.module';
import { CptRoutingModule } from './cpt-routing.module';
import { HardwareSettingsModule } from '../hardware-settings/hardware-settings.module';
import { HardwareDashboardModule } from '../hardware-settings/hardware-dashboard.module';
import { SecurityAdvisorModule } from '../security-advisor/security-advisor.module';
import { UIArticleItemComponent } from 'src/app/components/ui/ui-article-item/ui-article-item.component';
import { ContainerArticleComponent } from 'src/app/components/container-article/container-article.component';
import { GamingDashboardModule } from '../gaming-dashboard.module';
import { CptpageLightingcustomizeComponent } from 'src/app/components/pages/page-cpt/children/gaming/cptpage-lightingcustomize/cptpage-lightingcustomize.component';
import { CptpageNetworkboostComponent } from 'src/app/components/pages/page-cpt/children/gaming/cptpage-networkboost/cptpage-networkboost.component';
import { CptpageAutocloseComponent } from 'src/app/components/pages/page-cpt/children/gaming/cptpage-autoclose/cptpage-autoclose.component';


@NgModule({
	declarations: [
		PageCptComponent,
		//cpt
		CptpageDeviceSettingsComponent,
		CptpageMyDeviceComponent,
		CptpageDashboardComponent,
		CptpageDeviceUpdatesComponent,
		CptpageSmartAssistComponent,
		CptpageSecurityComponent,
		CptpageSecurityAntivirusComponent,
		CptpageSecurityPasswordComponent,
		CptpageSecurityWifiComponent,
		CptpageSecurityInternetComponent,
		CptpageSupportComponent,
		CptpageDeviceGamingComponent,
		CptpageMacrokeyComponent,
		CptpageLightingcustomizeComponent,
		CptpageNetworkboostComponent,
		CptpageAutocloseComponent

	],
	imports: [
		CommonModule,
		CptRoutingModule,
		SupportModule,
		HardwareSettingsModule,
		HardwareDashboardModule,
		SecurityAdvisorModule,
		//gaming
		GamingDashboardModule
	],
	providers: [],
	exports: [],
	entryComponents: [
		UIArticleItemComponent,
		ContainerArticleComponent
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class CptModule { }
