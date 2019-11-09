import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageSecurityComponent } from 'src/app/components/pages/page-security/page-security.component';
import { PageSecurityAntivirusComponent } from 'src/app/components/pages/page-security-antivirus/page-security-antivirus.component';
import { PageSecurityWifiComponent } from 'src/app/components/pages/page-security-wifi/page-security-wifi.component';
import { PageSecurityPasswordComponent } from 'src/app/components/pages/page-security-password/page-security-password.component';
import { PageSecurityInternetComponent } from 'src/app/components/pages/page-security-internet/page-security-internet.component';
import { PageSecurityWindowsHelloComponent } from 'src/app/components/pages/page-security-windows-hello/page-security-windows-hello.component';
import { GuardService } from 'src/app/services/guard/guardService.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { WindowsHelloGuardService } from 'src/app/services/guard/windows-hello-guardService.service';
import { VpnGuardService } from 'src/app/services/guard/vpn-guardService.service';
import { NoneThinkGuard } from 'src/app/services/guard/none-think-guard';
import { NoneSmodeGuard } from 'src/app/services/guard/none-smode-guard';
import { NoneArmGuard } from 'src/app/services/guard/none-arm-guard';
import { NoneGamingGuard } from 'src/app/services/guard/none-gaming-guard';


const routes: Routes = [
	{
		path: '',
		component: PageSecurityComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService, NoneThinkGuard, NoneSmodeGuard, NoneArmGuard, NoneGamingGuard],
		data: {
			pageName: 'Security'
		}
	}, {
		path: 'anti-virus',
		component: PageSecurityAntivirusComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService, NoneThinkGuard, NoneSmodeGuard, NoneArmGuard, NoneGamingGuard],
		data: {
			pageName: 'Security.AntiVirus',
			pageContent: LocalStorageKey.SecurityCurrentPage
		}
	}, {
		path: 'wifi-security',
		component: PageSecurityWifiComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService, NoneSmodeGuard, NoneArmGuard, NoneGamingGuard],
		data: {
			pageName: 'Security.WifiSecurity'
		}
	}, {
		path: 'password-protection',
		component: PageSecurityPasswordComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService, NoneThinkGuard, NoneSmodeGuard, NoneArmGuard, NoneGamingGuard],
		data: {
			pageName: 'Security.PasswordProtection'
		}
	}, {
		path: 'internet-protection',
		component: PageSecurityInternetComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService, VpnGuardService, NoneThinkGuard, NoneSmodeGuard, NoneArmGuard, NoneGamingGuard],
		data: {
			pageName: 'Security.InternetProtection'
		}
	}, {
		path: 'windows-hello',
		component: PageSecurityWindowsHelloComponent,
		canActivate: [GuardService, WindowsHelloGuardService, NoneThinkGuard, NoneSmodeGuard, NoneArmGuard, NoneGamingGuard],
		canDeactivate: [GuardService],
		data: {
			pageName: 'Security.WindowsHello'
		}
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SecurityAdvisorRoutingModule { }
