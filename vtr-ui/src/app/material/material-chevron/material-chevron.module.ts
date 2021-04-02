// angular module
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// material module
import { MatCardModule } from '@lenovo/material/card';
import { MatListModule } from '@lenovo/material/list';
import { MatTooltipModule } from '@lenovo/material/tooltip';
import { MatProgressSpinnerModule } from '@lenovo/material/progress-spinner';
// font awesome module
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons/faQuestionCircle';
import { faChevronCircleRight } from '@fortawesome/pro-light-svg-icons/faChevronCircleRight';
import { faChevronRight } from '@fortawesome/pro-light-svg-icons/faChevronRight';
import { faCircle } from '@fortawesome/free-solid-svg-icons/faCircle';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons/faCheckCircle';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { faCircle as falCircle } from '@fortawesome/free-regular-svg-icons/faCircle';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';
import { faChevronDown as falChevronDown } from '@fortawesome/pro-light-svg-icons/faChevronDown';
import { faChevronUp as falChevronUp } from '@fortawesome/pro-light-svg-icons/faChevronUp';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons/faChevronUp';
import { faRedo } from '@fortawesome/free-solid-svg-icons/faRedo';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faMinus } from '@fortawesome/free-solid-svg-icons/faMinus';
import { faExclamation } from '@fortawesome/free-solid-svg-icons/faExclamation';
import { faPause } from '@fortawesome/free-solid-svg-icons/faPause';
// component
import { MaterialChevronComponent } from './material-chevron.component';
import { MaterialChevronListComponent } from './material-chevron-list/material-chevron-list.component';
import { MaterialStatusIconComponent } from './material-status-icon/material-status-icon.component';
// project module
import { MetricsModule } from 'src/app/services/metric/metrics.module';
import { CommonPipeModule } from 'src/app/modules/common/common-pipe.module';
import { TranslationModule } from 'src/app/modules/translation.module';
import { CommonUiModule } from 'src/app/modules/common/common-ui.module';
import { StatusIconClassPipe } from './status-icon-class.pipe';
import { DetailAndIconClassPipe } from './detail-and-icon-class.pipe';

@NgModule({
	declarations: [
		MaterialChevronComponent,
		MaterialChevronListComponent,
		MaterialStatusIconComponent,
		StatusIconClassPipe,
		DetailAndIconClassPipe,
	],
	exports: [
		MaterialChevronComponent,
		MaterialChevronListComponent,
		MaterialStatusIconComponent,
		StatusIconClassPipe,
	],
	imports: [
		CommonModule,
		MatCardModule,
		MatListModule,
		TranslationModule.forChild(),
		CommonPipeModule,
		CommonUiModule,
		FontAwesomeModule,
		RouterModule,
		MetricsModule,
		MatTooltipModule,
		MatProgressSpinnerModule,
	],
})
export class MaterialChevronModule {
	constructor(library: FaIconLibrary) {
		library.addIcons(faQuestionCircle);
		library.addIcons(faChevronCircleRight);
		library.addIcons(faChevronRight);
		library.addIcons(faCircle);
		library.addIcons(faCheckCircle);
		library.addIcons(faChevronDown);
		library.addIcons(falCircle);
		library.addIcons(faExclamationCircle);
		library.addIcons(falChevronDown);
		library.addIcons(falChevronUp);
		library.addIcons(faChevronUp);
		library.addIcons(faRedo);
		library.addIcons(faTimes);
		library.addIcons(faCheck);
		library.addIcons(faCircle);
		library.addIcons(faMinus);
		library.addIcons(faExclamation);
		library.addIcons(faPause);
	}
}
