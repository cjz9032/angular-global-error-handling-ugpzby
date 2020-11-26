import { Component, Input } from '@angular/core';
import { SmartPerformanceDialogService } from 'src/app/services/smart-performance/smart-performance-dialog.service';
import { SmartPerformanceService } from 'src/app/services/smart-performance/smart-performance.service';

@Component({
	selector: 'vtr-widget-recommend-action',
	templateUrl: './widget-recommend-action.component.html',
	styleUrls: ['./widget-recommend-action.component.scss'],
})
export class WidgetRecommendActionComponent {
	@Input() isDisabled = false;

	constructor(
		private smartPerformanceDialogService: SmartPerformanceDialogService,
		public smartPerformanceService: SmartPerformanceService
	) {}

	openSubscribeModal() {
		this.smartPerformanceDialogService.openSubscribeModal();
	}
}
