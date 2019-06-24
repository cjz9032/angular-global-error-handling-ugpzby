import { Component, Input } from '@angular/core';

@Component({
	selector: 'vtr-stat',
	templateUrl: './stat.component.html',
	styleUrls: ['./stat.component.scss']
})
export class StatComponent {
	@Input() dashboardData;
}
