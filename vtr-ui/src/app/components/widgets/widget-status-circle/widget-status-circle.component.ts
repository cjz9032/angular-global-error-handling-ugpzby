import { Component, Input } from '@angular/core';
import { GradientColor } from 'src/app/data-models/security-advisor/gradient-color.model';

@Component({
  selector: 'vtr-widget-status-circle',
  templateUrl: './widget-status-circle.component.html',
  styleUrls: ['./widget-status-circle.component.scss']
})
export class WidgetStatusCircleComponent {
	@Input() gradientColor: GradientColor;
	@Input() status: number;
	@Input() isAbsolute = false;
	@Input() id: string;

	securityLevelInfo = [
		'security.landing.noProtection',
		'security.landing.basic',
		'security.landing.intermediate',
		'security.landing.advanced',
	];

}
