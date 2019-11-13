import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModalModernPreloadComponent } from 'src/app/components/modal/modal-modern-preload/modal-modern-preload.component';
import { GuardService } from 'src/app/services/guard/guardService.service';
import { NonArmGuard } from 'src/app/services/guard/non-arm-guard';
import { NonGamingGuard } from 'src/app/services/guard/non-gaming-guard';
import { NonSmodeGuard } from 'src/app/services/guard/non-smode-guard';

const routes: Routes = [
	{
		path: '',
		component: ModalModernPreloadComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService, NonGamingGuard, NonSmodeGuard, NonArmGuard],
		data: {
			pageName: 'Page.ModernPreload'
		}
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(routes)
	],
	exports: [
		RouterModule
	]
})
export class ModernPreloadRoutingModule { }
