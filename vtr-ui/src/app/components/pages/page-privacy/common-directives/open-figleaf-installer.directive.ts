import { Directive, HostListener } from '@angular/core';
import { VantageCommunicationService } from '../common-services/vantage-communication.service';

@Directive({
	selector: '[vtrOpenFigleafInstaller]'
})
export class OpenFigleafInstallerDirective {

	constructor(private vantageCommunicationService: VantageCommunicationService) {
	}

	@HostListener('click', ['$event']) onClick() {
		this.vantageCommunicationService.openInstaller().subscribe(
			(res) => console.log('openInstaller', res),
			(err) => console.log('openInstaller', err),
		);
	}
}
