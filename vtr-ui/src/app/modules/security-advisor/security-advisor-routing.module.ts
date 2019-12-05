import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageSecurityComponent } from 'src/app/components/pages/page-security/page-security.component';
import { PageSecurityAntivirusComponent } from 'src/app/components/pages/page-security-antivirus/page-security-antivirus.component';
import { PageSecurityWifiComponent } from 'src/app/components/pages/page-security-wifi/page-security-wifi.component';
import { PageSecurityPasswordComponent } from 'src/app/components/pages/page-security-password/page-security-password.component';
import { PageSecurityInternetComponent } from 'src/app/components/pages/page-security-internet/page-security-internet.component';
import { GuardService } from 'src/app/services/guard/guardService.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { VpnGuardService } from 'src/app/services/guard/vpn-guardService.service';
import { NonSmodeGuard } from 'src/app/services/guard/non-smode-guard';
import { NonArmGuard } from 'src/app/services/guard/non-arm-guard';
import { NonGamingGuard } from 'src/app/services/guard/non-gaming-guard';
import { NonCommercialGuard } from 'src/app/services/guard/non-commercial-guard';
import { WifiGuardService } from 'src/app/services/guard/wifi-guardService.service';


const routes: Routes = [
	{
		path: '',
		component: PageSecurityComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService, NonCommercialGuard, NonSmodeGuard, NonArmGuard, NonGamingGuard],
		data: {
			pageName: 'Security'
		}
	}, {
		path: 'anti-virus',
		component: PageSecurityAntivirusComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService, NonCommercialGuard, NonSmodeGuard, NonArmGuard, NonGamingGuard],
		data: {
			pageName: 'Security.AntiVirus',
			pageContent: LocalStorageKey.SecurityCurrentPage
		}
	}, {
		path: 'password-protection',
		component: PageSecurityPasswordComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService, NonCommercialGuard, NonSmodeGuard, NonArmGuard, NonGamingGuard],
		data: {
			pageName: 'Security.PasswordProtection'
		}
	}, {
		path: 'wifi-security',
		component: PageSecurityWifiComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService, WifiGuardService,  NonSmodeGuard, NonArmGuard],
		data: {
			pageName: 'Security.WifiSecurity'
		}
	}, {
		path: 'internet-protection',
		component: PageSecurityInternetComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService, VpnGuardService, NonCommercialGuard, NonSmodeGuard, NonArmGuard, NonGamingGuard],
		data: {
			pageName: 'Security.InternetProtection'
		}
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SecurityAdvisorRoutingModule { }
