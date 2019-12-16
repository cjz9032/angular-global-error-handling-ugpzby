import { Component, Input } from '@angular/core';

@Component({
	selector: 'vtr-spinner',
	templateUrl: './spinner.component.html',
	styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent {
	@Input() className = 'spinner';
}
