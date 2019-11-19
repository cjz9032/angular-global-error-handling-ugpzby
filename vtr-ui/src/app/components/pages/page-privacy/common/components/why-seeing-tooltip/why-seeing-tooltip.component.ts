import { Component, Input } from '@angular/core';

@Component({
	selector: 'vtr-why-seeing-tooltip',
	templateUrl: './why-seeing-tooltip.component.html',
	styleUrls: ['./why-seeing-tooltip.component.scss']
})
export class WhySeeingTooltipComponent {
	@Input() contextText: string;
}
