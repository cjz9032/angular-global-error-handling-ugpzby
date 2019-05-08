import { Component, Input } from '@angular/core';

@Component({
	selector: 'vtr-common-text',
	templateUrl: './common-text.component.html',
	styleUrls: ['./common-text.component.scss']
})
export class CommonTextComponent {
	@Input() texts: {title: string; text: string};
}
