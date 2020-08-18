import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonUiModule } from '../common/common-ui.module';
import { CommonPipeModule } from '../common/common-pipe.module';
import { CommonWidgetModule } from '../common/common-widget.module';
import { SharedModule } from '../shared.module';
import { ClipboardModule } from 'ngx-clipboard';

import { ModalModernPreloadComponent } from 'src/app/components/modal/modal-modern-preload/modal-modern-preload.component';
import { WidgetModernPreloadAppComponent } from 'src/app/components/widgets/widget-modern-preload-app/widget-modern-preload-app.component';
import { ModernPreloadService } from 'src/app/services/modern-preload/modern-preload.service';

import { faCopy } from '@fortawesome/pro-light-svg-icons/faCopy';
import { faEye } from '@fortawesome/free-regular-svg-icons/faEye';
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons/faEyeSlash';
import { faExternalLink } from '@fortawesome/pro-light-svg-icons/faExternalLink';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';


@NgModule({
	declarations: [
		ModalModernPreloadComponent,
		WidgetModernPreloadAppComponent,
	],
	imports: [
		CommonModule,
		CommonUiModule,
		CommonPipeModule,
		CommonWidgetModule,
		SharedModule,
		ClipboardModule,
		FontAwesomeModule
	],
	providers: [
		ModernPreloadService,
	],
	entryComponents: [
		ModalModernPreloadComponent,
		WidgetModernPreloadAppComponent,
	]
})
export class ModernPreloadModule {
	constructor(library: FaIconLibrary) {
		library.addIcons(
			faCopy,
			faEye,
			faEyeSlash,
			faExternalLink
		);
	}
}
