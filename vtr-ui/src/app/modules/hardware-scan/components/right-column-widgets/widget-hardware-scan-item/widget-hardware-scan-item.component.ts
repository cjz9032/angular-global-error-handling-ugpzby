import { Component, OnInit, Input } from '@angular/core';
import { LenovoSupportService } from 'src/app/modules/hardware-scan/services/lenovo-support.service';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@lenovo/cdk/layout';

@Component({
	selector: 'vtr-widget-hardware-scan-item',
	templateUrl: './widget-hardware-scan-item.component.html',
	styleUrls: ['./widget-hardware-scan-item.component.scss']
})
export class WidgetHardwareScanItemComponent implements OnInit {
	@Input() items: any[];
	@Input() resultCodeText: string;
	@Input() isScanExecute = false;
	@Input() isRecoverExecute = false;
	@Input() isEnableViewResults = false;

	public tooltipText: string;
	public tooltipIndex: number;
	public isXsBreakpoint: boolean;
	public contactusUrl: string;

	constructor(private lenovoSupportService: LenovoSupportService, private breakPointObserver: BreakpointObserver) {
	}

	ngOnInit() {
		this.configureContactusUrl();
		this.getXsBreakpointStatus();
	}

	public setTooltipInfo(text: string, index: number) {
		this.tooltipText = text;
		this.tooltipIndex = index;
	}

	// Changes status expanded of the module test list when the user request
	public toggleTestListVisibility(item: any): void {
		item.expanded = !item.expanded;
		item.expandedStatusChangedByUser = !item.expandedStatusChangedByUser;
	}

	private async configureContactusUrl(): Promise<void> {
		await this.lenovoSupportService.getContactusUrl().then((response) => {
			this.contactusUrl = response;
		});
	}

	public openContactusPage(): void {
		window.open(this.contactusUrl);
	}

	/**
	 * Retrive if current observable breakpoint xSmall is matched and
	 * saves to isXsBreakpoint variable.
	 */
	private getXsBreakpointStatus(): void {
		this.breakPointObserver
		.observe([Breakpoints.XSmall])
		.subscribe((state: BreakpointState) => {
			this.isXsBreakpoint = state.matches;
		});
	}
}
