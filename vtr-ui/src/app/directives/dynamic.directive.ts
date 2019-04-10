import { Type, Component, Directive, NgModule, OnChanges, Input, ComponentRef, ViewContainerRef, Compiler, ModuleWithComponentFactories } from '@angular/core';

@Directive({
	selector: '[vtrDynamic]'
})
export class DynamicDirective implements OnChanges {
	@Input() compile: string;
	@Input() compileContext: any;

	compRef: ComponentRef<any>;

	constructor(private vcRef: ViewContainerRef, private compiler: Compiler) { }

	ngOnChanges() {
		if (!this.compile) {
			if (this.compRef) {
				this.updateProperties();
				return;
			}
			throw Error('Missing template');
		}

		this.vcRef.clear();

		const component = this.createDynamicComponent(this.compile);
		const module = this.createDynamicModule(component);
		this.compiler.compileModuleAndAllComponentsAsync(module)
			.then((moduleWithFactories: ModuleWithComponentFactories<any>) => {
				const compFactory = moduleWithFactories.componentFactories.find(x => x.componentType === component);
				this.compRef = this.vcRef.createComponent(compFactory);
				this.updateProperties();
			})
			.catch(error => {
				console.log(error);
			});
	}

	updateProperties() {
		Object.getOwnPropertyNames(this.compileContext).forEach(prop => {
			this.compRef.instance[prop] = this.compileContext[prop];
		});
	}

	private createDynamicComponent(template: string) {
		@Component({
			selector: 'vtr-custom-dynamic-component',
			styles: ['a { text-decoration: underline; } }', '* { font-size: 1.6rem; }'],
			template: `<span>${template}</span>`
		})
		class CustomDynamicComponent { }
		return CustomDynamicComponent;
	}

	private createDynamicModule(component: Type<any>) {
		@NgModule({
			declarations: [component]
		})
		class DynamicModule { }
		return DynamicModule;
	}
}