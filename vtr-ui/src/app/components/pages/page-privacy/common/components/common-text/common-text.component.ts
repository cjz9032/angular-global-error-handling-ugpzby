import { Component, Input } from '@angular/core';

@Component({
	selector: 'vtr-common-text',
	templateUrl: './common-text.component.html',
	styleUrls: ['./common-text.component.scss']
})
export class CommonTextComponent { // TODO check in new design if need
	@Input() texts: {title: string; text: string};
}
