import { Injectable, ComponentFactoryResolver, ComponentFactory } from '@angular/core';
import { ModalNewFeatureTipComponent } from 'src/app/components/modal/modal-new-feature-tip/modal-new-feature-tip.component';

@Injectable({
	providedIn: 'root'
})
export class NewFeatureTipService {

	viewContainer: any;

	constructor(
		private componentFactoryResolver: ComponentFactoryResolver
	) {}

	create() {
		const factory: ComponentFactory<ModalNewFeatureTipComponent> = this.componentFactoryResolver.resolveComponentFactory(ModalNewFeatureTipComponent);
		this.viewContainer.clear();
		this.viewContainer.createComponent(factory);
	}

	clearContainer() {
		this.viewContainer.clear();
	}
}
