import { Component, Input, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Gradient, GradientColor } from 'src/app/data-models/security-advisor/gradient-color.model';
import { LandingView } from 'src/app/data-models/security-advisor/widegt-security-landing/landing-view.model';

@Component({
  selector: 'vtr-material-status-circle',
  templateUrl: './material-status-circle.component.html',
  styleUrls: ['./material-status-circle.component.scss']
})
export class MaterialStatusCircleComponent implements AfterViewInit {
	@Input() statusText: string;
	@ViewChild('circleContainer') circleContainer: ElementRef;
	gradient: Gradient;
	constructor(
		public translate: TranslateService,
		public elementRef: ElementRef,
		public renderer2: Renderer2
	) {	}

	public colors = [
		{
			start: '#FF5B4D',
			end: '#DB221F'
		}, {
			start: '#EAB029',
			end: '#F0D662'
		}, {
			start: '#346CEF',
			end: '#2955BC'
		}, {
			start: '#00A886',
			end: '#00893A'
		}
	];

	@Input() set gradientColor(gradient: LandingView) {
		const color: GradientColor = {
			start: this.colors[gradient.status].start,
			end: this.colors[gradient.status].end
		}
		this.gradient = new Gradient(color, gradient.percent);
	}

	get gradientColor() {
		return this.gradientColor;
	}

	ngAfterViewInit(): void {
		const hasClass = this.elementRef.nativeElement.hasAttribute('class');
		this.renderer2.addClass(this.circleContainer.nativeElement, hasClass ? this.elementRef.nativeElement.getAttribute('class') : '');
	}

}
