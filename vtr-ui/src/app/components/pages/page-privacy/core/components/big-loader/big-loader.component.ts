import { Component, Input } from '@angular/core';

@Component({
	selector: 'vtr-big-loader',
	templateUrl: './big-loader.component.html',
	styleUrls: ['./big-loader.component.scss']
})
export class BigLoaderComponent {
	@Input() text: string;
}
