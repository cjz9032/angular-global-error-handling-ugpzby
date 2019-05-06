import { Attribute, Component, ViewEncapsulation } from '@angular/core';
import { InlineSvgService } from './inline-svg.service';

@Component({
	selector: 'vtr-inline-svg',
	templateUrl: './inline-svg.component.html',
	styleUrls: ['./inline-svg.component.scss'],
	encapsulation: ViewEncapsulation.None // need for styling from outsize of component
})
export class InlineSvgComponent {

	svgContent = this.service.getSvg(this.src);

	constructor(
		@Attribute('src') private src: string = '',
		private service: InlineSvgService
	) {

	}
}
