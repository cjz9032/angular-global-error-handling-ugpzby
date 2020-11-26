import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { HeaderMainModule } from '../header-main/header-main.module';
import { PageLayoutComponent } from './page-layout.component';

@NgModule({
	declarations: [PageLayoutComponent],
	exports: [PageLayoutComponent, HeaderMainModule],
	imports: [CommonModule, HeaderMainModule],
	schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class PageLayoutModule {}
