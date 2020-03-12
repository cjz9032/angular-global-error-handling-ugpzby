import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { PageCptComponent } from 'src/app/components/pages/page-cpt/page-cpt.component';
import { environment } from 'src/environments/environment';

const routes: Routes = [
	{
		path: '',
		component: PageCptComponent,
		canDeactivate: [],
		canActivate: [],
		data: {
			pageName: 'Page.Cpt'
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
export class CptRoutingModule {
	constructor(public router: Router) {
		let idx = this.router.config.findIndex(r => r.path === 'cpt');
		if (!environment.isCPTEnabled && idx>-1) {
			this.router.config.splice(idx, 1);//remove cpt
		}
	}
}
