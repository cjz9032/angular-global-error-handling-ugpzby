import { Injectable } from "@angular/core";
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { LoggerService } from './../../services/logger/logger.service';

@Injectable({
    providedIn: 'root'
})
export class ToolbarToastService {
    toolbartoast: any;
    constructor(
        private shellService: VantageShellService,
        private logger: LoggerService
    ) {

    }
    // showVantageToolbarToast() {
	//     this.logger.debug('toolBarToast service Call showVantageToolbarToast ');
    //     this.toolbartoast = this.shellService.getToolbarToastFeature();
    //     this.toolbartoast.showVantageToolbarToast();
    // }
}

