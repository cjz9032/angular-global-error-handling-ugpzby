import { NgModule, ModuleWithProviders } from '@angular/core';
import { ToolbarToastService } from './toolbartoast.service';

@NgModule({
	providers: [ToolbarToastService]
})
export class ToolbarToastModule {
    
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ToolbarToastModule,
            providers: []
        };
    } 
}