import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermitTrackersAndPasswordsGuard } from './permit-trackers-and-passwords.guard';

@NgModule({
	declarations: [],
	imports: [
		CommonModule
	],
	providers: [
		PermitTrackersAndPasswordsGuard
	]
})
export class GuardsModule {
}
