import { Injectable } from "@angular/core";
import { VantageShellService } from '../vantage-shell/vantage-shell.service';

@Injectable({
    providedIn: 'root'
})
export class ToolbarToastService {
    toolbartoast: any;
    constructor(
        private shellService: VantageShellService
    ) {

    }
    showVantageToolbarToast() {
        console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++Call showVantageToolbarToast");
        this.toolbartoast = this.shellService.getToolbarToastFeature();
        this.toolbartoast.showVantageToolbarToast();
    }
}

