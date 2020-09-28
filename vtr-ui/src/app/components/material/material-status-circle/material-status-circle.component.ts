import { Component, Input, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Gradient } from 'src/app/data-models/security-advisor/gradient-color.model';

@Component({
  selector: 'vtr-material-status-circle',
  templateUrl: './material-status-circle.component.html',
  styleUrls: ['./material-status-circle.component.scss']
})
export class MaterialStatusCircleComponent implements AfterViewInit {
	@Input() gradientColor: Gradient;
	@Input() statusText: string;
	@ViewChild('circleContainer') circleContainer: ElementRef;

	constructor(
		public translate: TranslateService,
		public elementRef: ElementRef,
		public renderer2: Renderer2
	) {	}


	ngAfterViewInit(): void {
		const hasClass = this.elementRef.nativeElement.hasAttribute('class');
		this.renderer2.addClass(this.circleContainer.nativeElement, hasClass ? this.elementRef.nativeElement.getAttribute('class') : '');
	}

}
