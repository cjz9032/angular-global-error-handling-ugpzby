import { Component, Input } from '@angular/core';

@Component({
	selector: 'vtr-menu-main',
	templateUrl: './menu-main.component.html'
})
export class MenuMainComponent {
	@Input() isGaming: boolean;
	@Input() machineInfo: any;

}
