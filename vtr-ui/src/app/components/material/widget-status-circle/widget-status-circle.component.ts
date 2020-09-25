import { Component, Input, DoCheck, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GradientColor } from 'src/app/data-models/security-advisor/gradient-color.model';

@Component({
  selector: 'vtr-widget-status-circle',
  templateUrl: './widget-status-circle.component.html',
  styleUrls: ['./widget-status-circle.component.scss']
})
export class WidgetStatusCircleComponent implements DoCheck, AfterViewInit {
	@Input() gradientColor: GradientColor;
	@Input() status: number;
	@ViewChild('circleContainer') circleContainer: ElementRef;

	translateString: any;
	levelText: string;
	currentStatus: number;

	securityLevelInfo = [
		'security.landing.noProtection',
		'security.landing.basic',
		'security.landing.intermediate',
		'security.landing.advanced',
	];

	constructor(
		translate: TranslateService,
		public elementRef: ElementRef,
		public renderer2: Renderer2
	) {
		translate.stream([
			'security.landing.noProtection',
			'security.landing.basic',
			'security.landing.intermediate',
			'security.landing.advanced',
		]).subscribe((res: any) => {
			this.translateString = res;
			if (this.status !== undefined) {
				this.currentStatus = this.status;
				this.levelText = res[this.securityLevelInfo[this.status]];
			}
		});
	}
	ngDoCheck(): void {
		if ((!this.levelText && this.translateString && this.status !== undefined)
			|| this.status !== this.currentStatus) {
			this.currentStatus = this.status;
			this.levelText = this.translateString[this.securityLevelInfo[this.status]];
		}
	}

	ngAfterViewInit(): void {
		const hasClass = this.elementRef.nativeElement.hasAttribute('class');
		this.renderer2.addClass(this.circleContainer.nativeElement, hasClass ? this.elementRef.nativeElement.getAttribute('class') : '');
	}

}
