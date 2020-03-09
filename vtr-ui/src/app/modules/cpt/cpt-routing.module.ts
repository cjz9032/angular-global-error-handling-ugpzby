import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageCptComponent } from 'src/app/components/pages/page-cpt/page-cpt.component';

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
export class CptRoutingModule { }
