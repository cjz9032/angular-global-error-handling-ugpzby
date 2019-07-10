import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageSecurityComponent } from 'src/app/components/pages/page-security/page-security.component';
import { PageSecurityAntivirusComponent } from 'src/app/components/pages/page-security-antivirus/page-security-antivirus.component';
import { PageSecurityWifiComponent } from 'src/app/components/pages/page-security-wifi/page-security-wifi.component';
import { PageSecurityPasswordComponent } from 'src/app/components/pages/page-security-password/page-security-password.component';
import { PageSecurityInternetComponent } from 'src/app/components/pages/page-security-internet/page-security-internet.component';
import { PageSecurityWindowsHelloComponent } from 'src/app/components/pages/page-security-windows-hello/page-security-windows-hello.component';


const routes: Routes = [
	{
		path: '',
		component: PageSecurityComponent,
	}, {
		path: 'anti-virus',
		component: PageSecurityAntivirusComponent,
	}, {
		path: 'wifi-security',
		component: PageSecurityWifiComponent,
	}, {
		path: 'password-protection',
		component: PageSecurityPasswordComponent,
	}, {
		path: 'internet-protection',
		component: PageSecurityInternetComponent,
	}, {
		path: 'windows-hello',
		component: PageSecurityWindowsHelloComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SecurityAdvisorRoutingModule { }
