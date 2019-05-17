import { ChangeDetectionStrategy, Component, ComponentFactoryResolver, Injector, OnInit } from '@angular/core';
import { RegistrationComponentService } from './services/registration-component.service';
import { PermitItem, PermitItemInputData } from './permit-item';
import { PERMIT_ITEM_DATA } from '../../utils/injection-tokens';

@Component({
	selector: 'vtr-one-click-scan',
	templateUrl: './one-click-scan.component.html',
	styleUrls: ['./one-click-scan.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class OneClickScanComponent implements OnInit {
	permitItems = this.registrationComponentService.getComponents();

	constructor(
		private componentFactoryResolver: ComponentFactoryResolver,
		private registrationComponentService: RegistrationComponentService,
		private injector: Injector
	) {
	}

	ngOnInit() {
		// this.loadComponents();

	}

	createInjector(data: PermitItemInputData) {
		return Injector.create({
			providers: [
			{ provide: PERMIT_ITEM_DATA, useValue: data }
			],
			parent: this.injector
		});
	}

	// loadComponents() {
	// 	const viewContainerRef = this.vtrPermit.viewContainerRef;
	// 	const permitItems = this.registrationComponentService.getComponents();
	// 	viewContainerRef.clear();
	//
	// 	permitItems.forEach((permitItem) => {
	// 		const componentFactory = this.componentFactoryResolver.resolveComponentFactory(permitItem.component);
	// 		const componentRef = viewContainerRef.createComponent(componentFactory);
	// 		(<OneClickScan>componentRef.instance).data = permitItem.data;
	// 		(<OneClickScan>componentRef.instance).allow.subscribe((val) => console.log(val));
	// 	});
	//
	// 	console.log(viewContainerRef)
	// }

}
