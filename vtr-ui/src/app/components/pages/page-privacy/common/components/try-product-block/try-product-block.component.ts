import { Component, Input } from '@angular/core';

@Component({
	selector: 'vtr-try-product-block',
	templateUrl: './try-product-block.component.html',
	styleUrls: ['./try-product-block.component.scss']
})
export class TryProductBlockComponent {
	@Input() isFigleafReadyToCommunication = false;
	@Input() texts: {
		risk: string;
		howToFix: string;
		riskAfterInstallFigleaf?: string;
		howToFixAfterInstallFigleaf?: string;
	};
}
