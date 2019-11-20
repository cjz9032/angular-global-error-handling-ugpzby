import { Component, Input } from '@angular/core';
import { FigleafDashboard } from '../../core/services/figleaf-overview.service';

@Component({
	selector: 'vtr-stat',
	templateUrl: './stat.component.html',
	styleUrls: ['./stat.component.scss']
})
export class StatComponent {
	@Input() dashboardData: FigleafDashboard;
}
