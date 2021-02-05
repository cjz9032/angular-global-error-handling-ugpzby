import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { HeaderMainModule } from '../header-main/header-main.module';
import { PageLayoutComponent } from './page-layout.component';
import { SubPageLayoutComponent } from './subpage-layout/subpage-layout.component';

@NgModule({
	declarations: [PageLayoutComponent, SubPageLayoutComponent],
	exports: [PageLayoutComponent, HeaderMainModule, SubPageLayoutComponent],
	imports: [CommonModule, HeaderMainModule],
	schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class PageLayoutModule { }
