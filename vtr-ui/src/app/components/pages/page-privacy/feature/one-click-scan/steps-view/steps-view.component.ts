import { Component, Input } from '@angular/core';

@Component({
	selector: 'vtr-steps-view',
	templateUrl: './steps-view.component.html',
	styleUrls: ['./steps-view.component.scss']
})
export class StepsViewComponent {
	@Input() index: number;
	@Input() length: number;
}
