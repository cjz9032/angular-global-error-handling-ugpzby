import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';

@Injectable({
	providedIn: 'root'
})
export class MetricService {
	private metrics: any;

	constructor(private shellService: VantageShellService) {
		this.metrics = this.shellService.getMetrics();
	}

	public sendMetrics(data: any) {
		if (this.metrics && this.metrics.sendAsync) {
			this.metrics.sendAsync(data);
		}
	}
}
