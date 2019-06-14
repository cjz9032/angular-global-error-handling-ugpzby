import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'vtr-try-product-block',
	templateUrl: './try-product-block.component.html',
	styleUrls: ['./try-product-block.component.scss']
})
export class TryProductBlockComponent {
	@Input() texts: {
		risk: string;
		howToFix: string;
	};

	@Output() buttonClick = new EventEmitter();
}
