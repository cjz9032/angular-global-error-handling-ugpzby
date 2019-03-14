import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { VantageShellService } from '../services/vantage-shell/vantage-shell.service';



@Directive({
    selector: '[vtrMetrics]'
})
export class MetricsDirective {
    constructor(private el: ElementRef, private shellService: VantageShellService) { 
        this.metrics = shellService.getMetrics();
    }

    private metrics: any;

    @Input() metricsItem: string;
    @Input() metricsEvent: string;
    @Input() metricsValue: string;
    @Input() metricsParent: string;
    @Input() metricsParam: string;

    @HostListener('click') onclick() {
        if (this.metrics) {
            const data: any = {
                ItemName: this.metricsItem,
                ItemType: this.metricsEvent,
                ItemParent: this.metricsParent,
            };
            if (this.metricsParam) {
                data.ItemParam = this.metricsParam;
            }
            if (this.metricsValue) {
                data.metricsValue = this.metricsValue;
            }
            this.metrics.sendAsync(data);
        }
        
        {
            const data: any = {
                ItemName: this.metricsItem,
                ItemType: this.metricsEvent,
                ItemParent: this.metricsParent,
            };
            if (this.metricsParam) {
                data.ItemParam = this.metricsParam;
            }
            if (this.metricsValue) {
                data.metricsValue = this.metricsValue;
            }

            console.log('sending the metrics with metrics service' + JSON.stringify(data));
        }
    }
}
